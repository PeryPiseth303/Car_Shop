import json
import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status, Header
from sqlalchemy.orm import Session

from app.database import get_db
from app.config import settings
from app.models.user import UserModel
from app.models.otp import OTPModel
from app.schemas.auth import (
    LoginRequest,
    LoginResponse,
    VerifyOTPRequest,
    RegisterRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserResponse,
    TokenResponse,
)
from app.utils.security import (
    hash_password,
    verify_password,
    generate_otp_code,
    create_access_token,
    decode_access_token,
)
from app.utils.email import send_gmail_otp
from app.utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/api/auth", tags=["Authentication & Staff Access"])


def mask_email(email: str) -> str:
    if "@" not in email:
        return email
    name, domain = email.split("@", 1)
    if len(name) <= 2:
        masked_name = name[0] + "*"
    else:
        masked_name = name[0] + "*" * (len(name) - 2) + name[-1]
    return f"{masked_name}@{domain}"


def get_current_user(
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db)
) -> UserModel:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Please sign in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = authorization.split("Bearer ", 1)[1].strip()
    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication session. Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload["sub"]
    user = db.query(UserModel).filter(UserModel.email == email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This account has been deactivated. Please contact management.",
        )
    return user


def get_current_admin(current_user: UserModel = Depends(get_current_user)) -> UserModel:
    admin_email = settings.ADMIN_EMAIL.lower().strip()
    if current_user.role != "admin" or current_user.email.lower() != admin_email:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied: Only authorized administrator ({admin_email}) can access admin portal.",
        )
    return current_user


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    """
    Step 1 of Sign In: Validates credentials and dispatches a 6-digit OTP code to Gmail.
    """
    email = request.email.lower().strip()
    user = db.query(UserModel).filter(UserModel.email == email).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated. Please contact support.",
        )
    
    # Verify password against stored PBKDF2 HMAC-SHA256 salt & hash
    salt = user.password_salt or ""
    if not verify_password(request.password, salt, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
        )
    
    # Generate 6-digit OTP
    otp_code = generate_otp_code(6)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    # Invalidate previous unused login OTPs for this account
    db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.purpose == "login",
        OTPModel.is_used == False
    ).update({"is_used": True})
    
    otp_entry = OTPModel(
        email=email,
        code=otp_code,
        purpose="login",
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_entry)
    db.commit()
    
    # Send verification code via Gmail SMTP
    send_gmail_otp(
        to_email=email,
        otp_code=otp_code,
        purpose="login",
        recipient_name=user.full_name
    )
    
    return LoginResponse(
        require_otp=True,
        email=user.email,
        masked_email=mask_email(user.email),
        message=f"Verification code sent to {mask_email(user.email)}. Please enter your 6-digit OTP to complete sign in.",
        otp_code=otp_code if settings.DEBUG else None,
        role=user.role
    )


@router.post("/register", response_model=LoginResponse)
def register(request: RegisterRequest, db: Session = Depends(get_db)):
    """
    Step 1 of Registration: Validates inputs, creates temporary registration payload,
    and dispatches 6-digit OTP code to Gmail. Account is created upon OTP verification.
    """
    email = request.email.lower().strip()
    
    if not request.full_name or len(request.full_name.strip()) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide your full name (minimum 2 characters).",
        )
    
    if not request.password or len(request.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )
    
    existing = db.query(UserModel).filter(UserModel.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email address already exists. Please sign in.",
        )
    
    salt, pwd_hash = hash_password(request.password)
    assigned_role = "user"  # Public registration is strictly for clients/users only
    
    temp_data = json.dumps({
        "email": email,
        "password_hash": pwd_hash,
        "password_salt": salt,
        "full_name": request.full_name.strip(),
        "role": assigned_role
    })
    
    otp_code = generate_otp_code(6)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    # Invalidate previous unused registration OTPs for this email
    db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.purpose == "register",
        OTPModel.is_used == False
    ).update({"is_used": True})
    
    otp_entry = OTPModel(
        email=email,
        code=otp_code,
        purpose="register",
        temp_data=temp_data,
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_entry)
    db.commit()
    
    # Send verification code via Gmail SMTP
    send_gmail_otp(
        to_email=email,
        otp_code=otp_code,
        purpose="register",
        recipient_name=request.full_name.strip()
    )
    
    return LoginResponse(
        require_otp=True,
        email=email,
        masked_email=mask_email(email),
        message=f"Verification code sent to {mask_email(email)}. Please enter OTP to confirm your registration.",
        otp_code=otp_code if settings.DEBUG else None,
        role=assigned_role
    )


@router.post("/verify-otp", response_model=TokenResponse)
def verify_otp(request: VerifyOTPRequest, db: Session = Depends(get_db)):
    """
    Step 2: Confirms the 6-digit OTP code sent to Gmail for either Login or Registration,
    then issues a JWT bearer token for the session.
    """
    email = request.email.lower().strip()
    code = request.code.strip()
    purpose = request.purpose.lower().strip()
    now = datetime.datetime.utcnow()
    
    # Look for matching active OTP
    otp_record = db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.code == code,
        OTPModel.purpose == purpose,
        OTPModel.is_used == False,
        OTPModel.expires_at > now
    ).order_by(OTPModel.id.desc()).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification code. Please check the code or request a new one.",
        )
    
    # Mark OTP as used
    otp_record.is_used = True
    
    user = None
    if purpose == "register":
        # Finalize account creation from stored temp_data
        if not otp_record.temp_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Registration session expired. Please register again.",
            )
        data = json.loads(otp_record.temp_data)
        
        # Double check if user was created in the meantime
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            user = UserModel(
                email=data["email"],
                password_hash=data["password_hash"],
                password_salt=data["password_salt"],
                full_name=data["full_name"],
                role=data.get("role", "user"),
                is_active=True,
                last_login=now
            )
            db.add(user)
        else:
            user.is_active = True
            user.last_login = now
        db.commit()
        db.refresh(user)
    
    elif purpose in ["login", "forgot"]:
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User account not found.",
            )
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been deactivated. Please contact support.",
            )
        user.last_login = now
        db.commit()
        db.refresh(user)
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported purpose: {purpose}",
        )
    
    # Issue JWT token
    token_payload = {
        "sub": user.email,
        "id": user.id,
        "role": user.role,
        "name": user.full_name
    }
    access_token = create_access_token(token_payload)
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.post("/resend-otp")
def resend_otp(request: ResendOTPRequest, db: Session = Depends(get_db)):
    """
    Resends a fresh 6-digit OTP code to the user's Gmail address.
    """
    email = request.email.lower().strip()
    purpose = request.purpose.lower().strip()
    
    recipient_name = None
    existing_temp_data = None
    
    if purpose == "login":
        user = db.query(UserModel).filter(UserModel.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found with this email address.",
            )
        recipient_name = user.full_name
    elif purpose == "register":
        last_otp = db.query(OTPModel).filter(
            OTPModel.email == email,
            OTPModel.purpose == "register"
        ).order_by(OTPModel.id.desc()).first()
        if last_otp and last_otp.temp_data:
            existing_temp_data = last_otp.temp_data
            try:
                parsed = json.loads(existing_temp_data)
                recipient_name = parsed.get("full_name")
            except Exception:
                pass
    
    # Invalidate existing unused OTPs
    db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.purpose == purpose,
        OTPModel.is_used == False
    ).update({"is_used": True})
    
    otp_code = generate_otp_code(6)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    
    new_otp = OTPModel(
        email=email,
        code=otp_code,
        purpose=purpose,
        temp_data=existing_temp_data,
        expires_at=expires_at,
        is_used=False
    )
    db.add(new_otp)
    db.commit()
    
    send_gmail_otp(
        to_email=email,
        otp_code=otp_code,
        purpose=purpose,
        recipient_name=recipient_name
    )
    
    return {
        "success": True,
        "message": f"A fresh verification code has been dispatched to {mask_email(email)}.",
        "otp_code": otp_code if settings.DEBUG else None
    }


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    email = request.email.lower().strip()
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        return {
            "success": True,
            "message": "If an account exists with this email, password reset instructions have been issued.",
        }
    
    otp_code = generate_otp_code(6)
    expires_at = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    
    db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.purpose == "forgot",
        OTPModel.is_used == False
    ).update({"is_used": True})
    
    otp_entry = OTPModel(
        email=email,
        code=otp_code,
        purpose="forgot",
        expires_at=expires_at,
        is_used=False
    )
    db.add(otp_entry)
    db.commit()
    
    send_gmail_otp(
        to_email=email,
        otp_code=otp_code,
        purpose="forgot",
        recipient_name=user.full_name
    )
    
    return {
        "success": True,
        "message": f"Password reset instructions issued for {mask_email(email)}.",
        "otp_code": otp_code if settings.DEBUG else None,
    }


@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = request.email.lower().strip()
    now = datetime.datetime.utcnow()
    
    otp_record = db.query(OTPModel).filter(
        OTPModel.email == email,
        OTPModel.code == request.code.strip(),
        OTPModel.purpose == "forgot",
        OTPModel.is_used == False,
        OTPModel.expires_at > now
    ).first()
    
    if not otp_record:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset code. Please request a new one.",
        )
    
    if len(request.new_password) < 6:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 6 characters.",
        )
    
    user = db.query(UserModel).filter(UserModel.email == email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User account not found.",
        )
    
    salt, pwd_hash = hash_password(request.new_password)
    user.password_salt = salt
    user.password_hash = pwd_hash
    otp_record.is_used = True
    db.commit()
    
    return {
        "success": True,
        "message": "Your password has been reset successfully. Please sign in with your new password.",
    }


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: UserModel = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.get("/users", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    admin: UserModel = Depends(get_current_admin)
):
    users = db.query(UserModel).order_by(UserModel.id.asc()).all()
    return [UserResponse.model_validate(u) for u in users]
