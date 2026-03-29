from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
import enum

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str
    role: Optional[str] = "customer" # Client can choose
    assigned_floor: Optional[int] = None
    gender: Optional[str] = None
    phone: Optional[str] = None
    customer_category: Optional[str] = "normal"

class UserInDB(UserBase):
    id: int
    role: str
    loyalty_points: int
    subscription_plan: Optional[str]
    subscription_expiry: Optional[datetime]
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

class ServiceInDB(ServiceBase):
    id: int

    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    service_id: int
    floor: int
    stylist_name: str
    booking_time: datetime

class BookingCreate(BookingBase):
    pass

class BookingInDB(BookingBase):
    id: int
    user_id: int
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

    class Config:
        from_attributes = True

class AdminStats(BaseModel):
    total_revenue: float
    total_bookings: int
    active_users: int
    avg_rating: float

class WorkerStats(BaseModel):
    assigned_floor: Optional[int]
    personal_revenue: float
    completed_bookings: int
    upcoming_queue: int
