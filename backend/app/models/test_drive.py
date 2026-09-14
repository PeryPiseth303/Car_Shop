import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class TestDriveModel(Base):
    __tablename__ = "test_drives"

    id = Column(Integer, primary_key=True, autoincrement=True)
    car_id = Column(String, nullable=False)
    car_name = Column(String, nullable=False)
    customer_name = Column(String, nullable=False)
    customer_email = Column(String, nullable=False)
    customer_phone = Column(String, nullable=False)
    appointment_date = Column(String, nullable=False) # e.g. "Friday, Aug 15"
    time_slot = Column(String, nullable=False) # e.g. "2:30 PM"
    location = Column(String, default="Phnom Penh Flagship")
    specialist = Column(String, default="James (Senior Specialist)")
    status = Column(String, default="Confirmed") # Confirmed, Completed, Cancelled
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
