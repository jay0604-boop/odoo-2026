import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[2]))

from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Date
from database.config import Base
import datetime

class AuditCycle(Base):
    __tablename__ = "audit_cycles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    scope_department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    status = Column(String, default="Active") # Active, Closed

class AuditFinding(Base):
    __tablename__ = "audit_findings"
    id = Column(Integer, primary_key=True, index=True)
    audit_cycle_id = Column(Integer, ForeignKey("audit_cycles.id"), nullable=False)
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=False)
    verification_state = Column(String, nullable=True) # Verified, Missing, Damaged
    notes = Column(String, nullable=True)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    recipient_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    type = Column(String, nullable=False) # e.g. Overdue, Approval, Maintenance
    message = Column(String, nullable=False)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"
    id = Column(Integer, primary_key=True, index=True)
    actor_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    action = Column(String, nullable=False) # e.g. Created, Updated, Approved, Deleted
    entity_type = Column(String, nullable=False) # e.g. Asset, Booking, AuditCycle
    entity_id = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
