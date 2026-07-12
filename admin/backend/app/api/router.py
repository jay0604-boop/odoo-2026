from fastapi import APIRouter
from app.api.v1 import inventory, audits, org_setup

api_router = APIRouter()
api_router.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
api_router.include_router(audits.router, prefix="/audits", tags=["Audits"])
api_router.include_router(org_setup.router, prefix="/org_setup", tags=["Organization Setup"])
