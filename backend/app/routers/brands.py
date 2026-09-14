from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.brand import BrandModel
from app.models.car import CarModel
from app.schemas.brand import BrandCreate, BrandResponse

router = APIRouter(prefix="/api/brands", tags=["Brands"])

@router.get("", response_model=List[dict])
def get_brands(db: Session = Depends(get_db)):
    brands = db.query(BrandModel).all()
    # Calculate counts per brand
    results = []
    for b in brands:
        count = db.query(func.count(CarModel.id)).filter(CarModel.brand.ilike(b.name)).scalar()
        results.append({
            "id": b.id,
            "name": b.name,
            "logo_slug": b.logo_slug,
            "vehicle_count": count or 0,
        })
    return results

@router.post("", response_model=BrandResponse, status_code=status.HTTP_201_CREATED)
def create_brand(brand_in: BrandCreate, db: Session = Depends(get_db)):
    brand = BrandModel(name=brand_in.name, logo_slug=brand_in.logo_slug)
    db.add(brand)
    db.commit()
    db.refresh(brand)
    return brand
