from typing import Dict, List
from pydantic import BaseModel

class BrandStat(BaseModel):
    brand: str
    count: int

class DashboardAnalyticsResponse(BaseModel):
    total_cars: int
    total_inventory_value: int
    total_inquiries: int
    pending_inquiries: int
    total_sell_requests: int
    pending_sell_requests: int
    total_test_drives: int
    upcoming_test_drives: int
    certified_cars: int
    new_cars: int
    brand_distribution: List[BrandStat]
    recent_activity_count: int
