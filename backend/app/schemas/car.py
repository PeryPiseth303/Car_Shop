from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

class CarBase(BaseModel):
    brand: str
    model: str
    year: int
    price: int
    mileage: int
    transmission: str = "Automatic"
    fuel_type: str = Field(default="Gasoline", serialization_alias="fuelType")
    body_type: str = Field(default="Coupe", serialization_alias="bodyType")
    engine: str
    horsepower: int
    color: str
    interior_color: str = Field(default="Black Nappa Leather", serialization_alias="interiorColor")
    location: str = "Phnom Penh, Cambodia"
    description: str
    images: List[str] = []
    features: List[str] = []
    featured: bool = False
    condition: str = "Certified"
    seats: int = 4
    drive_type: str = Field(default="Rear-wheel drive", serialization_alias="driveType")

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
    )

class CarCreate(BaseModel):
    id: Optional[str] = None
    brand: str
    model: str
    year: int
    price: int
    mileage: int
    transmission: str = "Automatic"
    fuelType: Optional[str] = None
    fuel_type: Optional[str] = None
    bodyType: Optional[str] = None
    body_type: Optional[str] = None
    engine: str
    horsepower: int
    color: str
    interiorColor: Optional[str] = None
    interior_color: Optional[str] = None
    location: str = "Phnom Penh, Cambodia"
    description: str
    images: List[str] = []
    features: List[str] = []
    featured: bool = False
    condition: str = "Certified"
    seats: int = 4
    driveType: Optional[str] = None
    drive_type: Optional[str] = None

    model_config = ConfigDict(
        populate_by_name=True,
    )

class CarUpdate(BaseModel):
    brand: Optional[str] = None
    model: Optional[str] = None
    year: Optional[int] = None
    price: Optional[int] = None
    mileage: Optional[int] = None
    transmission: Optional[str] = None
    fuelType: Optional[str] = None
    fuel_type: Optional[str] = None
    bodyType: Optional[str] = None
    body_type: Optional[str] = None
    engine: Optional[str] = None
    horsepower: Optional[int] = None
    color: Optional[str] = None
    interiorColor: Optional[str] = None
    interior_color: Optional[str] = None
    location: Optional[str] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    features: Optional[List[str]] = None
    featured: Optional[bool] = None
    condition: Optional[str] = None
    seats: Optional[int] = None
    driveType: Optional[str] = None
    drive_type: Optional[str] = None

class CarResponse(CarBase):
    id: str

class CarListResponse(BaseModel):
    total: int
    cars: List[CarResponse]
