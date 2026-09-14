import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class SellRequestModel(Base):
    __tablename__ = "sell_requests"

    id = Column(Integer, primary_key=True, autoincrement=True)
    make = Column(String, nullable=False)
    model = Column(String, nullable=False)
    year = Column(Integer, nullable=True)
    vin = Column(String, nullable=True)
    mileage = Column(String, nullable=True)
    body_type = Column(String, nullable=True)
    fuel_type = Column(String, nullable=True)
    transmission = Column(String, nullable=True)
    engine = Column(String, nullable=True)
    exterior_color = Column(String, nullable=True)
    features = Column(Text, nullable=True)
    asking_price = Column(String, nullable=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    status = Column(String, default="Under Review") # Under Review, Approved, Rejected, Listed
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
