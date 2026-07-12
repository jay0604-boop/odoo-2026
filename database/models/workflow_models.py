import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))

from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from database.config import Base
import datetime

class Allocation(Base):
    __tablename__ = "allocations"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    holder_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    allocated_date = Column(Date, default=datetime.date.today)
    expected_return_date = Column(Date, nullable=True)
    status = Column(String, default="Active") # Active, Returned

class TransferRequest(Base):
    __tablename__ = "transfer_requests"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    from_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    to_employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    reason = Column(String, nullable=True)
    status = Column(String, default="Pending") # Pending, Approved, Rejected, Completed

class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    status = Column(String, default="Upcoming") # Upcoming, Ongoing, Completed, Cancelled

class MaintenanceRequest(Base):
    __tablename__ = "maintenance_requests"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    requester_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    issue_description = Column(String, nullable=False)
    priority = Column(String, default="Medium") # Low, Medium, High, Critical
    status = Column(String, default="Pending") # Pending, Approved, Rejected, In Progress, Resolved
    technician_id = Column(Integer, ForeignKey("employees.id"), nullable=True)
    before_photo_url = Column(String, nullable=True)
    after_photo_url = Column(String, nullable=True)
