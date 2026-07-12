import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))

from sqlalchemy import Column, Integer, String, Boolean, Date, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.config import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    head_id = Column(Integer, ForeignKey("employees.id", use_alter=True, name="fk_dept_head"), nullable=True)
    parent_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String, default="Active")

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    custom_fields = Column(JSON, default=list) # Array of objects: [{"name": "Warranty", "type": "date"}]
    status = Column(String, default="Active")

class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    role = Column(String, default="Employee", nullable=False)
    status = Column(String, default="Active")
    is_active = Column(Boolean, default=True)

class Asset(Base):
    __tablename__ = "assets"
    id = Column(Integer, primary_key=True, index=True)
    tag = Column(String, unique=True, index=True, nullable=False) # e.g. AF-0001
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.id"), nullable=False)
    serial_no = Column(String, nullable=True)
    acquisition_date = Column(Date, nullable=True)
    acquisition_cost = Column(Float, nullable=True)
    condition = Column(String, default="Good")
    location = Column(String, nullable=True)
    status = Column(String, default="Available") # Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed
    is_bookable = Column(Boolean, default=False)
    photo_url = Column(String, nullable=True)
