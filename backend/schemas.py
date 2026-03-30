from pydantic import BaseModel
from typing import List, Optional
import datetime

# --- AUTH & USER ---
class UserBase(BaseModel):
    username: str
    email: str
    full_name: str

class UserCreate(UserBase):
    password: str
    role: str = "customer"
    assigned_floor: Optional[int] = 1

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    balance: Optional[float] = None
    loyalty_points: Optional[int] = None
    preferences_silent_service: Optional[bool] = None
    preferences_drink: Optional[str] = None
    preferences_allergies: Optional[str] = None
    commission_rate: Optional[float] = None
    base_rating: Optional[float] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    is_approved: Optional[bool] = None
    assigned_floor: Optional[int] = None
    branch_id: Optional[int] = None

class UserInDB(UserBase):
    id: int
    role: str
    balance: float
    loyalty_points: int
    subscription_plan: Optional[str]
    subscription_expiry: Optional[datetime.datetime]
    customer_category: str
    is_approved: bool
    assigned_floor: Optional[int]
    preferences_silent_service: bool
    preferences_drink: str
    preferences_allergies: str
    member_since: datetime.datetime
    gender: Optional[str]

    class Config:
        from_attributes = True

# --- SERVICE ---
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    duration: int
    floor: int
    category: str
    service_type: Optional[str] = "standard"
    is_available_home: Optional[bool] = False
    travel_premium: Optional[float] = 0.0
    buffer_time_mins: Optional[int] = 15

class ServiceCreate(ServiceBase):
    pass

class ServiceInDB(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# --- BOOKING ---
class BookingBase(BaseModel):
    service_id: int
    floor: int
    stylist_name: str
    category: str
    gender: str
    booking_time: datetime.datetime
    service_type: Optional[str] = "standard"
    destination_lat: Optional[float] = None
    destination_lng: Optional[float] = None

class BookingCreate(BookingBase):
    pass

class BookingInDB(BookingBase):
    id: int
    user_id: int
    status: str
    price_paid: float
    travel_fee: float
    tax_amount: float
    artisan_commission: float
    created_at: datetime.datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- REVIEW ---
class ReviewBase(BaseModel):
    worker_name: str
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    pass

class ReviewInDB(ReviewBase):
    id: int
    user_id: int
    created_at: datetime.datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True

# --- EXTRAS ---
class SubscriptionBase(BaseModel):
    name: str

class SubscriptionPurchase(BaseModel):
    service_id: int

class WalletDeposit(BaseModel):
    amount: float

# --- AUTH TOKENS ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
