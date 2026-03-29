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

@app.get("/users/me", response_model=schemas.UserInDB)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/token", response_model=schemas.Token)
async def login(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid elite credentials")
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="Elite access pending administrative approval.")
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    create_audit_log(db, user.id, "LOGIN", f"Accessed role: {user.role}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.UserInDB)
async def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already claimed")
    
    # Logic: Customers/Admins auto-approved. Workers need permission.
    is_approved = True if user.role != models.UserRole.STAFF else False
    
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=auth.get_password_hash(user.password),
        role=user.role,
        is_approved=is_approved,
        assigned_floor=user.role == models.UserRole.STAFF and user.assigned_floor or None,
        gender=user.gender,
        phone=user.phone
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

@app.get("/admin/workers", response_model=List[schemas.UserInDB])
async def list_workers(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == models.UserRole.STAFF).all()

@app.put("/admin/workers/{user_id}")
async def update_worker_admin(user_id: int, data: dict = Body(...), current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == user_id).first()
    if not worker: raise HTTPException(status_code=404)
    for key, value in data.items():
        if hasattr(worker, key) and key != "hashed_password":
            setattr(worker, key, value)
    db.commit()
    return {"msg": "Worker updated."}

@app.get("/admin/audits", response_model=List[schemas.AuditLogInDB])
async def get_all_audits(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.AuditLog).order_by(models.AuditLog.timestamp.desc()).limit(100).all()

# --- Service Management (CRUD) ---

@app.post("/admin/services/", response_model=schemas.ServiceInDB)
async def create_service(service: schemas.ServiceBase, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_service = models.Service(**service.dict())
    db.add(db_service)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.put("/admin/services/{service_id}", response_model=schemas.ServiceInDB)
async def update_service(service_id: int, service_data: dict = Body(...), current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_service: raise HTTPException(status_code=404)
    for key, value in service_data.items():
        if hasattr(db_service, key):
            setattr(db_service, key, value)
    db.commit()
    db.refresh(db_service)
    return db_service

@app.delete("/admin/services/{service_id}")
async def delete_service(service_id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_service = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_service: raise HTTPException(status_code=404)
    db.delete(db_service)
    db.commit()
    return {"msg": "Service removed."}

@app.get("/admin/revenue/report")
async def get_revenue_report(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    # Group by floor
    floor_rev = db.query(models.Booking.floor, func.sum(models.Booking.price_paid)).filter(models.Booking.status == models.BookingStatus.COMPLETED).group_by(models.Booking.floor).all()
    # Group by category (via join)
    cat_rev = db.query(models.Service.category, func.sum(models.Booking.price_paid)).join(models.Booking).filter(models.Booking.status == models.BookingStatus.COMPLETED).group_by(models.Service.category).all()
    
    return {
        "by_floor": {f"Floor {f}": rev for f, rev in floor_rev},
        "by_category": {cat: rev for cat, rev in cat_rev},
        "total": sum(rev for _, rev in floor_rev)
    }

@app.put("/admin/workers/{user_id}/approve")
async def approve_worker(user_id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == user_id, models.User.role == models.UserRole.STAFF).first()
    if not worker: raise HTTPException(status_code=404)
    worker.is_approved = True
    db.commit()
    push_notification(db, worker.id, "Elite clearance granted. You may now access your terminal.")
    return {"msg": f"Worker {worker.username} approved."}

@app.delete("/admin/workers/{user_id}")
async def delete_worker(user_id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == user_id, models.User.role == models.UserRole.STAFF).first()
    if not worker: raise HTTPException(status_code=404)
    db.delete(worker)
    db.commit()
    return {"msg": "Worker profile decommissioned."}

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

@app.get("/reset-db")
async def reset_db(db: Session = Depends(get_db)):
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    await seed_elite_data(db)
    return {"msg": "Database reset with new schema and seeded successfully."}

@app.post("/seed/")
async def seed_elite_data(db: Session = Depends(get_db)):
    if db.query(models.Service).count() > 0: return {"msg": "Atelier already initialized"}
    
    # 💎 GENERAL SERVICES (FLOOR 1)
    general = [
        models.Service(name="Men’s Hair Cut", description="Stylish haircut tailored for men.", price=500, duration=45, floor=1, category="common"),
        models.Service(name="Women’s Hair Cut", description="Modern haircut for women of all ages.", price=1200, duration=60, floor=1, category="common"),
        models.Service(name="Beard Trim", description="Neat shaping and grooming of beard.", price=400, duration=30, floor=1, category="common"),
        models.Service(name="Hair Color – Root Touchup", description="Covers grey hair and blends naturally.", price=1500, duration=75, floor=1, category="common"),
        models.Service(name="Hair Color – Full Head", description="Rich, long-lasting hair coloring.", price=2500, duration=90, floor=1, category="common"),
        models.Service(name="Hair Spa", description="Deep conditioning for smooth and shiny hair.", price=1000, duration=60, floor=1, category="common"),
        models.Service(name="Keratin Treatment", description="Smooths frizz and adds shine.", price=5000, duration=120, floor=1, category="common"),
        models.Service(name="Head Massage", description="Relaxing scalp massage for stress relief.", price=600, duration=30, floor=1, category="common"),
        models.Service(name="Hair Wash & Blowdry", description="Professional hair wash and styling.", price=700, duration=40, floor=1, category="common"),
        models.Service(name="Hot Oil Treatment", description="Nourishing oil treatment for hair health.", price=900, duration=50, floor=1, category="common"),
        models.Service(name="Men’s Hair Coloring", description="Stylish hair coloring options.", price=1200, duration=60, floor=1, category="common"),
        models.Service(name="Hair Straightening", description="Temporary straightening and smoothing.", price=2000, duration=90, floor=1, category="common"),
        models.Service(name="Hair Perming", description="Long-lasting curls and waves.", price=2500, duration=120, floor=1, category="common"),
        models.Service(name="Beard Coloring", description="Professional beard coloring.", price=800, duration=30, floor=1, category="common"),
        models.Service(name="Eyebrow Shaping", description="Precise eyebrow shaping for men and women.", price=300, duration=20, floor=1, category="common"),
        models.Service(name="Facial Massage", description="Relaxing face massage with premium oils.", price=700, duration=40, floor=1, category="common"),
        models.Service(name="Hair Treatment for Dandruff", description="Reduces dandruff and soothes scalp.", price=900, duration=50, floor=1, category="common"),
        models.Service(name="Children’s Hair Cut", description="Gentle haircut for kids.", price=400, duration=30, floor=1, category="common"),
        models.Service(name="Men’s Styling", description="Professional styling and grooming.", price=800, duration=45, floor=1, category="common"),
        models.Service(name="Women’s Styling", description="Hair styling for special occasions.", price=1500, duration=60, floor=1, category="common"),
    ]

    # 💄 BEAUTY SERVICES (FLOOR 3)
    beauty = [
        models.Service(name="Basic Facial", description="Cleansing and rejuvenation facial.", price=1200, duration=60, floor=3, category="female"),
        models.Service(name="Gold Facial", description="Luxury facial with gold infusion.", price=4500, duration=75, floor=3, category="female"),
        models.Service(name="Hydrating Facial", description="Deep hydration for glowing skin.", price=2000, duration=60, floor=3, category="female"),
        models.Service(name="Anti-Aging Facial", description="Reduces wrinkles and fine lines.", price=3500, duration=70, floor=3, category="female"),
        models.Service(name="Bleach Treatment", description="Removes facial hair and brightens skin.", price=800, duration=30, floor=3, category="female"),
        models.Service(name="Waxing – Full Arms", description="Smooth and hair-free arms.", price=700, duration=25, floor=3, category="female"),
        models.Service(name="Waxing – Full Legs", description="Smooth and hair-free legs.", price=1200, duration=45, floor=3, category="female"),
        models.Service(name="Underarm Waxing", description="Hair-free underarms.", price=400, duration=20, floor=3, category="female"),
        models.Service(name="Bikini Waxing", description="Professional bikini hair removal.", price=1200, duration=40, floor=3, category="female"),
        models.Service(name="Manicure", description="Nail care and polish.", price=800, duration=40, floor=3, category="female"),
        models.Service(name="Pedicure", description="Foot care and polish.", price=1000, duration=50, floor=3, category="female"),
        models.Service(name="Bridal Makeup", description="Luxury makeup for weddings.", price=8000, duration=120, floor=3, category="female"),
        models.Service(name="Party Makeup", description="Makeup for parties and events.", price=3500, duration=90, floor=3, category="female"),
        models.Service(name="Threading – Eyebrows", description="Precise eyebrow shaping.", price=400, duration=20, floor=3, category="female"),
        models.Service(name="Threading – Upper Lip", description="Gentle upper lip hair removal.", price=250, duration=15, floor=3, category="female"),
        models.Service(name="Body Scrub", description="Exfoliating body treatment.", price=1800, duration=50, floor=3, category="female"),
        models.Service(name="Massage – Full Body", description="Relaxing full-body massage.", price=2500, duration=60, floor=3, category="female"),
        models.Service(name="Anti-Tan Treatment", description="Removes tan and brightens skin.", price=2000, duration=45, floor=3, category="female"),
        models.Service(name="Facial Hair Removal", description="Gentle facial hair removal.", price=700, duration=30, floor=3, category="female"),
        models.Service(name="Acne Treatment", description="Reduces pimples and prevents breakouts.", price=2500, duration=60, floor=3, category="female"),
    ]

    # 👑 MEMBERSHIP (FLOOR 4)
    membership = [
        models.Service(name="Gold Membership", description="30% off on all services + VIP access.", price=15000, duration=0, floor=4, category="subscription"),
        models.Service(name="Platinum Membership", description="50% off on select services + priority booking.", price=25000, duration=0, floor=4, category="subscription"),
        models.Service(name="Silver Membership", description="20% off on services with flexible schedule.", price=10000, duration=0, floor=4, category="subscription"),
        models.Service(name="Premium Hair Plan", description="Hair care and styling package.", price=12000, duration=0, floor=4, category="subscription"),
        models.Service(name="Beauty Deluxe Plan", description="Full beauty and spa treatments.", price=18000, duration=0, floor=4, category="subscription"),
        models.Service(name="VIP Hair & Spa Combo", description="Exclusive luxury hair + spa services.", price=30000, duration=0, floor=4, category="subscription"),
        models.Service(name="Facial Care Plan", description="Monthly facial and skincare treatments.", price=10000, duration=0, floor=4, category="subscription"),
        models.Service(name="Complete Grooming Plan", description="Hair + beard + facial care.", price=20000, duration=0, floor=4, category="subscription"),
        models.Service(name="Annual Membership", description="Unlimited access to all services for a year.", price=50000, duration=0, floor=4, category="subscription"),
        models.Service(name="Hair & Beauty Combo", description="Haircuts + spa + facial monthly.", price=22000, duration=0, floor=4, category="subscription"),
        models.Service(name="Luxury Skin Plan", description="Deep skin care treatments monthly.", price=18000, duration=0, floor=4, category="subscription"),
        models.Service(name="VIP Relaxation Package", description="Premium massage & spa access.", price=25000, duration=0, floor=4, category="subscription"),
        models.Service(name="Bridal Pre-Wedding Plan", description="Full preparation for brides.", price=40000, duration=0, floor=4, category="subscription"),
        models.Service(name="Men’s Grooming Plan", description="Hair, beard, facial monthly.", price=15000, duration=0, floor=4, category="subscription"),
        models.Service(name="Skin Brightening Plan", description="Monthly facials and peel treatments.", price=17000, duration=0, floor=4, category="subscription"),
        models.Service(name="Spa Therapy Plan", description="Regular massage and relaxation therapy.", price=20000, duration=0, floor=4, category="subscription"),
        models.Service(name="Hair Color Plan", description="Root touch-ups + color maintenance monthly.", price=15000, duration=0, floor=4, category="subscription"),
        models.Service(name="Luxury Combo Plan", description="Hair + beauty + spa monthly package.", price=30000, duration=0, floor=4, category="subscription"),
        models.Service(name="Facial & Skin Care Plan", description="Monthly facials and skincare.", price=16000, duration=0, floor=4, category="subscription"),
        models.Service(name="Ultimate VIP Membership", description="All services with priority access.", price=50000, duration=0, floor=4, category="subscription"),
    ]

    # ⚡ VIP / ADVANCE (FLOOR 2)
    vip = [
        models.Service(name="Private Hair Styling", description="Exclusive session with top stylist.", price=4000, duration=60, floor=2, category="advance"),
        models.Service(name="VIP Spa Therapy", description="Full body luxury spa experience.", price=8000, duration=90, floor=2, category="advance"),
        models.Service(name="One-on-One Makeup", description="Personalized makeup session.", price=6000, duration=60, floor=2, category="advance"),
        models.Service(name="Bridal VIP Session", description="Dedicated bridal preparation room.", price=12000, duration=120, floor=2, category="advance"),
        models.Service(name="Hair & Facial VIP Combo", description="Premium hair + facial in private suite.", price=10000, duration=90, floor=2, category="advance"),
        models.Service(name="Personal Grooming VIP", description="Luxury grooming in private room.", price=5000, duration=60, floor=2, category="advance"),
        models.Service(name="VIP Hair Treatment", description="Keratin or spa in private setting.", price=7000, duration=75, floor=2, category="advance"),
        models.Service(name="Luxury Massage VIP", description="Full body massage with aromatherapy.", price=6000, duration=60, floor=2, category="advance"),
        models.Service(name="VIP Hair Coloring", description="Private hair coloring session.", price=5000, duration=90, floor=2, category="advance"),
        models.Service(name="Exclusive Facial VIP", description="Premium facial in private room.", price=4000, duration=60, floor=2, category="advance"),
        models.Service(name="VIP Manicure & Pedicure", description="Luxury nail treatment.", price=3000, duration=45, floor=2, category="advance"),
        models.Service(name="VIP Body Scrub", description="Exfoliating treatment in private suite.", price=4000, duration=50, floor=2, category="advance"),
        models.Service(name="VIP Anti-Aging Facial", description="Luxury anti-aging treatment.", price=6000, duration=75, floor=2, category="advance"),
        models.Service(name="VIP Hair Rebonding", description="Private hair smoothing treatment.", price=9000, duration=120, floor=2, category="advance"),
        models.Service(name="VIP Hair Perm", description="Curling in exclusive session.", price=8000, duration=120, floor=2, category="advance"),
        models.Service(name="VIP Bridal Makeup", description="Bridal makeup in privacy.", price=12000, duration=120, floor=2, category="advance"),
        models.Service(name="VIP Hair Cut & Styling", description="Luxury haircut + styling.", price=5000, duration=60, floor=2, category="advance"),
        models.Service(name="VIP Body Massage Combo", description="Massage and aromatherapy.", price=7000, duration=75, floor=2, category="advance"),
        models.Service(name="VIP Couples Session", description="Private grooming for couples.", price=10000, duration=90, floor=2, category="advance"),
        models.Service(name="Ultimate VIP Experience", description="All premium services in private.", price=25000, duration=180, floor=2, category="advance"),
    ]

    db.add_all(general + beauty + membership + vip)
    
    # Users
    db.add_all([
        models.User(username="admin", email="admin@lumiere.com", hashed_password=auth.get_password_hash("admin123"), role="admin"),
        models.User(username="worker1", email="worker1@lumiere.com", hashed_password=auth.get_password_hash("worker123"), role="staff", assigned_floor=1),
        models.User(username="client1", email="client1@lumiere.com", hashed_password=auth.get_password_hash("client123"), role="customer")
    ])
    db.commit()
    return {"msg": "Elite Atelier initialized with 80+ Premium Services."}
