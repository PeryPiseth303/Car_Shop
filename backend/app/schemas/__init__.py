from app.schemas.car import CarBase, CarCreate, CarUpdate, CarResponse, CarListResponse
from app.schemas.brand import BrandBase, BrandCreate, BrandResponse
from app.schemas.inquiry import InquiryBase, InquiryCreate, InquiryUpdate, InquiryResponse
from app.schemas.sell_request import SellRequestBase, SellRequestCreate, SellRequestUpdate, SellRequestResponse
from app.schemas.test_drive import TestDriveBase, TestDriveCreate, TestDriveUpdate, TestDriveResponse
from app.schemas.analytics import DashboardAnalyticsResponse, BrandStat
from app.schemas.auth import (
    UserBase,
    UserCreate,
    LoginRequest,
    LoginResponse,
    VerifyOTPRequest,
    RegisterRequest,
    ResendOTPRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UserResponse,
    TokenResponse,
)

__all__ = [
    "CarBase",
    "CarCreate",
    "CarUpdate",
    "CarResponse",
    "CarListResponse",
    "BrandBase",
    "BrandCreate",
    "BrandResponse",
    "InquiryBase",
    "InquiryCreate",
    "InquiryUpdate",
    "InquiryResponse",
    "SellRequestBase",
    "SellRequestCreate",
    "SellRequestUpdate",
    "SellRequestResponse",
    "TestDriveBase",
    "TestDriveCreate",
    "TestDriveUpdate",
    "TestDriveResponse",
    "DashboardAnalyticsResponse",
    "BrandStat",
    "UserBase",
    "UserCreate",
    "LoginRequest",
    "LoginResponse",
    "VerifyOTPRequest",
    "RegisterRequest",
    "ResendOTPRequest",
    "ForgotPasswordRequest",
    "ResetPasswordRequest",
    "UserResponse",
    "TokenResponse",
]
