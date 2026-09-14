import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class InquiryBase(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str = "Vehicle enquiry"
    message: str
    car_id: Optional[str] = None
    car_name: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class InquiryCreate(InquiryBase):
    pass

class InquiryUpdate(BaseModel):
    status: Optional[str] = None

class InquiryResponse(InquiryBase):
    id: int
    status: str
    created_at: datetime.datetime
