import hashlib
import hmac
import secrets
import json
import base64
import time
from datetime import datetime, timedelta
from typing import Optional, Dict, Any

import os
# Secret key used for signing tokens (can be configured in .env)
SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "fallback-secret-key-for-dev")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 # Reduced from 7 days for security


import bcrypt

def hash_password(password: str, salt: Optional[str] = None) -> tuple[str, str]:
    """
    Hash a password using bcrypt. Returns (salt_string, hashed_password_string).
    """
    if salt is None:
        salt_bytes = bcrypt.gensalt(rounds=12)
        salt = salt_bytes.decode('utf-8')
    else:
        salt_bytes = salt.encode('utf-8')
        
    pwd_bytes = password.encode("utf-8")
    hash_bytes = bcrypt.hashpw(pwd_bytes, salt_bytes)
    
    return salt, hash_bytes.decode('utf-8')


def verify_password(password: str, salt: str, password_hash: str) -> bool:
    """
    Verify whether the given plain password matches the bcrypt hashed password.
    """
    pwd_bytes = password.encode("utf-8")
    hash_bytes = password_hash.encode("utf-8")
    
    try:
        return bcrypt.checkpw(pwd_bytes, hash_bytes)
    except ValueError:
        return False


def generate_otp_code(length: int = 6) -> str:
    """
    Generate a secure 6-digit numeric OTP code.
    """
    # Generate 6 digits (e.g. 100000 to 999999)
    num = secrets.randbelow(900000) + 100000
    return str(num)


def base64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")


def base64url_decode(data: str) -> bytes:
    padding = "=" * (4 - (len(data) % 4)) if len(data) % 4 != 0 else ""
    return base64.urlsafe_b64decode(data + padding)


def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generate a signed JWT token (Header.Payload.Signature) with expiration.
    """
    header = {"alg": ALGORITHM, "typ": "JWT"}
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
    to_encode.update({"exp": int(expire.timestamp()), "iat": int(time.time())})
    
    header_json = json.dumps(header, separators=(",", ":")).encode("utf-8")
    payload_json = json.dumps(to_encode, separators=(",", ":")).encode("utf-8")
    
    header_b64 = base64url_encode(header_json)
    payload_b64 = base64url_encode(payload_json)
    
    signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
    signature = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
    signature_b64 = base64url_encode(signature)
    
    return f"{header_b64}.{payload_b64}.{signature_b64}"


def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify and decode a JWT token. Returns payload dict if valid, else None.
    """
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
            
        header_b64, payload_b64, signature_b64 = parts
        
        signing_input = f"{header_b64}.{payload_b64}".encode("utf-8")
        expected_sig = hmac.new(SECRET_KEY.encode("utf-8"), signing_input, hashlib.sha256).digest()
        actual_sig = base64url_decode(signature_b64)
        
        if not hmac.compare_digest(expected_sig, actual_sig):
            return None
            
        payload_json = base64url_decode(payload_b64).decode("utf-8")
        payload = json.loads(payload_json)
        
        # Check expiration
        exp = payload.get("exp")
        if exp and exp < int(time.time()):
            return None # Expired
            
        return payload
    except Exception:
        return None
