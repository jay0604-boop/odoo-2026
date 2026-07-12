# AssetFlow - Core Optimization Brain Logic

## 1. Time-Slot Scheduling Overlap Resolver
This highly optimized query ensures zero overlap checking occurs with minimal database reads. Use this logic directly in `POST /user/bookings`:

```python
from datetime import datetime
from sqlalchemy.orm import Session
from database.models.workflow_models import ResourceBooking

def check_booking_overlap(db: Session, asset_id: int, start: datetime, end: datetime) -> bool:
    overlap = db.query(ResourceBooking).filter(
        ResourceBooking.asset_id == asset_id,
        ResourceBooking.status.in_(["Upcoming", "Ongoing"]),
        ResourceBooking.start_time < end,
        ResourceBooking.end_time > start
    ).first()
    
    return overlap is not None
```
