import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from database import Base

class UserRole:
    ADMIN = "admin"
    STAFF = "staff"
    CUSTOMER = "customer"

class BookingStatus:
    PENDING = "pending"
    CONFIRMED = "confirmed"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"
    ABSENT = "absent"



class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    password_hash = Column(String)
    role = Column(String, default=UserRole.CUSTOMER)
    balance = Column(Float, default=0.0)
    loyalty_points = Column(Integer, default=0)
    member_since = Column(DateTime, default=datetime.datetime.utcnow)
    
    # --- CRM & PREFERENCES ---
    preferences_silent_service = Column(Boolean, default=False)
    preferences_drink = Column(String, default="Water")
    preferences_allergies = Column(String, default="None")
    
    # --- ARTISAN SPECIFICS ---
    commission_rate = Column(Float, default=15.0)
    base_rating = Column(Float, default=5.0)
    # CORE IDENTITY & BRANCHING
    branch_id = Column(Integer, default=1) # 1: Main Estate, 2: Coastal, etc.
    customer_category = Column(String, default="standard")
    subscription_plan = Column(String, nullable=True)
    subscription_expiry = Column(DateTime, nullable=True)
    monthly_limit = Column(Integer, default=10)
    monthly_bookings_count = Column(Integer, default=0)
    
    # ARTISAN MERITOCRACY
    artisan_points = Column(Integer, default=0)
    artisan_tier = Column(String, default="Bronze") # Bronze, Silver, Elite
    artisan_targets_met = Column(Integer, default=0)
    
    is_approved = Column(Boolean, default=False)
    assigned_floor = Column(Integer, default=1)
    gender = Column(String, nullable=True)
    commitment_end_date = Column(DateTime, nullable=True)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)

    bookings = relationship("Booking", back_populates="user")
    reviews = relationship("Review", back_populates="user")

class Service(Base):
    __tablename__ = "services"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String, nullable=True)
    price = Column(Float)
    duration = Column(Integer)
    floor = Column(Integer)
    category = Column(String)
    service_type = Column(String, default="standard")
    # FINANCE & TAX
    sac_code = Column(String, default="9983") # Service Accounting Code
    hsn_code = Column(String, default="3304") # Beauty/Tehcnical Code
    is_featured = Column(Boolean, default=False)
    upsell_suggestions = Column(String, default="") # Comma separated service IDs
    is_available_home = Column(Boolean, default=False)
    travel_premium = Column(Float, default=0.0)
    buffer_time_mins = Column(Integer, default=15)

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    service_id = Column(Integer, ForeignKey("services.id"))
    floor = Column(Integer)
    stylist_name = Column(String)
    category = Column(String)
    gender = Column(String)
    booking_time = Column(DateTime)
    end_time = Column(DateTime)
    # REVENUE & PENALTY PROTECTION
    price_paid = Column(Float, default=0.0)
    tax_amount = Column(Float, default=0.0)
    artisan_commission = Column(Float, default=0.0)
    travel_fee = Column(Float, default=0.0)
    cancellation_penalty = Column(Float, default=0.0)
    
    # PAYMENT SAFETY (IDEMPOTENCY)
    payment_idempotency_key = Column(String, unique=True, nullable=True)
    payment_status = Column(String, default="pending") # pending, success, failed, reconciled
    
    # LOGISTICS INTELLIGENCE (TRAVEL)
    is_home_service = Column(Boolean, default=False)
    transit_status = Column(String, default="at_base") # at_base, en_route, arrived, completed
    travel_start_time = Column(DateTime, nullable=True)
    travel_end_time = Column(DateTime, nullable=True)
    estimated_arrival_time = Column(DateTime, nullable=True)
    
    service_type = Column(String, default="standard")
    status = Column(String, default=BookingStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    destination_lat = Column(Float, nullable=True)
    destination_lng = Column(Float, nullable=True)

    user = relationship("User", back_populates="bookings")
    service = relationship("Service")

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=True)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=True)
    worker_name = Column(String)
    rating = Column(Integer)
    comment = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user = relationship("User", back_populates="reviews")

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    amount = Column(Float)
    type = Column(String) # deposit, payment, refund, penalty
    description = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    action = Column(String)
    details = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    booking_id = Column(Integer, ForeignKey("bookings.id"))
    type = Column(String) # reminder, alert, transit, system
    scheduled_time = Column(DateTime)
    status = Column(String, default="pending") # pending, sent, failed, cancelled
    message = Column(String)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
