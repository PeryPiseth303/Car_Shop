from typing import Optional
from pydantic import BaseModel, ConfigDict

class BrandBase(BaseModel):
    name: str
    logo_slug: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class BrandCreate(BrandBase):
    pass

class BrandResponse(BrandBase):
    id: int
