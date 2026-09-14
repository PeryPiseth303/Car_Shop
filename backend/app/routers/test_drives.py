from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.test_drive import TestDriveModel
from app.models.user import UserModel
from app.routers.auth import get_current_admin
from app.schemas.test_drive import TestDriveCreate, TestDriveUpdate, TestDriveResponse

router = APIRouter(prefix="/api/test-drives", tags=["Test Drives"])

@router.get("", response_model=List[TestDriveResponse])
def get_test_drives(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    query = db.query(TestDriveModel)
    if status_filter:
        query = query.filter(TestDriveModel.status.ilike(status_filter))
    return query.order_by(desc(TestDriveModel.created_at)).all()

@router.post("", response_model=TestDriveResponse, status_code=status.HTTP_201_CREATED)
def create_test_drive(td_in: TestDriveCreate, db: Session = Depends(get_db)):
    td = TestDriveModel(
        car_id=td_in.car_id,
        car_name=td_in.car_name,
        customer_name=td_in.customer_name,
        customer_email=td_in.customer_email,
        customer_phone=td_in.customer_phone,
        appointment_date=td_in.appointment_date,
        time_slot=td_in.time_slot,
        location=td_in.location,
        specialist=td_in.specialist,
        status="Confirmed",
    )
    db.add(td)
    db.commit()
    db.refresh(td)
    return td

@router.patch("/{td_id}/status", response_model=TestDriveResponse)
def update_test_drive_status(
    td_id: int,
    td_in: TestDriveUpdate,
    db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    td = db.query(TestDriveModel).filter(TestDriveModel.id == td_id).first()
    if not td:
        raise HTTPException(status_code=404, detail="Test drive appointment not found")
    if td_in.status:
        td.status = td_in.status
    if td_in.specialist:
        td.specialist = td_in.specialist
    if td_in.appointment_date:
        td.appointment_date = td_in.appointment_date
    if td_in.time_slot:
        td.time_slot = td_in.time_slot
    db.commit()
    db.refresh(td)
    return td

@router.delete("/{td_id}", status_code=status.HTTP_200_OK)
def delete_test_drive(test_drive_id: int, db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    td = db.query(TestDriveModel).filter(TestDriveModel.id == td_id).first()
    if not td:
        raise HTTPException(status_code=404, detail="Test drive appointment not found")
    db.delete(td)
    db.commit()
    return {"message": f"Test drive {td_id} deleted successfully"}
