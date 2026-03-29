from pydantic import BaseModel, EmailStr, validator
import re
from typing import List, Optional
from datetime import datetime
import enum

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "customer" # Client can choose
    assigned_floor: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    customer_category: Optional[str] = "normal"

    @validator('password')
    def strong_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r"[A-Z]", v):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r"[a-z]", v):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r"\d", v):
            raise ValueError('Password must contain at least one digit')
        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", v):
            raise ValueError('Password must contain at least one special character')
        return v
    
    @validator('username')
    def valid_username(cls, v):
        if len(v) < 3:
            raise ValueError('Username must be at least 3 characters long')
        if not re.match(r"^\w+$", v):
            raise ValueError('Username can only contain alphanumeric characters and underscores')
        return v

class UserInDB(UserBase):
    id: int
    full_name: Optional[str]
    role: str
    loyalty_points: int
    subscription_plan: Optional[str]
    subscription_expiry: Optional[datetime]
    monthly_bookings_count: int
    monthly_limit: int
    assigned_floor: Optional[int]
    is_approved: bool
    gender: Optional[str]
    phone: Optional[str]
    customer_category: str
    joined_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[str] = None

class ServiceBase(BaseModel):
    name: str
    description: str
    price: float
    duration: int
    floor: int
    category: str
    service_type: Optional[str] = "standard"

class ServiceInDB(ServiceBase):
    id: int

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    service_id: int
    floor: int
    stylist_name: str
    category: str
    gender: str
    booking_time: datetime
    service_type: Optional[str] = "standard"

class BookingCreate(BookingBase):
    pass

class BookingInDB(BookingBase):
    id: int
    user_id: int
    user_name: Optional[str] = "Anonymous Site Guest"
    status: str
    price_paid: float
    created_at: datetime

    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    booking_id: int
    service_id: int
    rating: int
    comment: str

class ReviewInDB(ReviewBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationInDB(BaseModel):
    id: int
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class AuditLogInDB(BaseModel):
    id: int
    user_id: int
    action: str
    timestamp: datetime
    details: str

    class Config:
        from_attributes = True

class SubscriptionInDB(BaseModel):
    id: int
    name: str
    price: float
    duration_days: int
    perks: str
    category: str

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_revenue: float
    total_bookings: int
    active_users: int
    avg_rating: float
    popular_services: List[dict] = []
    revenue_by_floor: dict = {}

class WorkerStats(BaseModel):
    assigned_floor: Optional[int]
    personal_revenue: float
    completed_bookings: int
    upcoming_queue: int
    avg_rating: float = 0.0
    efficiency_score: float = 0.0
