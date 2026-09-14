import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class SellRequestBase(BaseModel):
    make: str
    model: str
    year: Optional[int] = None
    vin: Optional[str] = None
    mileage: Optional[str] = None
    body_type: Optional[str] = None
    fuel_type: Optional[str] = None
    transmission: Optional[str] = None
    engine: Optional[str] = None
    exterior_color: Optional[str] = None
    features: Optional[str] = None
    asking_price: Optional[str] = None
    full_name: str
    email: str
    phone: Optional[str] = None
    zip_code: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class SellRequestCreate(SellRequestBase):
    pass

class SellRequestUpdate(BaseModel):
    status: Optional[str] = None

class SellRequestResponse(SellRequestBase):
    id: int
    status: str
    created_at: datetime.datetime
