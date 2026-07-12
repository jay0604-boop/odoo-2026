from sqlalchemy import Column, Integer, String, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from database.config import Base

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    parent_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String, default="Active") # Active/Inactive
    
    parent = relationship("Department", remote_side=[id], backref="sub_departments")
    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    role = Column(String, nullable=False) # e.g. Admin, Asset Manager, Department Head, Employee
    status = Column(String, default="Active")
    
    department = relationship("Department", back_populates="employees")

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    
    assets = relationship("Asset", back_populates="category")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.id"), nullable=True)
    asset_tag = Column(String, unique=True, index=True, nullable=False)
    serial_number = Column(String, nullable=True)
    condition = Column(String, nullable=True) # e.g. New, Good, Fair, Poor
    status = Column(String, default="Available") # Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed
    is_bookable = Column(Boolean, default=False)
    location = Column(String, nullable=True)
    photo_url = Column(String, nullable=True)
    
    category = relationship("AssetCategory", back_populates="assets")
