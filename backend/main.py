from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from . import models, schemas, auth, database
from jose import JWTError, jwt
from .database import engine, get_db
import datetime
from typing import List

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LUMIÈRE Atelier - CutSlot API", version="1.0.0")

# CORS middleware for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dependency ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        role: str = payload.get("role")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username, role=role)
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
    return user

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user

# --- Logging Helper ---
def create_audit_log(db: Session, user_id: int, action: str, details: str = ""):
    log_entry = models.AuditLog(user_id=user_id, action=action, details=details)
    db.add(log_entry)
    db.commit()

# --- Auth Routes ---

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = datetime.timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username, "role": user.role}, expires_delta=access_token_expires
    )
    create_audit_log(db, user.id, "LOGIN", f"User logged in from {form_data.username}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.UserInDB)
async def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    # Check if first user, make admin
    is_first = db.query(models.User).count() == 0
    role = models.UserRole.ADMIN if is_first else models.UserRole.CUSTOMER
    
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        role=role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    create_audit_log(db, db_user.id, "SIGNUP", f"User registered as {role}")
    return db_user

@app.get("/users/me", response_model=schemas.UserInDB)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Service Routes ---

@app.get("/services/", response_model=List[schemas.ServiceInDB])
async def read_services(floor: int = None, db: Session = Depends(get_db)):
    query = db.query(models.Service)
    if floor:
        query = query.filter(models.Service.floor == floor)
    return query.all()

# --- Booking Routes ---

@app.post("/bookings/", response_model=schemas.BookingInDB)
async def create_booking(booking: schemas.BookingCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_booking = models.Booking(
        user_id=current_user.id,
        service_id=booking.service_id,
        floor=booking.floor,
        stylist_name=booking.stylist_name,
        booking_time=booking.booking_time,
        status=models.BookingStatus.PENDING
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    create_audit_log(db, current_user.id, "BOOKING_CREATE", f"Booking ID {db_booking.id} created")
    return db_booking

@app.get("/bookings/", response_model=List[schemas.BookingInDB])
async def read_bookings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == models.UserRole.ADMIN or current_user.role == models.UserRole.STAFF:
        return db.query(models.Booking).all()
    else:
        return db.query(models.Booking).filter(models.Booking.user_id == current_user.id).all()

@app.put("/bookings/{booking_id}/status", response_model=schemas.BookingInDB)
async def update_booking_status(booking_id: int, status: str = Body(..., embed=True), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in [models.UserRole.ADMIN, models.UserRole.STAFF]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    db_booking.status = status
    db.commit()
    db.refresh(db_booking)
    create_audit_log(db, current_user.id, "BOOKING_UPDATE", f"Booking ID {booking_id} status changed to {status}")
    return db_booking

# --- Audit Logs ---

@app.get("/audit-logs/", response_model=List[schemas.AuditLogInDB])
async def read_audit_logs(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.AuditLog).all()

# --- Subscription Routes ---

@app.get("/subscriptions/", response_model=List[schemas.SubscriptionInDB])
async def read_subscriptions(db: Session = Depends(get_db)):
    return db.query(models.Subscription).all()

# --- Seed Initial Data ---

@app.post("/seed/")
async def seed_data(db: Session = Depends(get_db)):
    # Check if data exists
    if db.query(models.Service).count() > 0:
        return {"msg": "Data already seeded"}
    
    # Floor 1: Common - Haircuts, wellness (Males)
    f1_services = [
        models.Service(name="Signature Haircut", description="Classic luxury haircut by senior stylists", price=500, duration=30, floor=1, category="Hair"),
        models.Service(name="Beard Sculpting", description="Precision beard grooming and styling", price=300, duration=20, floor=1, category="Grooming"),
        models.Service(name="Scalp Detox", description="Revitalizing scalp treatment with essential oils", price=800, duration=45, floor=1, category="Wellness")
    ]
    
    # Floor 2: General - Massage, facial, nails, grooming (Males)
    f2_services = [
        models.Service(name="Deep Tissue Massage", description="Relieve chronic muscle tension and stress", price=1500, duration=60, floor=2, category="Wellness"),
        models.Service(name="Anti-Aging Facial", description="Luxurious facial with premium skin products", price=2000, duration=60, floor=2, category="Skin Care"),
        models.Service(name="Elite Manicure", description="Complete hand and nail grooming", price=600, duration=40, floor=2, category="Nails")
    ]
    
    # Floor 3: Female-only - Spa, styling, beauty therapy
    f3_services = [
        models.Service(name="Royal Spa Ritual", description="Ultimate relaxation with full body spa", price=2500, duration=90, floor=3, category="Spa"),
        models.Service(name="Couture Styling", description="Advanced hair styling for events", price=1800, duration=60, floor=3, category="Styling"),
        models.Service(name="Glow Therapy", description="Comprehensive skin brightening and rejuvenation", price=3000, duration=75, floor=3, category="Beauty")
    ]
    
    # Floor 4: Premium & Advance
    f4_services = [
        models.Service(name="Diamond VIP Session", description="Private session with master stylist + perks", price=5000, duration=120, floor=4, category="Premium"),
        models.Service(name="Subscription Onboarding", description="Exclusive consultation for yearly members", price=0, duration=30, floor=4, category="Membership")
    ]
    
    # Subscriptions
    subs = [
        models.Subscription(name="Silver Monthly", price=2000, duration_days=30, perks="2 Haircuts + 1 Facial"),
        models.Subscription(name="Gold Quarterly", price=5500, duration_days=90, perks="Unlimited Haircuts + 10% Off Services"),
        models.Subscription(name="Platinum Yearly", price=20000, duration_days=365, perks="VIP Access + Unlimited All Floor Access + Private Stylist")
    ]
    
    db.add_all(f1_services + f2_services + f3_services + f4_services + subs)
    db.commit()
    return {"msg": "Data seeded successfully"}
