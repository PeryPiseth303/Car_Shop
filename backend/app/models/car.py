import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, JSON, Text
from app.database import Base

class CarModel(Base):
    __tablename__ = "cars"

    id = Column(String, primary_key=True, index=True)
    brand = Column(String, index=True, nullable=False)
    model = Column(String, index=True, nullable=False)
    year = Column(Integer, nullable=False)
    price = Column(Integer, nullable=False, index=True)
    mileage = Column(Integer, nullable=False)
    transmission = Column(String, nullable=False, default="Automatic")
    fuel_type = Column(String, nullable=False, default="Gasoline")
    body_type = Column(String, nullable=False, default="Coupe")
    engine = Column(String, nullable=False)
    horsepower = Column(Integer, nullable=False)
    color = Column(String, nullable=False)
    interior_color = Column(String, nullable=False)
    location = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    images = Column(JSON, nullable=False, default=list)
    features = Column(JSON, nullable=False, default=list)
    featured = Column(Boolean, default=False, index=True)
    condition = Column(String, nullable=False, default="Certified", index=True)
    seats = Column(Integer, nullable=False, default=4)
    drive_type = Column(String, nullable=False, default="Rear-wheel drive")
    created_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
