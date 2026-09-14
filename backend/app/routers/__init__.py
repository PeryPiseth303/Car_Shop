from app.routers.cars import router as cars_router
from app.routers.brands import router as brands_router
from app.routers.inquiries import router as inquiries_router
from app.routers.sell_requests import router as sell_requests_router
from app.routers.test_drives import router as test_drives_router
from app.routers.analytics import router as analytics_router
from app.routers.auth import router as auth_router
from app.routers.cart import router as cart_router

__all__ = [
    "cars_router",
    "brands_router",
    "inquiries_router",
    "sell_requests_router",
    "test_drives_router",
    "analytics_router",
    "auth_router",
    "cart_router",
]
