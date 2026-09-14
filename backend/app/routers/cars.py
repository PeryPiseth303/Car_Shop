import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc, asc

from app.database import get_db
from app.models.car import CarModel
from app.models.user import UserModel
from app.schemas.car import CarCreate, CarUpdate, CarResponse
from app.routers.auth import get_current_admin

router = APIRouter(prefix="/api/cars", tags=["Cars"])

@router.get("", response_model=List[CarResponse])
def get_cars(
    brand: Optional[str] = None,
    fuel_type: Optional[str] = Query(None, alias="fuelType"),
    condition: Optional[str] = None,
    color: Optional[str] = None,
    year: Optional[int] = None,
    max_mileage: Optional[int] = Query(None, alias="maxMileage"),
    min_price: Optional[int] = Query(None, alias="minPrice"),
    max_price: Optional[int] = Query(None, alias="maxPrice"),
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    sort: Optional[str] = "newest", # newest, low, high
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(CarModel)

    if brand:
        query = query.filter(CarModel.brand.ilike(brand))
    if fuel_type:
        query = query.filter(CarModel.fuel_type.ilike(fuel_type))
    if condition:
        query = query.filter(CarModel.condition.ilike(condition))
    if color:
        query = query.filter(CarModel.color.ilike(color))
    if year:
        query = query.filter(CarModel.year == year)
    if max_mileage is not None:
        query = query.filter(CarModel.mileage <= max_mileage)
    if min_price is not None:
        query = query.filter(CarModel.price >= min_price)
    if max_price is not None:
        query = query.filter(CarModel.price <= max_price)
    if featured is not None:
        query = query.filter(CarModel.featured == featured)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                CarModel.brand.ilike(search_pattern),
                CarModel.model.ilike(search_pattern),
                CarModel.description.ilike(search_pattern),
                CarModel.location.ilike(search_pattern),
            )
        )

    # Sorting
    if sort == "low":
        query = query.order_by(asc(CarModel.price))
    elif sort == "high":
        query = query.order_by(desc(CarModel.price))
    elif sort == "year":
        query = query.order_by(desc(CarModel.year))
    else: # newest
        query = query.order_by(desc(CarModel.created_at), desc(CarModel.year))

    cars = query.offset(skip).limit(limit).all()
    return cars

@router.get("/{car_id}", response_model=CarResponse)
def get_car_by_id(car_id: str, db: Session = Depends(get_db)):
    car = db.query(CarModel).filter(CarModel.id == car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car with ID '{car_id}' not found",
        )
    return car

@router.post("", response_model=CarResponse, status_code=status.HTTP_201_CREATED)
def create_car(
    car_in: CarCreate,
    admin: UserModel = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    car_id = car_in.id or str(uuid.uuid4())[:8]

    # Check for existing id
    existing = db.query(CarModel).filter(CarModel.id == car_id).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Car with ID '{car_id}' already exists",
        )

    # Normalize fields from camelCase or snake_case
    fuel_val = car_in.fuel_type or car_in.fuelType or "Gasoline"
    body_val = car_in.body_type or car_in.bodyType or "Coupe"
    interior_val = car_in.interior_color or car_in.interiorColor or "Black Nappa Leather"
    drive_val = car_in.drive_type or car_in.driveType or "Rear-wheel drive"

    db_car = CarModel(
        id=car_id,
        brand=car_in.brand,
        model=car_in.model,
        year=car_in.year,
        price=car_in.price,
        mileage=car_in.mileage,
        transmission=car_in.transmission,
        fuel_type=fuel_val,
        body_type=body_val,
        engine=car_in.engine,
        horsepower=car_in.horsepower,
        color=car_in.color,
        interior_color=interior_val,
        location=car_in.location,
        description=car_in.description,
        images=car_in.images if car_in.images else [
            "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85"
        ],
        features=car_in.features if car_in.features else ["Premium sound system", "Adaptive cruise control"],
        featured=car_in.featured,
        condition=car_in.condition,
        seats=car_in.seats,
        drive_type=drive_val,
    )
    db.add(db_car)
    db.commit()
    db.refresh(db_car)
    return db_car

@router.put("/{car_id}", response_model=CarResponse)
def update_car(
    car_id: str,
    car_in: CarUpdate,
    admin: UserModel = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    db_car = db.query(CarModel).filter(CarModel.id == car_id).first()
    if not db_car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car with ID '{car_id}' not found",
        )

    update_data = car_in.model_dump(exclude_unset=True)
    
    # Map camelCase alias fields
    if "fuelType" in update_data:
        update_data["fuel_type"] = update_data.pop("fuelType")
    if "bodyType" in update_data:
        update_data["body_type"] = update_data.pop("bodyType")
    if "interiorColor" in update_data:
        update_data["interior_color"] = update_data.pop("interiorColor")
    if "driveType" in update_data:
        update_data["drive_type"] = update_data.pop("driveType")

    for key, value in update_data.items():
        if hasattr(db_car, key) and value is not None:
            setattr(db_car, key, value)

    db.commit()
    db.refresh(db_car)
    return db_car

@router.patch("/{car_id}/featured", response_model=CarResponse)
def toggle_featured(
    car_id: str,
    admin: UserModel = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    db_car = db.query(CarModel).filter(CarModel.id == car_id).first()
    if not db_car:
        raise HTTPException(status_code=404, detail="Car not found")
    db_car.featured = not db_car.featured
    db.commit()
    db.refresh(db_car)
    return db_car

@router.delete("/{car_id}", status_code=status.HTTP_200_OK)
def delete_car(
    car_id: str,
    admin: UserModel = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    db_car = db.query(CarModel).filter(CarModel.id == car_id).first()
    if not db_car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Car with ID '{car_id}' not found",
        )
    db.delete(db_car)
    db.commit()
    return {"message": f"Car '{car_id}' deleted successfully", "id": car_id}
