from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.inquiry import InquiryModel
from app.schemas.inquiry import InquiryCreate, InquiryUpdate, InquiryResponse

router = APIRouter(prefix="/api/inquiries", tags=["Inquiries"])

@router.get("", response_model=List[InquiryResponse])
def get_inquiries(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(InquiryModel)
    if status_filter:
        query = query.filter(InquiryModel.status.ilike(status_filter))
    return query.order_by(desc(InquiryModel.created_at)).all()

@router.post("", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
def create_inquiry(inquiry_in: InquiryCreate, db: Session = Depends(get_db)):
    inquiry = InquiryModel(
        name=inquiry_in.name,
        email=inquiry_in.email,
        phone=inquiry_in.phone,
        subject=inquiry_in.subject,
        message=inquiry_in.message,
        car_id=inquiry_in.car_id,
        car_name=inquiry_in.car_name,
        status="Pending",
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.patch("/{inquiry_id}/status", response_model=InquiryResponse)
def update_inquiry_status(
    inquiry_id: int,
    inquiry_in: InquiryUpdate,
    db: Session = Depends(get_db),
):
    inquiry = db.query(InquiryModel).filter(InquiryModel.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    if inquiry_in.status:
        inquiry.status = inquiry_in.status
    db.commit()
    db.refresh(inquiry)
    return inquiry

@router.delete("/{inquiry_id}", status_code=status.HTTP_200_OK)
def delete_inquiry(inquiry_id: int, db: Session = Depends(get_db)):
    inquiry = db.query(InquiryModel).filter(InquiryModel.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(status_code=404, detail="Inquiry not found")
    db.delete(inquiry)
    db.commit()
    return {"message": f"Inquiry {inquiry_id} deleted successfully"}
