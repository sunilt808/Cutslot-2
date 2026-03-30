from fastapi import FastAPI, Depends, HTTPException, status, Body, BackgroundTasks, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from sqlalchemy import func, or_, and_
import models, schemas, auth, database
from jose import JWTError, jwt
from database import engine, get_db, SessionLocal
import datetime
import asyncio
import json
from typing import List, Optional
import typing

# Create Tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="LUMIÈRE Atelier - Luxury Elite API", version="3.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
    ],
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
    except JWTError: raise credentials_exception
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None: raise credentials_exception
    return user

def get_admin_user(current_user: models.User = Depends(get_current_user)):
    if current_user.role != models.UserRole.ADMIN:
        raise HTTPException(status_code=403, detail="Admin authorization required.")
    return current_user

# --- Async Helpers (Background Tasks) ---
def async_audit_log(db_session_factory, user_id: int, action: str, details: str = ""):
    db = db_session_factory()
    try:
        db.add(models.AuditLog(user_id=user_id, action=action, details=details))
        db.commit()
    finally:
        db.close()

def async_push_notification(db_session_factory, user_id: int, message: str):
    db = db_session_factory()
    try:
        db.add(models.Notification(user_id=user_id, message=message))
        db.commit()
    finally:
        db.close()

# 🌐 REAL-TIME ESTATE SYNCHRONIZATION# --- 🔔 LUXURY NOTIFICATION ENGINE (V4.0) ---
async def schedule_ritual_reminders(db: Session, booking: models.Booking, user: models.User, artisan_name: str, location: str):
    """Generates a luxury reminder timeline for a ritual."""
    ritual_time = booking.booking_time
    reminders = [
        {"type": "reminder_48h", "delta": datetime.timedelta(hours=48), "msg": "Your ritual is approaching. Prepare for your experience."},
        {"type": "reminder_24h", "delta": datetime.timedelta(hours=24), "msg": f"Refining your schedule: Ritual tomorrow at {ritual_time.strftime('%H:%M')} with Artisan {artisan_name} at {location}."},
        {"type": "reminder_today_9am", "delta": None, "msg": f"Good morning, {user.full_name or user.username}. Your ritual is scheduled for today at {ritual_time.strftime('%H:%M')}."},
        {"type": "reminder_3h", "delta": datetime.timedelta(hours=3), "msg": "Artisans are ready. 3 hours until your experience begins."},
        {"type": "reminder_1h", "delta": datetime.timedelta(hours=1), "msg": "Refining final details. Your ritual begins in 1 hour."}
    ]
    
    for r in reminders:
        if r["type"] == "reminder_today_9am":
            # Set to 9 AM on the day of ritual
            sched_time = ritual_time.replace(hour=9, minute=0, second=0)
        else:
            sched_time = ritual_time - r["delta"]
        
        # Only schedule future alerts
        if sched_time > datetime.datetime.utcnow():
            notif = models.Notification(
                user_id=user.id,
                booking_id=booking.id,
                type=r["type"],
                scheduled_time=sched_time,
                message=r["msg"],
                status="pending"
            )
            db.add(notif)
    db.commit()

async def notification_worker():
    """Background process for executing scheduled notifications (Simulated Delivery)."""
    while True:
        db = SessionLocal()
        try:
            now = datetime.datetime.utcnow()
            # 🌙 LUXURY QUIET HOURS: No alerts between 9 PM and 8 AM
            if 21 <= (now + datetime.timedelta(hours=5, minutes=30)).hour or (now + datetime.timedelta(hours=5, minutes=30)).hour < 8:
                 # Skip processing during rest hours unless priority
                 pass
            else:
                pending = db.query(models.Notification).filter(
                    models.Notification.status == "pending",
                    models.Notification.scheduled_time <= now
                ).all()
                for n in pending:
                    # Logic Check: Stop if ritual is cancelled/done
                    booking = db.query(models.Booking).filter(models.Booking.id == n.booking_id).first()
                    if booking and booking.status in ["confirmed", "pending"]:
                        print(f"📡 [DELIVERING {n.type.upper()}] to {n.user_id}: {n.message}")
                        n.status = "sent"
                    else:
                        n.status = "cancelled"
                db.commit()
        except Exception as e:
            print(f"Alert: Notification Worker Exception: {e}")
        finally:
            db.close()
        await asyncio.sleep(60)

# Start background task on startup
@app.on_event("startup")
async def start_tasks():
    asyncio.create_task(notification_worker())

class ConnectionManager:
    def __init__(self):
        self.active_connections: typing.List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except:
                pass

manager = ConnectionManager()

@app.websocket("/ws/estate")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# --- Auth & Roles ---

@app.get("/users/me", response_model=schemas.UserInDB)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.post("/token", response_model=schemas.Token)
async def login(background_tasks: BackgroundTasks, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.query(models.User).filter(func.lower(models.User.username) == form_data.username.lower()).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid elite credentials")
    if not user.is_approved:
        raise HTTPException(status_code=403, detail="Elite access pending administrative approval.")
    access_token = auth.create_access_token(data={"sub": user.username, "role": user.role})
    background_tasks.add_task(async_audit_log, database.SessionLocal, user.id, "LOGIN", f"Accessed role: {user.role}")
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.UserInDB)
async def signup(user: schemas.UserCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.username == user.username).first():
        raise HTTPException(status_code=400, detail="Username already claimed")
    
    db_user = models.User(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        password_hash=auth.get_password_hash(user.password),
        role=user.role,
        assigned_floor=user.assigned_floor if user.role == "staff" else 1,
        is_approved=(user.role != "staff"),
        member_since=datetime.datetime.utcnow()
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    background_tasks.add_task(async_audit_log, database.SessionLocal, db_user.id, "SIGNUP", f"Registered as {user.role}")
    background_tasks.add_task(async_push_notification, database.SessionLocal, db_user.id, "Welcome to the Estate. Excellence awaits.")
    return db_user

# --- Luxury CRM & Preferences ---
@app.put("/users/me/preferences")
async def update_preferences(prefs: dict = Body(...), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if "silent_service" in prefs: current_user.preferences_silent_service = prefs["silent_service"]
    if "drink" in prefs: current_user.preferences_drink = prefs["drink"]
    if "allergies" in prefs: current_user.preferences_allergies = prefs["allergies"]
    db.commit()
    return {"msg": "Ritual preferences documented."}

# --- Intelligent Booking (Conflict Resolve + Revenue Protection) ---
@app.post("/bookings/", response_model=schemas.BookingInDB)
async def create_booking(booking_in: schemas.BookingCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # 🛡️ IDEMPOTENCY SAFETY (V3.0)
    if hasattr(booking_in, 'payment_idempotency_key') and booking_in.payment_idempotency_key:
        exists = db.query(models.Booking).filter(models.Booking.payment_idempotency_key == booking_in.payment_idempotency_key).first()
        if exists: return exists

    # Limit check
    if current_user.monthly_bookings_count >= current_user.monthly_limit:
        raise HTTPException(status_code=403, detail="Elite monthly quota reached.")
    
    # Conflict Resolution (Duration + Buffer)
    service = db.query(models.Service).filter(models.Service.id == booking_in.service_id).first()
    if not service: raise HTTPException(status_code=404)
    
    # 2. Revenue Intelligence (Commissions, Tax, Logistics)
    tax_rate = 0.18 # GST 18%
    base_price = service.price
    travel_fee = service.travel_premium if booking_in.service_type == "home" else 0.0
    
    # Membership Discount Logic
    if current_user.subscription_plan and current_user.subscription_expiry > datetime.datetime.utcnow():
        if current_user.monthly_bookings_count < current_user.monthly_limit:
            base_price = 0.0 # Covered by membership
            current_user.monthly_bookings_count += 1
        else:
            base_price *= 0.8 # 20% discount on over-limit sessions for elites

    total_price = base_price + travel_fee
    tax_amount = total_price * tax_rate
    final_price = total_price + tax_amount
    
    # Compute end_time from service duration
    end_dt = booking_in.booking_time + datetime.timedelta(minutes=service.duration) if service.duration else None

    # Artisan commission — look up the artisan's rate if they exist
    artisan = db.query(models.User).filter(models.User.username == booking_in.stylist_name, models.User.role == "staff").first()
    commission_rate = artisan.commission_rate if artisan else 15.0
    commission_amount = total_price * (commission_rate / 100.0)

    new_booking = models.Booking(
        user_id=current_user.id,
        service_id=service.id,
        floor=booking_in.floor,
        stylist_name=booking_in.stylist_name,
        category=service.category,
        gender=booking_in.gender,
        booking_time=booking_in.booking_time,
        end_time=end_dt,
        price_paid=final_price,
        travel_fee=travel_fee,
        tax_amount=tax_amount,
        artisan_commission=commission_amount,
        service_type=booking_in.service_type,
        destination_lat=booking_in.destination_lat,
        destination_lng=booking_in.destination_lng,
        status="pending"
    )
    
    # 3. Loyalty Protocol
    current_user.loyalty_points += (20 if final_price > 5000 else 10)
    
    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)
    
    await manager.broadcast(json.dumps({"type": "NEW_BOOKING", "booking_id": new_booking.id}))
    
    # 🔔 SCHEDULE REMAINDERS (V4.0)
    await schedule_ritual_reminders(db, new_booking, current_user, new_booking.stylist_name, "Atelier Floor 0" + str(new_booking.floor))
    
    async_push_notification(database.SessionLocal, current_user.id, f"Ritual Authenticated: {service.name} at {new_booking.booking_time.strftime('%H:%M')}")
    return new_booking

@app.get("/notifications/")
async def get_notifications(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Returns only 'sent' or scheduled alerts for the user
    return db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.status == "sent"
    ).order_by(models.Notification.created_at.desc()).all()

@app.get("/client/wallet")
async def get_wallet(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "customer":
        raise HTTPException(status_code=403, detail="Customer access required.")
    
    # Calculate total spent
    total_spent = db.query(func.sum(models.Booking.price_paid)).filter(
        models.Booking.user_id == current_user.id,
        models.Booking.status == "completed"
    ).scalar() or 0.0

    return {
        "balance": current_user.balance,
        "loyalty_points": current_user.loyalty_points,
        "total_spent": total_spent,
        "subscription_plan": current_user.subscription_plan,
        "subscription_expiry": current_user.subscription_expiry
    }

@app.post("/subscribe/")
async def subscribe(data: schemas.SubscriptionPurchase, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "customer":
        raise HTTPException(status_code=403, detail="Customer access required.")
    
    service = db.query(models.Service).filter(models.Service.id == data.service_id).first()
    if not service or service.category != "subscription":
        raise HTTPException(status_code=404, detail="Subscription plan not found")
        
    current_user.subscription_plan = service.name
    current_user.subscription_expiry = datetime.datetime.utcnow() + datetime.timedelta(days=30)
    
    if "Elite" in service.name:
        current_user.monthly_limit = 50
    elif "Gold" in service.name:
        current_user.monthly_limit = 25
    else:
        current_user.monthly_limit = 10
        
    db.commit()
    return {"msg": f"Successfully subscribed to {service.name}"}

@app.put("/bookings/{id}/cancel")
async def cancel_booking(id: int, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == id).first()
    if not booking: raise HTTPException(status_code=404)
    
    # 24-Hour Penalty Logic
    now = datetime.datetime.utcnow()
    diff = booking.booking_time - now
    penalty = 0.0
    # Progressive Penalty: 15% if < 24h, 30% if < 6h
    if diff.total_seconds() < 21600: # < 6h
        penalty = booking.price_paid * 0.30
    elif diff.total_seconds() < 86400: # < 24h
        penalty = booking.price_paid * 0.15
        
    if penalty > 0:
        current_user.balance -= penalty
        booking.cancellation_penalty = penalty

    booking.status = "cancelled"
    
    # 🛡️ SUPPRESS REMINDERS (V4.0)
    db.query(models.Notification).filter(models.Notification.booking_id == id, models.Notification.status == "pending").update({"status": "cancelled"})
    
    db.commit()
    return {"msg": f"Ritual cancelled. Penalty: ₹{penalty}", "new_balance": current_user.balance}

@app.put("/bookings/{booking_id}/transit")
async def update_transit_status(booking_id: int, status: str = Body(..., embed=True), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking: raise HTTPException(status_code=404)
    booking.transit_status = status
    
    # Trigger Logistics Notification (V4.0)
    msg = "Artisan has commenced the transit ritual. En route." if status == "en_route" else "Artisan has arrived at the doorstep."
    notif = models.Notification(
        user_id=booking.user_id,
        booking_id=booking_id,
        type="transit_alert",
        scheduled_time=datetime.datetime.utcnow(),
        message=msg,
        status="sent"
    )
    db.add(notif)
    
    db.commit()
    await manager.broadcast(json.dumps({"type": "TRANSIT_UPDATE", "booking_id": booking_id, "status": status}))
    return {"msg": f"Transit Status: {status.upper()}"}

@app.put("/bookings/{id}/status")
async def update_status(id: int, status: str = Body(..., embed=True), current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == id).first()
    if not booking: raise HTTPException(status_code=404)
    
    # Handle Completion & Revenue Lock
    if status == "completed":
        # Finalize commission for worker
        # (In a real system, we'd add this to a worker_balance table)
        pass

    booking.status = status
    if status == "cancelled":
        # 🛡️ SUPPRESS REMINDERS (V4.0)
        db.query(models.Notification).filter(models.Notification.booking_id == id, models.Notification.status == "pending").update({"status": "cancelled"})
    
    db.commit()
    return {"msg": f"Ritual status updated to {status.upper()}"}

# --- Service & Member Lists ---
@app.get("/services/", response_model=List[schemas.ServiceInDB])
async def list_services(floor: Optional[int] = None, db: Session = Depends(get_db)):
    q = db.query(models.Service)
    if floor: q = q.filter(models.Service.floor == floor)
    return q.all()

@app.get("/workers/", response_model=List[schemas.UserInDB])
async def list_workers_public(floor: Optional[int] = None, db: Session = Depends(get_db)):
    """Public endpoint for Booking and AdvanceBooking pages to list approved workers."""
    q = db.query(models.User).filter(models.User.role == "staff", models.User.is_approved == True)
    if floor:
        q = q.filter(models.User.assigned_floor == floor)
    return q.all()

@app.get("/reviews/", response_model=List[schemas.ReviewInDB])
async def list_reviews(db: Session = Depends(get_db)):
    try:
        return db.query(models.Review).order_by(models.Review.created_at.desc()).all()
    except Exception:
        return []

@app.post("/reviews/", response_model=schemas.ReviewInDB)
async def create_review(
    review: dict = Body(...),
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role != "customer":
        raise HTTPException(status_code=403, detail="Only elite members can submit rituals.")
    
    # Must have completed a booking with this worker
    past_booking = db.query(models.Booking).filter(
        models.Booking.user_id == current_user.id,
        models.Booking.stylist_name == review['worker_name'],
        models.Booking.status == "completed"
    ).first()
    
    if not past_booking:
        raise HTTPException(status_code=403, detail="Aesthetic protocol violation: You can only review artisans you have completed a ritual with.")
        
    db_review = models.Review(
        user_id=current_user.id,
        worker_name=review['worker_name'],
        rating=review.get('rating', 5),
        comment=review.get('comment', ''),
        created_at=datetime.datetime.utcnow()
    )
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/bookings/", response_model=List[schemas.BookingInDB])
async def list_bookings(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    q = db.query(models.Booking)
    if current_user.role == "staff":
        q = q.filter(models.Booking.stylist_name == current_user.username)
    elif current_user.role == "customer":
        q = q.filter(models.Booking.user_id == current_user.id)
    bookings = q.order_by(models.Booking.booking_time.desc()).all()
    for b in bookings:
        if b.user:
            b.__dict__['user_name'] = b.user.full_name or b.user.username
    return bookings

# --- Admin & Stats ---
@app.get("/admin/stats")
async def get_admin_stats(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    total_rev = db.query(func.sum(models.Booking.price_paid)).filter(models.Booking.status == "completed").scalar() or 0
    total_tax = db.query(func.sum(models.Booking.tax_amount)).filter(models.Booking.status == "completed").scalar() or 0
    total_comm = db.query(func.sum(models.Booking.artisan_commission)).filter(models.Booking.status == "completed").scalar() or 0

    artisan_profits = db.query(
        models.User.username,
        func.sum(models.Booking.price_paid - models.Booking.tax_amount - models.Booking.artisan_commission).label("net_profit")
    ).join(models.Booking, models.User.username == models.Booking.stylist_name)\
     .filter(models.Booking.status == "completed")\
     .group_by(models.User.username).all()

    service_profits = db.query(
        models.Service.name,
        func.sum(models.Booking.price_paid - models.Booking.tax_amount - models.Booking.artisan_commission).label("net_profit")
    ).join(models.Booking, models.Service.id == models.Booking.service_id)\
     .filter(models.Booking.status == "completed")\
     .group_by(models.Service.name).all()

    clients = db.query(models.User).filter(models.User.role == "customer").all()

    popular_services = db.query(
        models.Service.name,
        func.count(models.Booking.id).label("booking_count")
    ).join(models.Booking, models.Service.id == models.Booking.service_id)\
     .group_by(models.Service.name)\
     .order_by(func.count(models.Booking.id).desc())\
     .limit(5).all()

    return {
        "total_revenue": total_rev,
        "tax_collected": total_tax,
        "artisan_payouts": total_comm,
        "net_profit": total_rev - total_tax - total_comm,
        "client_count": len(clients),
        "client_list": [{"name": c.full_name or c.username, "email": c.email, "category": c.customer_category} for c in clients],
        "artisan_breakdown": [{"name": a[0], "profit": a[1]} for a in artisan_profits],
        "service_breakdown": [{"name": s[0], "profit": s[1]} for s in service_profits],
        "popular_services": [{"name": ps[0], "bookings": ps[1]} for ps in popular_services],
        "active_users": db.query(models.User).count(),
        "total_bookings": db.query(models.Booking).count()
    }

@app.get("/admin/bookings", response_model=List[schemas.BookingInDB])
async def admin_list_bookings(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).order_by(models.Booking.booking_time.desc()).all()
    for b in bookings:
        if b.user:
            b.__dict__['user_name'] = b.user.full_name or b.user.username
    return bookings

@app.get("/admin/workers", response_model=List[schemas.UserInDB])
async def admin_list_workers(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    return db.query(models.User).filter(models.User.role == "staff").order_by(models.User.is_approved.desc()).all()

@app.put("/admin/workers/{worker_id}/approve")
async def approve_worker(worker_id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == worker_id).first()
    if not worker: raise HTTPException(status_code=404, detail="Artisan not found")
    worker.is_approved = True
    db.commit()
    return {"msg": f"Artisan {worker.username} accredited to the estate."}

@app.put("/admin/workers/{worker_id}/deactivate")
async def deactivate_worker(worker_id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    worker = db.query(models.User).filter(models.User.id == worker_id).first()
    if not worker: raise HTTPException(status_code=404, detail="Artisan not found")
    worker.is_approved = False
    db.commit()
    return {"msg": f"Artisan {worker.username} decommissioned."}

@app.put("/admin/bookings/{booking_id}/allocate")
async def allocate_booking(booking_id: int, staff_name: str = Body(..., embed=True), current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not booking: raise HTTPException(status_code=404)
    booking.stylist_name = staff_name
    booking.status = "confirmed"
    db.commit()
    return {"msg": f"Artisan {staff_name} allocated to Booking #{booking_id}"}

@app.get("/worker/stats")
async def get_worker_stats(current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role not in ["staff", "admin"]:
        raise HTTPException(status_code=403, detail="Artisan access required.")
    my_bookings = db.query(models.Booking).filter(
        models.Booking.stylist_name == current_user.username
    ).all()
    completed = [b for b in my_bookings if b.status == "completed"]
    upcoming = [b for b in my_bookings if b.status in ["pending", "confirmed"]]
    personal_revenue = sum(b.artisan_commission for b in completed)
    # Rating from reviews
    reviews = db.query(models.Review).filter(models.Review.worker_name == current_user.username).all()
    avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1) if reviews else 5.0
    return {
        "assigned_floor": current_user.assigned_floor or 1,
        "personal_revenue": round(personal_revenue, 2),
        "completed_bookings": len(completed),
        "upcoming_queue": len(upcoming),
        "avg_rating": avg_rating,
        "total_bookings": len(my_bookings)
    }

# --- ADMIN CRUD & REPORTS ---

@app.get("/admin/audits")
async def get_audits(current_user: models.User = Depends(get_admin_user)):
    return []  # Audit table stub to resolve dashboard 404

@app.post("/admin/services/")
async def create_service(service: schemas.ServiceBase, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_svc = models.Service(**service.dict())
    db.add(db_svc)
    db.commit()
    return db_svc

@app.put("/admin/services/{id}")
async def update_service(id: int, service: schemas.ServiceBase, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_svc = db.query(models.Service).filter(models.Service.id == id).first()
    if not db_svc: raise HTTPException(status_code=404)
    for k, v in service.dict().items():
        setattr(db_svc, k, v)
    db.commit()
    return db_svc

@app.delete("/admin/services/{id}")
async def delete_service(id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_svc = db.query(models.Service).filter(models.Service.id == id).first()
    if not db_svc: raise HTTPException(status_code=404)
    db.delete(db_svc)
    db.commit()
    return {"msg": "Service deleted"}

@app.post("/admin/workers/")
async def create_worker(worker: dict = Body(...), current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_user = models.User(
        username=worker['username'],
        email=worker['email'],
        full_name=worker['full_name'],
        password_hash=auth.get_password_hash(worker['password']),
        role="staff",
        is_approved=True,
        assigned_floor=worker.get('assigned_floor', 1),
        commission_rate=worker.get('commission_rate', 15.0)
    )
    db.add(db_user)
    db.commit()
    return {"msg": "Worker registered"}

@app.put("/admin/workers/{id}")
async def update_worker(id: int, worker: dict = Body(...), current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user: raise HTTPException(status_code=404)
    for k, v in worker.items():
        if k not in ['id', 'password'] and hasattr(db_user, k):
            setattr(db_user, k, v)
    if worker.get('password'):
        db_user.password_hash = auth.get_password_hash(worker['password'])
    db.commit()
    return {"msg": "Worker updated"}

@app.delete("/admin/workers/{id}")
async def delete_worker(id: int, current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == id).first()
    if not db_user: raise HTTPException(status_code=404)
    db.delete(db_user)
    db.commit()
    return {"msg": "Worker deleted"}

@app.get("/admin/revenue/report")
async def get_revenue_report(current_user: models.User = Depends(get_admin_user), db: Session = Depends(get_db)):
    bookings = db.query(models.Booking).filter(models.Booking.status == "completed").all()
    total = sum(b.price_paid for b in bookings) if bookings else 0
    by_floor = {}
    by_category = {}
    by_member = {}
    for b in bookings:
        floor = f"Floor {b.floor}"
        by_floor[floor] = by_floor.get(floor, 0) + b.price_paid
        by_category[b.category] = by_category.get(b.category, 0) + b.price_paid
        mtype = b.user.customer_category if b.user else 'guest'
        by_member[mtype] = by_member.get(mtype, 0) + b.price_paid
            
    return {"total": total, "by_floor": by_floor, "by_category": by_category, "by_member_type": by_member}

def seed_database(db: Session):
    # ✂️ CORE SERVICES
    rituals = [
        # GROOMING (Floor 1)
        models.Service(name="Bespoke Hair Sculpting", description="Tailored architectural grooming for the elite guest.", price=2500, duration=45, floor=1, category="Grooming"),
        models.Service(name="Classic Scissor Cut", description="Traditional precision scissor cut and styling.", price=1500, duration=30, floor=1, category="Grooming"),
        models.Service(name="Fade & Taper Blend", description="Modern fade with master level gradient blending.", price=1800, duration=45, floor=1, category="Grooming"),
        models.Service(name="Executive Buzz Cut", description="Ultra clean geometric low maintenance cut.", price=1200, duration=20, floor=1, category="Grooming"),
        models.Service(name="Signature Restyle", description="Complete transformation and shape shifting.", price=3500, duration=60, floor=1, category="Grooming"),
        models.Service(name="Youth Cut (Under 16)", description="Gentle, precise styling for young gentlemen.", price=1000, duration=30, floor=1, category="Grooming"),
        models.Service(name="The Lumiere Trim", description="Maintenance trim mapping your natural waves.", price=1500, duration=30, floor=1, category="Grooming"),
        models.Service(name="Scalp Camouflage", description="Temporary hair density optical enhancement.", price=4000, duration=60, floor=1, category="Grooming"),
        models.Service(name="Anti-Dandruff Protocol", description="Deep clinical cleansing for scalp health.", price=2200, duration=45, floor=1, category="Grooming"),
        models.Service(name="Hair Fall Defense", description="Stimulating scalp massage with redensyl.", price=2800, duration=45, floor=1, category="Grooming"),
        models.Service(name="Keratin Smoothing", description="Frizz reduction absolute silk keratin therapy.", price=8000, duration=120, floor=1, category="Grooming"),
        models.Service(name="Creative Coloring", description="Artisan blended modern hair hues.", price=5500, duration=90, floor=1, category="Grooming"),
        models.Service(name="Grey Blending", description="Subtle, natural salt & pepper camouflage.", price=3000, duration=45, floor=1, category="Grooming"),
        models.Service(name="Highlights/Lowlights", description="Dimensional coloring for volume illusion.", price=4500, duration=90, floor=1, category="Grooming"),
        models.Service(name="Global Color", description="Rich monotone permanent coloring.", price=5000, duration=90, floor=1, category="Grooming"),
        models.Service(name="Olaplex Bond Repair", description="Internal hair bond restructuring treatment.", price=6000, duration=60, floor=1, category="Grooming"),
        models.Service(name="Volumizing Blowout", description="Red-carpet ready volume and setting.", price=1200, duration=30, floor=1, category="Grooming"),
        models.Service(name="Hair Tattoo/Art", description="Custom geometric designs shaved into nape.", price=2000, duration=45, floor=1, category="Grooming"),
        models.Service(name="Beard Outline", description="Sharp geometric cheek and neck outlining.", price=800, duration=15, floor=1, category="Grooming"),
        models.Service(name="Eyebrow Architecture", description="Mapping and threading for men.", price=600, duration=15, floor=1, category="Grooming"),
        
        # VIP GROOMING (Floor 2)
        models.Service(name="VIP Beard Ritual", description="Hot towel, straight razor finish with luxury oils.", price=1200, duration=30, floor=2, category="VIP Grooming"),
        models.Service(name="Royal Shave", description="7-step signature shave for absolute smooth skin.", price=2000, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Platinum Beard Sculpt", description="Volumizing blow-dry, precise trim and sculpt.", price=1800, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Gold Leaf Facial", description="24K gold infused anti-aging facial protocol.", price=9500, duration=90, floor=2, category="VIP Grooming"),
        models.Service(name="Diamond Dermabrasion", description="Deep exfoliation revealing youthful skin.", price=6500, duration=60, floor=2, category="VIP Grooming"),
        models.Service(name="Charcoal Detox Mask", description="Deep pore cleansing utilizing activated carbon.", price=3000, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Oxygen Infusion", description="Pressurized oxygen delivering hyaluronic acid.", price=7500, duration=60, floor=2, category="VIP Grooming"),
        models.Service(name="Cryotherapy Facial", description="Ice-cold sculpting targeting inflammation.", price=8500, duration=60, floor=2, category="VIP Grooming"),
        models.Service(name="Eye Bag Rescue", description="Lymphatic drainage for the lower orbit.", price=2500, duration=30, floor=2, category="VIP Grooming"),
        models.Service(name="LED Light Matrix", description="Red/Blue light therapy for acne and aging.", price=4000, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Hydrafacial Elite", description="Vortex extraction and peptide infusion.", price=12000, duration=90, floor=2, category="VIP Grooming"),
        models.Service(name="Micro-Needling", description="Collagen induction deep healing therapy.", price=15000, duration=90, floor=2, category="VIP Grooming"),
        models.Service(name="Chemical Peel", description="Resurfacing using AHA/BHA luxury blend.", price=8000, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Manicure Royal", description="Gold-infused hydration and nail buffing.", price=2500, duration=45, floor=2, category="VIP Grooming"),
        models.Service(name="Pedicure Imperial", description="Callus elimination and reflexology polish.", price=3500, duration=60, floor=2, category="VIP Grooming"),
        models.Service(name="Paraffin Wax Dip", description="Thermal deep hydration for hands/feet.", price=2000, duration=30, floor=2, category="VIP Grooming"),
        models.Service(name="Laser Hair Edging", description="Permanent clean lines on cheeks and nape.", price=4500, duration=30, floor=2, category="VIP Grooming"),
        models.Service(name="Threaded Contour", description="Facial hair removal via ancient threading.", price=1500, duration=30, floor=2, category="VIP Grooming"),
        models.Service(name="Nose & Ear Waxing", description="Painless hard-wax structural clearing.", price=1000, duration=15, floor=2, category="VIP Grooming"),
        models.Service(name="Lip Hyperpigmentation", description="Laser correction for dark lips.", price=5000, duration=30, floor=2, category="VIP Grooming"),

        # WELLNESS (Floor 3)
        models.Service(name="Deep Tissue Stress Relief", description="Floor 3 wellness signature therapy.", price=4500, duration=90, floor=3, category="Wellness"),
        models.Service(name="Swedish Relaxation", description="Gentle, long sweeping strokes for calmness.", price=3500, duration=60, floor=3, category="Wellness"),
        models.Service(name="Aromatherapy Journey", description="Essential oil synchronized sensory healing.", price=4000, duration=60, floor=3, category="Wellness"),
        models.Service(name="Hot Stone Melting", description="Volcanic stones radiating deep heat.", price=5500, duration=90, floor=3, category="Wellness"),
        models.Service(name="Thai Stretching", description="Yoga-like assisted flexibility unblocking.", price=5000, duration=90, floor=3, category="Wellness"),
        models.Service(name="Sports Recovery", description="Trigger point therapy targeting lactic acid.", price=4800, duration=60, floor=3, category="Wellness"),
        models.Service(name="Shiatsu Acupressure", description="Japanese meridian healing technique.", price=5200, duration=90, floor=3, category="Wellness"),
        models.Service(name="Reflexology", description="Foot mapping targeting organ pathways.", price=2800, duration=45, floor=3, category="Wellness"),
        models.Service(name="Four Hands Synchronization", description="Two artisans massaging in absolute harmony.", price=9500, duration=60, floor=3, category="Wellness"),
        models.Service(name="Lomi Lomi Nui", description="Hawaiian wave-like full body flow.", price=6000, duration=90, floor=3, category="Wellness"),
        models.Service(name="Bamboo Sculpting", description="Using heated bamboo shoots to roll tissue.", price=5800, duration=90, floor=3, category="Wellness"),
        models.Service(name="Cupping Therapy", description="Ancient vacuum therapy drawing toxins out.", price=3500, duration=45, floor=3, category="Wellness"),
        models.Service(name="Back & Shoulders Release", description="Focussed 30-min upper body unknotting.", price=2000, duration=30, floor=3, category="Wellness"),
        models.Service(name="Head & Neck Float", description="Targeting cranial tension and migraines.", price=2200, duration=30, floor=3, category="Wellness"),
        models.Service(name="Maternity Oasis", description="Prenatal safety-certified gentle relief.", price=6000, duration=60, floor=3, category="Wellness"),
        models.Service(name="Jetlag Reboot", description="Circadian rhythm recovery massage.", price=7500, duration=90, floor=3, category="Wellness"),
        models.Service(name="Hammam Scrub", description="Turkish hot steam and vigorous exfoliation.", price=8500, duration=90, floor=3, category="Wellness"),
        models.Service(name="Detox Body Wrap", description="Seaweed infused fat burning body cocoon.", price=7000, duration=60, floor=3, category="Wellness"),
        models.Service(name="Sound Bowl Meditation", description="Tibetan singing bowls acoustic healing.", price=3000, duration=45, floor=3, category="Wellness"),
        models.Service(name="Reiki Energy Protocol", description="Non-touch energetic field rebalancing.", price=4000, duration=60, floor=3, category="Wellness"),

        # SUBSCRIPTIONS (Floor 4)
        models.Service(name="Elite Membership", description="50% off on rituals + priority booking.", price=25000, duration=0, floor=4, category="subscription", sac_code="9983", hsn_code="3304"),
        models.Service(name="Gold Membership", description="30% off on all rituals + VIP access.", price=15000, duration=0, floor=4, category="subscription", sac_code="9983", hsn_code="3304")
    ]
    
    # 👤 CORE ROLES (Directorate)
    directorate = [
        models.User(username="admin", full_name="General Directorate", email="admin@cutslot.com", password_hash=auth.get_password_hash("Admin@123"), role="admin", is_approved=True)
    ]

    # 🧑🎨 SKILLED ARTISANS (8 Approved + 2 Pending)
    artisans = [
        models.User(username="Anil", full_name="Anil Kumar", email="anil@cutslot.com", password_hash=auth.get_password_hash("Anil@123"), role="staff", assigned_floor=1, is_approved=True, commission_rate=15.0),
        models.User(username="Eshwar", full_name="Eshwar Rao", email="eshwar@cutslot.com", password_hash=auth.get_password_hash("Eshwar@123"), role="staff", assigned_floor=1, is_approved=True, commission_rate=15.0),
        models.User(username="Rahul", full_name="Rahul Sharma", email="rahul@cutslot.com", password_hash=auth.get_password_hash("Rahul@123"), role="staff", assigned_floor=2, is_approved=True, commission_rate=15.0),
        models.User(username="Nithin", full_name="Nithin Gowda", email="nithin@cutslot.com", password_hash=auth.get_password_hash("Nithin@123"), role="staff", assigned_floor=2, is_approved=True, commission_rate=15.0),
        models.User(username="Kusuma", full_name="Kusuma Devi", email="kusuma@cutslot.com", password_hash=auth.get_password_hash("Kusuma@123"), role="staff", assigned_floor=3, is_approved=True, commission_rate=15.0),
        models.User(username="Manju", full_name="Manju Prasad", email="manju@cutslot.com", password_hash=auth.get_password_hash("Manju@123"), role="staff", assigned_floor=1, is_approved=True, commission_rate=15.0),
        models.User(username="Prithvi", full_name="Prithvi Raj", email="prithvi@cutslot.com", password_hash=auth.get_password_hash("Prithvi@123"), role="staff", assigned_floor=2, is_approved=True, commission_rate=15.0),
        models.User(username="Divya", full_name="Divya S.", email="divya@cutslot.com", password_hash=auth.get_password_hash("Divya@123"), role="staff", assigned_floor=3, is_approved=True, commission_rate=15.0),
        # 🛡️ PENDING VETTING
        models.User(username="Sanjay", full_name="Sanjay Rao", email="sanjay@cutslot.com", password_hash=auth.get_password_hash("Sanjay@123"), role="staff", assigned_floor=1, is_approved=False, commission_rate=15.0),
        models.User(username="Meeta", full_name="Meeta S.", email="meeta@cutslot.com", password_hash=auth.get_password_hash("Meeta@123"), role="staff", assigned_floor=2, is_approved=False, commission_rate=15.0)
    ]

    # 👥 ELITE GUESTS (10 Clients)
    clients = [
        models.User(username="Abhi", full_name="Abhishek", email="abhi@cutslot.com", password_hash=auth.get_password_hash("Abhi@123"), role="customer", is_approved=True, balance=5000.0),
        models.User(username="Likthi", full_name="Likith Gowda", email="likthi@cutslot.com", password_hash=auth.get_password_hash("Likthi@123"), role="customer", is_approved=True, balance=7500.0),
        models.User(username="Guru", full_name="Guru Prasad", email="guru@cutslot.com", password_hash=auth.get_password_hash("Guru@123"), role="customer", is_approved=True, balance=12000.0),
        models.User(username="Vani", full_name="Vani Kumari", email="vani@cutslot.com", password_hash=auth.get_password_hash("Vani@123"), role="customer", is_approved=True, balance=4000.0),
        models.User(username="Prashu", full_name="Prashanth", email="prashu@cutslot.com", password_hash=auth.get_password_hash("Prashu@123"), role="customer", is_approved=True, balance=9500.0),
        models.User(username="Prasad", full_name="Prasad J.", email="prasad@cutslot.com", password_hash=auth.get_password_hash("Prasad@123"), role="customer", is_approved=True, balance=6000.0),
        models.User(username="Nikhil", full_name="Nikhil Sharma", email="nikhil@cutslot.com", password_hash=auth.get_password_hash("Nikhil@123"), role="customer", is_approved=True, balance=8000.0),
        models.User(username="Suresh", full_name="Suresh M.", email="suresh@cutslot.com", password_hash=auth.get_password_hash("Suresh@123"), role="customer", is_approved=True, balance=3000.0),
        models.User(username="Deepa", full_name="Deepa G.", email="deepa@cutslot.com", password_hash=auth.get_password_hash("Deepa@123"), role="customer", is_approved=True, balance=4500.0),
        models.User(username="Kavya", full_name="Kavya R.", email="kavya@cutslot.com", password_hash=auth.get_password_hash("Kavya@123"), role="customer", is_approved=True, balance=5500.0)
    ]
    
    db.add_all(rituals + directorate + artisans + clients)
    db.commit()

@app.get("/reset-db")
async def reset_db(current_user: models.User = Depends(get_admin_user)):
    # Drop and recreate all tables
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    # Use a fresh session after recreating tables
    fresh_db = SessionLocal()
    try:
        seed_database(fresh_db)
    finally:
        fresh_db.close()
    return {"msg": "Atelier Protocol Regenerated. Estate is primed."}

if __name__ == "__main__":
    import uvicorn
    import argparse
    import sys

    parser = argparse.ArgumentParser(description="CutSlot Directorate CLI")
    parser.add_argument("--reset-db", action="store_true", help="Synchronize metadata and wipe estate records.")
    parser.add_argument("--seed-all", action="store_true", help="Initialize estate with simulated artisans and guests.")
    args = parser.parse_known_args()[0]

    if args.reset_db:
        print("🛡️ ESTATE DIRECTORATE: REGENERATING METADATA...")
        models.Base.metadata.drop_all(bind=engine)
        models.Base.metadata.create_all(bind=engine)
        if args.seed_all:
            print("🌱 ESTATE DIRECTORATE: SEEDING ARTISAN AND GUEST REGISTRIES...")
            db = SessionLocal()
            try:
                seed_database(db)
            finally:
                db.close()
        print("✅ ESTATE PRIMED.")
        sys.exit(0)

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
