import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class TestDriveBase(BaseModel):
    car_id: str
    car_name: str
    customer_name: str
    customer_email: str
    customer_phone: str
    appointment_date: str
    time_slot: str
    location: str = "Phnom Penh Flagship"
    specialist: str = "James (Senior Specialist)"

    model_config = ConfigDict(from_attributes=True)

class TestDriveCreate(TestDriveBase):
    pass

class TestDriveUpdate(BaseModel):
    status: Optional[str] = None
    specialist: Optional[str] = None
    appointment_date: Optional[str] = None
    time_slot: Optional[str] = None

class TestDriveResponse(TestDriveBase):
    id: int
    status: str
    created_at: datetime.datetime
