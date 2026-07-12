from sqlalchemy import Column, Integer, String, Boolean, Date, JSON, Float, ForeignKey
from sqlalchemy.orm import relationship
from database.config import Base

class Department(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True, index=True)
    head_id = Column(Integer, ForeignKey("employees.id", use_alter=True, name="fk_dept_head"), nullable=True)
    parent_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String, default="Active")
    
    parent = relationship("Department", remote_side=[id], backref="sub_departments")
    employees = relationship("Employee", back_populates="department")

class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    role = Column(String, nullable=False)
    status = Column(String, default="Active")
    
    department = relationship("Department", back_populates="employees")

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    custom_fields = Column(JSON, default=list)
    
    assets = relationship("Asset", back_populates="category")

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    asset_tag = Column(String, unique=True, index=True, nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.id"), nullable=False)
    serial_number = Column(String, nullable=True)
    acquisition_date = Column(Date, nullable=True)
    acquisition_cost = Column(Float, nullable=True)
    condition = Column(String, default="Good")
    location = Column(String, nullable=True)
    status = Column(String, default="Available")
    is_bookable = Column(Boolean, default=False)
    photo_url = Column(String, nullable=True)
    
    category = relationship("AssetCategory", back_populates="assets")
