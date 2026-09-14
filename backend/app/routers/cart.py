from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.cart import CartItemModel
from app.models.car import CarModel
from app.schemas.car import CarResponse

router = APIRouter(prefix="/api/cart", tags=["Cart"])

class CartAddRequest(BaseModel):
    email: str
    car_id: str

@router.get("", response_model=List[CarResponse])
def get_user_cart(
    email: str = Query(..., description="User's email"),
    db: Session = Depends(get_db),
):
    cart_items = (
        db.query(CartItemModel)
        .filter(CartItemModel.user_email == email.lower().strip())
        .order_by(CartItemModel.created_at.desc())
        .all()
    )
    cars = [item.car for item in cart_items if item.car is not None]
    return cars

@router.post("", status_code=status.HTTP_201_CREATED)
def add_to_cart(
    payload: CartAddRequest,
    db: Session = Depends(get_db),
):
    email = payload.email.lower().strip()
    car = db.query(CarModel).filter(CarModel.id == payload.car_id).first()
    if not car:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Car not found",
        )

    # Check if already in cart
    existing = (
        db.query(CartItemModel)
        .filter(
            CartItemModel.user_email == email,
            CartItemModel.car_id == payload.car_id,
        )
        .first()
    )
    if not existing:
        cart_item = CartItemModel(user_email=email, car_id=payload.car_id)
        db.add(cart_item)
        db.commit()

    return {"message": "Car added to cart successfully", "car_id": payload.car_id}

@router.delete("/{car_id}")
def remove_from_cart(
    car_id: str,
    email: str = Query(..., description="User's email"),
    db: Session = Depends(get_db),
):
    norm_email = email.lower().strip()
    item = (
        db.query(CartItemModel)
        .filter(
            CartItemModel.user_email == norm_email,
            CartItemModel.car_id == car_id,
        )
        .first()
    )
    if item:
        db.delete(item)
        db.commit()
    return {"message": "Car removed from cart successfully", "car_id": car_id}

@router.delete("")
def clear_cart(
    email: str = Query(..., description="User's email"),
    db: Session = Depends(get_db),
):
    norm_email = email.lower().strip()
    db.query(CartItemModel).filter(CartItemModel.user_email == norm_email).delete()
    db.commit()
    return {"message": "Cart cleared successfully"}
