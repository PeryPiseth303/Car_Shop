import datetime
import uuid
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database import Base

class PaymentOrderModel(Base):
    __tablename__ = "payment_orders"

    id = Column(String, primary_key=True, index=True, default=lambda: f"AUR-{uuid.uuid4().hex[:8].upper()}")
    user_email = Column(String, index=True, nullable=False)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    stripe_session_id = Column(String, unique=True, index=True, nullable=False)
    stripe_payment_intent_id = Column(String, nullable=True)
    amount_total = Column(Integer, nullable=False)  # in USD dollars
    currency = Column(String, default="usd")
    payment_status = Column(String, default="pending")  # pending, paid, cancelled, failed
    payment_type = Column(String, default="deposit")  # deposit or full
    car_ids = Column(Text, nullable=False)  # Comma-separated list of car IDs
    car_details = Column(Text, nullable=True)  # JSON summary of vehicles
    receipt_url = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
