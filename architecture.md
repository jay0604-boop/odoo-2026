# AssetFlow - System Architecture & API Blueprint

## 1. Data Schema Architecture (SQLAlchemy Models)
### Core Systems (`database/models/core_models.py`)
* **Department:** `id (PK)`, `name`, `parent_id (FK -> self)`, `status (Active/Inactive)`.
* **Employee:** `id (PK)`, `name`, `email (Unique)`, `password_hash`, `department_id (FK)`, `role (Enum)`, `status`.
* **Asset:** `id (PK)`, `name`, `category_id (FK)`, `asset_tag (Unique)`, `serial_number`, `condition`, `status (Enum)`, `is_bookable (Boolean)`.

## 2. Discrete Domain API Map
### Admin Backend Portal (Running on Port `8000` / Route Prefix `/api/v1/admin`)
* `POST /admin/departments` -> Creates new organizational nodes.
* `PATCH /admin/employees/{id}/role` -> Alters system permissions (Strict Admin only).

### User Backend Portal (Running on Port `8001` / Route Prefix `/api/v1/user`)
* `GET /user/dashboard` -> Returns personalized KPI snapshot arrays.
* `POST /user/bookings` -> Queries and logs upcoming resource slot allocations.
