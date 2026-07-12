from fastapi import APIRouter
from app.api.v1 import auth, dashboard, bookings

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth")
api_router.include_router(dashboard.router, prefix="/dashboard")
api_router.include_router(bookings.router, prefix="/bookings")
