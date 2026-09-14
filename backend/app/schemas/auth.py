from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "user"

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "user" # "user" or "admin"

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    require_otp: bool = True
    email: str
    masked_email: str
    message: str
    otp_code: Optional[str] = None # Development helper for local testing
    role: Optional[str] = None

class VerifyOTPRequest(BaseModel):
    email: str
    code: str
    purpose: str = "login" # "login", "register", "forgot"

class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "user"

class ResendOTPRequest(BaseModel):
    email: str
    purpose: str = "login"

class ForgotPasswordRequest(BaseModel):
    email: str

class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
