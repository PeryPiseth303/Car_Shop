from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.car import CarModel
from app.models.inquiry import InquiryModel
from app.models.sell_request import SellRequestModel
from app.models.test_drive import TestDriveModel
from app.models.user import UserModel
from app.routers.auth import get_current_admin
from app.schemas.analytics import DashboardAnalyticsResponse, BrandStat

router = APIRouter(prefix="/api/analytics", tags=["Analytics"])

@router.get("/dashboard", response_model=DashboardAnalyticsResponse)
def get_dashboard(db: Session = Depends(get_db), admin: UserModel = Depends(get_current_admin)):
    total_cars = db.query(func.count(CarModel.id)).scalar() or 0
    total_value = db.query(func.sum(CarModel.price)).scalar() or 0
    certified_cars = db.query(func.count(CarModel.id)).filter(CarModel.condition == "Certified").scalar() or 0
    new_cars = db.query(func.count(CarModel.id)).filter(CarModel.condition == "New").scalar() or 0

    total_inquiries = db.query(func.count(InquiryModel.id)).scalar() or 0
    pending_inquiries = db.query(func.count(InquiryModel.id)).filter(InquiryModel.status == "Pending").scalar() or 0

    total_sell = db.query(func.count(SellRequestModel.id)).scalar() or 0
    pending_sell = db.query(func.count(SellRequestModel.id)).filter(SellRequestModel.status == "Under Review").scalar() or 0

    total_test_drives = db.query(func.count(TestDriveModel.id)).scalar() or 0
    upcoming_test_drives = db.query(func.count(TestDriveModel.id)).filter(TestDriveModel.status == "Confirmed").scalar() or 0

    # Brand counts
    brands_data = (
        db.query(CarModel.brand, func.count(CarModel.id).label("count"))
        .group_by(CarModel.brand)
        .order_by(func.count(CarModel.id).desc())
        .all()
    )
    brand_stats = [BrandStat(brand=b[0], count=b[1]) for b in brands_data]

    return DashboardAnalyticsResponse(
        total_cars=total_cars,
        total_inventory_value=int(total_value),
        total_inquiries=total_inquiries,
        pending_inquiries=pending_inquiries,
        total_sell_requests=total_sell,
        pending_sell_requests=pending_sell,
        total_test_drives=total_test_drives,
        upcoming_test_drives=upcoming_test_drives,
        certified_cars=certified_cars,
        new_cars=new_cars,
        brand_distribution=brand_stats,
        recent_activity_count=pending_inquiries + pending_sell + upcoming_test_drives,
    )
