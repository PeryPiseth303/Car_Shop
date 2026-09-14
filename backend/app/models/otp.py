import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from app.database import Base

class OTPModel(Base):
    __tablename__ = "otps"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, index=True, nullable=False)
    code = Column(String(10), nullable=False)
    purpose = Column(String(50), nullable=False, default="login") # "login", "register", "reset_password"
    temp_data = Column(Text, nullable=True) # JSON payload for registration or extra data
    expires_at = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
