from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
from datetime import datetime, timezone
import uuid

# ============ USER MODELS ============

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    role: str  # admin, student, teacher
    level: Optional[str] = None
    is_active: bool = False
    password_hash: str
    temporary_password: Optional[str] = None
    assigned_teacher: Optional[str] = None
    subscription_status: Optional[str] = "inactive"  # inactive, active, cancelled
    subscription_plan: Optional[str] = None  # beginner, intermediate, advanced
    next_payment_date: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    preferred_slots: Optional[str] = None
    referral_source: Optional[str] = None
    hours_completed: Optional[int] = 0
    progress_percentage: Optional[float] = 0.0

class UserCreate(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone: str
    level: str
    preferred_slots: Optional[str] = None
    referral_source: Optional[str] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    level: Optional[str] = None
    profile_image: Optional[str] = None

# ============ COURSE MODELS ============

class Course(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    teacher_id: str
    student_id: Optional[str] = None
    title: str
    description: str
    level: str
    schedule: str
    date: str
    time: str
    duration: int = 60  # minutes
    status: str = "scheduled"  # scheduled, completed, cancelled
    meet_link: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class CourseCreate(BaseModel):
    title: str
    description: str
    level: str
    schedule: str
    date: str
    time: str
    duration: int = 60
    student_id: Optional[str] = None

class CourseInvitation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    course_id: str
    teacher_id: str
    student_id: str
    meet_link: str
    status: str = "pending"  # pending, accepted, declined, completed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============ AVAILABILITY MODELS ============

class Availability(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    teacher_id: str
    day_of_week: str  # monday, tuesday, etc.
    start_time: str
    end_time: str
    is_available: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AvailabilityCreate(BaseModel):
    day_of_week: str
    start_time: str
    end_time: str
    is_available: bool = True

# ============ MESSAGE MODELS ============

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    from_user_id: str
    to_user_id: str
    content: str
    attachments: Optional[List[str]] = []
    is_read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class MessageCreate(BaseModel):
    to_user_id: str
    content: str
    attachments: Optional[List[str]] = []

# ============ DOCUMENT MODELS ============

class Document(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    teacher_id: str
    student_id: str
    title: str
    file_url: str
    file_type: str
    file_size: int
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DocumentCreate(BaseModel):
    student_id: str
    title: str
    file_url: str
    file_type: str
    file_size: int

# ============ NOTIFICATION MODELS ============

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    title: str
    message: str
    type: str  # course, payment, message, document, system
    is_read: bool = False
    link: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class NotificationCreate(BaseModel):
    user_id: str
    title: str
    message: str
    type: str
    link: Optional[str] = None

# ============ PAYMENT MODELS ============

class Payment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    amount: float
    plan: str
    status: str = "pending"  # pending, completed, failed
    payment_method: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PaymentCreate(BaseModel):
    amount: float
    plan: str
    payment_method: str

# ============ TEST RESULT MODELS ============

class TestResult(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    level: str
    score: int
    total_questions: int
    answers: List[dict]
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TestSubmission(BaseModel):
    level: str
    answers: List[dict]

# ============ ATTENDANCE MODELS ============

class Attendance(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    teacher_id: str
    date: datetime
    status: str  # present, absent, late
    hours: float = 0.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class AttendanceCreate(BaseModel):
    date: str
    status: str
    hours: float = 0.0

# ============ PRICING MODELS ============

class Pricing(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    plan: str
    price: float
    discount: float = 0.0
    features: List[str] = []
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class PricingCreate(BaseModel):
    plan: str
    price: float
    discount: float = 0.0
    features: List[str] = []
