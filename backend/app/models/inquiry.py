import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from app.database import Base

class InquiryModel(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=True)
    subject = Column(String, nullable=False, default="Vehicle enquiry")
    message = Column(Text, nullable=False)
    car_id = Column(String, nullable=True)
    car_name = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Contacted, Resolved, Archived
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
