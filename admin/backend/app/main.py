import os
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from app.api.router import api_router

app = FastAPI(title="AssetFlow Admin API")

# Ensure static/uploads directory exists
os.makedirs("static/uploads", exist_ok=True)

# Mount a local static directory wrapper
app.mount("/static", StaticFiles(directory="static"), name="static")

# Include the admin API router
app.include_router(api_router, prefix="/api/v1/admin")
