from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.sell_request import SellRequestModel
from app.schemas.sell_request import SellRequestCreate, SellRequestUpdate, SellRequestResponse

router = APIRouter(prefix="/api/sell-requests", tags=["Sell Requests"])

@router.get("", response_model=List[SellRequestResponse])
def get_sell_requests(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(SellRequestModel)
    if status_filter:
        query = query.filter(SellRequestModel.status.ilike(status_filter))
    return query.order_by(desc(SellRequestModel.created_at)).all()

@router.post("", response_model=SellRequestResponse, status_code=status.HTTP_201_CREATED)
def create_sell_request(sell_in: SellRequestCreate, db: Session = Depends(get_db)):
    req = SellRequestModel(
        make=sell_in.make,
        model=sell_in.model,
        year=sell_in.year,
        vin=sell_in.vin,
        mileage=sell_in.mileage,
        body_type=sell_in.body_type,
        fuel_type=sell_in.fuel_type,
        transmission=sell_in.transmission,
        engine=sell_in.engine,
        exterior_color=sell_in.exterior_color,
        features=sell_in.features,
        asking_price=sell_in.asking_price,
        full_name=sell_in.full_name,
        email=sell_in.email,
        phone=sell_in.phone,
        zip_code=sell_in.zip_code,
        status="Under Review",
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    return req

@router.patch("/{request_id}/status", response_model=SellRequestResponse)
def update_sell_request_status(
    request_id: int,
    sell_in: SellRequestUpdate,
    db: Session = Depends(get_db),
):
    req = db.query(SellRequestModel).filter(SellRequestModel.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Sell request not found")
    if sell_in.status:
        req.status = sell_in.status
    db.commit()
    db.refresh(req)
    return req

@router.delete("/{request_id}", status_code=status.HTTP_200_OK)
def delete_sell_request(request_id: int, db: Session = Depends(get_db)):
    req = db.query(SellRequestModel).filter(SellRequestModel.id == request_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Sell request not found")
    db.delete(req)
    db.commit()
    return {"message": f"Sell request {request_id} deleted successfully"}
