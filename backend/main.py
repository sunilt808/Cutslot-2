from fastapi import FastAPI, Depends, HTTPException, status, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, auth, database
from jose import JWTError, jwt
from database import engine, get_db
import datetime
from typing import List, Optional

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LUMIÈRE Atelier - Luxury Elite API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dependencies ---
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Session expired. Please re-enter the luxury atelier.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None: raise credentials_exception
        token_data = schemas.TokenData(username=username, role=payload.get("role"))
    except JWTError: raise credentials_exception
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None: raise credentials_exception
    return user

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin authorization required.")
    return current_user

# --- Logging & Notification Helpers ---
def create_audit_log(db: Session, user_id: int, action: str, details: str = ""):
    db.add(models.AuditLog(user_id=user_id, action=action, details=details))
    db.commit()

def push_notification(db: Session, user_id: int, message: str):
    db.add(models.Notification(user_id=user_id, message=message))
    db.commit()

# --- Auth & Roles ---

@app.post("/token", response_model=schemas.Token)
async def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid elite credentials")
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    create_audit_log(db, user.id, "LOGIN", f"Accessed role: {user.role}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.UserInDB)
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already claimed")
    
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
        role=user.role,
        assigned_floor=user.assigned_floor if user.role == models.UserRole.STAFF else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    create_audit_log(db, db_user.id, "SIGNUP", f"Registered as {user.role}")
    push_notification(db, db_user.id, f"Welcome to LUMIÈRE, {user.username}. Experience excellence.")
    return db_user

# --- Statistics & Dashboards ---

@app.get("/admin/stats", response_model=schemas.AdminStats)
async def get_admin_stats(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_rev = db.query(func.sum(models.Booking.price_paid)).filter(models.Booking.status == models.BookingStatus.COMPLETED).scalar() or 0.0
    total_bookings = db.query(models.Booking).count()
    active_users = db.query(models.User).count()
    avg_rating = db.query(func.avg(models.Review.rating)).scalar() or 0.0
    return {"total_revenue": total_rev, "total_bookings": total_bookings, "active_users": active_users, "avg_rating": round(avg_rating, 1)}

@app.get("/worker/stats", response_model=schemas.WorkerStats)
async def get_worker_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != models.UserRole.STAFF: raise HTTPException(status_code=403)
    rev = db.query(func.sum(models.Booking.price_paid)).filter(models.Booking.floor == current_user.assigned_floor, models.Booking.status == models.BookingStatus.COMPLETED).scalar() or 0.0
    completed = db.query(models.Booking).filter(models.Booking.floor == current_user.assigned_floor, models.Booking.status == models.BookingStatus.COMPLETED).count()
    queue = db.query(models.Booking).filter(models.Booking.floor == current_user.assigned_floor, models.Booking.status == models.BookingStatus.CONFIRMED).count()
    return {"assigned_floor": current_user.assigned_floor, "personal_revenue": rev, "completed_bookings": completed, "upcoming_queue": queue}

@app.get("/client/wallet")
async def get_client_wallet(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    total_spent = db.query(func.sum(models.Booking.price_paid)).filter(models.Booking.user_id == current_user.id).scalar() or 0.0
    return {"total_spent": total_spent, "loyalty_points": current_user.loyalty_points}

# --- Bookings & Intelligent Advance Algorithm ---

@app.post("/bookings/", response_model=schemas.BookingInDB)
async def create_booking(booking: schemas.BookingCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Basic Algorithm: Check for slot collisions
    existing = db.query(models.Booking).filter(
        models.Booking.floor == booking.floor,
        models.Booking.booking_time == booking.booking_time,
        models.Booking.status != models.BookingStatus.CANCELLED
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Requested slot is already reserved by another elite member.")
    
    service = db.query(models.Service).filter(models.Service.id == booking.service_id).first()
    if not service: raise HTTPException(status_code=404)
    
    db_booking = models.Booking(
        user_id=current_user.id, service_id=booking.service_id, floor=booking.floor,
        stylist_name=booking.stylist_name, booking_time=booking.booking_time,
        price_paid=service.price, status=models.BookingStatus.PENDING
    )
    db.add(db_booking)
    current_user.loyalty_points += 100 # Award points
    db.commit()
    db.refresh(db_booking)
    
    create_audit_log(db, current_user.id, "BOOKING", f"Created booking #{db_booking.id} on floor {booking.floor}")
    push_notification(db, current_user.id, f"Your reservation for {service.name} is awaiting confirmation.")
    return db_booking

@app.get("/bookings/", response_model=List[schemas.BookingInDB])
async def list_bookings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = db.query(models.Booking)
    if current_user.role == models.UserRole.STAFF:
        query = query.filter(models.Booking.floor == current_user.assigned_floor)
    elif current_user.role == models.UserRole.CUSTOMER:
        query = query.filter(models.Booking.user_id == current_user.id)
    return query.all()

@app.put("/bookings/{id}/status")
async def update_status(id: int, status: str = Body(..., embed=True), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == id).first()
    if not booking: raise HTTPException(status_code=404)
    booking.status = status
    db.commit()
    push_notification(db, booking.user_id, f"Booking status updated: {status.upper()}")
    return {"msg": "Status updated successfully"}

# --- Reviews & Notifications ---

@app.post("/reviews/", response_model=schemas.ReviewInDB)
async def post_review(review: schemas.ReviewBase, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_review = models.Review(user_id=current_user.id, **review.dict())
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    push_notification(db, current_user.id, "Thank you for sharing your feedback with the atelier.")
    return db_review

@app.get("/notifications/", response_model=List[schemas.NotificationInDB])
async def get_notifications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(models.Notification).filter(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc()).all()

# --- Helpers ---

@app.get("/services/", response_model=List[schemas.ServiceInDB])
async def list_services(floor: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Service)
    if floor: q = q.filter(models.Service.floor == floor)
    return q.all()

@app.get("/subscriptions/", response_model=List[schemas.SubscriptionInDB])
async def list_subs(db: Session = Depends(get_db)):
    return db.query(models.Subscription).all()

@app.post("/seed/")
async def seed_elite_data(db: Session = Depends(get_db)):
    if db.query(models.Service).count() > 0: return {"msg": "Atelier already initialized"}
    # Services
    db.add_all([
        models.Service(name="Royal Haircut", description="Master level precision", price=800, duration=45, floor=1, category="Hair"),
        models.Service(name="Elite Spa", description="Full body rejuvenation", price=3000, duration=90, floor=3, category="Spa"),
        models.Service(name="Diamond Glow", description="Premium facial treatment", price=5000, duration=120, floor=4, category="Premium")
    ])
    # Users
    db.add_all([
        models.User(username="admin", email="admin@lumiere.com", hashed_password=auth.get_password_hash("admin123"), role="admin"),
        models.User(username="worker1", email="worker1@lumiere.com", hashed_password=auth.get_password_hash("worker123"), role="staff", assigned_floor=1),
        models.User(username="client1", email="client1@lumiere.com", hashed_password=auth.get_password_hash("client123"), role="customer")
    ])
    db.commit()
    return {"msg": "Elite Atelier initialized successfully."}
