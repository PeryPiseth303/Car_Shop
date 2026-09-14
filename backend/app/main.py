from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from app.config import settings
from app.utils.logger import get_logger
from app.seed import seed_database
from app.routers import (
    cars_router,
    brands_router,
    inquiries_router,
    sell_requests_router,
    test_drives_router,
    analytics_router,
    auth_router,
    cart_router,
)

logger = get_logger(__name__)

limiter = Limiter(key_func=get_remote_address)
# Attach limiter to app state later

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize and seed database on startup
    try:
        print("Executing startup database initialization and seeding...")
        seed_database()
        print("Database ready!")
    except Exception as e:
        print(f"Database initialization warning: {e}")
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="High-performance backend API for Aurelia Motors luxury marketplace and Admin Dashboard",
    lifespan=lifespan,
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins during dev for seamless frontend connection
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(auth_router)
app.include_router(cars_router)
app.include_router(brands_router)
app.include_router(inquiries_router)
app.include_router(sell_requests_router)
app.include_router(test_drives_router)
app.include_router(analytics_router)
app.include_router(cart_router)

@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to Aurelia Motors API",
        "docs": "/docs",
        "health": "/api/health",
    }
