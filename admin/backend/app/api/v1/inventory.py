import os
import uuid
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from database.config import get_db
from database.models.core_models import Asset, AssetCategory

router = APIRouter()

@router.post("/register")
def register_asset(
    name: str = Form(...),
    category: str = Form(...),
    serialNumber: str = Form(None),
    cost: str = Form(None),
    condition: str = Form(None),
    location: str = Form(None),
    isBookable: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    # Ensure static/uploads exists
    os.makedirs("static/uploads", exist_ok=True)
    
    photo_url = None
    if image is not None and image.filename:
        try:
            # Generate unique filename using uuid
            file_ext = os.path.splitext(image.filename)[1]
            if not file_ext:
                file_ext = ".png" # default fallback
            unique_filename = f"{uuid.uuid4()}{file_ext}"
            file_path = os.path.join("static", "uploads", unique_filename)
            
            # Read raw stream and write it to the unique file in static/uploads
            with open(file_path, "wb") as buffer:
                while chunk := image.file.read(8192):
                    buffer.write(chunk)
            
            photo_url = f"/static/uploads/{unique_filename}"
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to save upload: {str(e)}")
            
    # Generate asset tag (e.g. AF-0001, AF-0002)
    count = db.query(Asset).count()
    asset_tag = f"AF-{(count + 1):04d}"
    
    # Check if category exists, if not create or associate it
    cat_obj = db.query(AssetCategory).filter(AssetCategory.name == category).first()
    if not cat_obj:
        cat_obj = AssetCategory(name=category)
        db.add(cat_obj)
        db.commit()
        db.refresh(cat_obj)
        
    is_bookable_bool = str(isBookable).lower() == "true" if isBookable else False
    
    db_asset = Asset(
        name=name,
        category_id=cat_obj.id,
        asset_tag=asset_tag,
        serial_number=serialNumber,
        condition=condition,
        location=location,
        is_bookable=is_bookable_bool,
        photo_url=photo_url,
        status="Available"
    )
    
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    
    return {
        "id": db_asset.id,
        "tag": db_asset.asset_tag,
        "name": db_asset.name,
        "category": category,
        "serialNumber": db_asset.serial_number,
        "condition": db_asset.condition,
        "location": db_asset.location,
        "isBookable": db_asset.is_bookable,
        "photo_url": db_asset.photo_url,
        "status": db_asset.status
    }

@router.get("/")
def list_assets(db: Session = Depends(get_db)):
    assets = db.query(Asset).all()
    result = []
    for asset in assets:
        cat_name = asset.category.name if asset.category else "Uncategorized"
        result.append({
            "id": asset.id,
            "tag": asset.asset_tag,
            "name": asset.name,
            "category": cat_name,
            "serialNumber": asset.serial_number,
            "condition": asset.condition,
            "location": asset.location,
            "isBookable": asset.is_bookable,
            "photo_url": asset.photo_url,
            "status": asset.status
        })
    return result
