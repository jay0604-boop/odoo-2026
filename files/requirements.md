# AssetFlow — Requirements Document
### Enterprise Asset & Resource Management System

---

## 1. Project Overview

AssetFlow is a centralized ERP module for tracking, allocating, and maintaining an organization's
physical assets and shared resources (equipment, furniture, vehicles, rooms). It is industry-agnostic —
applicable to offices, schools, hospitals, factories, or agencies — and deliberately excludes purchasing,
invoicing, and accounting concerns to keep scope focused on asset lifecycle and resource operations.

**Core capabilities:**
- Department, category, and employee master data setup
- Full asset lifecycle tracking (registration → allocation → maintenance → retirement/disposal)
- Conflict-safe allocation and transfer of assets
- Overlap-free time-slot booking of shared resources
- Approval-gated maintenance workflow
- Structured audit cycles with auto-generated discrepancy reports
- Real-time KPI dashboard and notifications

---

## 2. User Roles & Permissions

| Role | Key Permissions |
|---|---|
| **Admin** | Manages departments, asset categories, audit cycles, and employee/role promotion. Views org-wide analytics. Cannot be self-assigned at signup. |
| **Asset Manager** | Registers and allocates assets. Approves transfers, maintenance requests, and audit discrepancy resolutions. Approves returns and condition check-ins. |
| **Department Head** | Views assets allocated to their department. Approves allocation/transfer requests within the department. Books shared resources on the department's behalf. |
| **Employee** | Views assets allocated to them. Books shared resources. Raises maintenance requests. Initiates return/transfer requests. |

**Role assignment rule:** Signup creates an Employee account only — no role selection at signup. Only
an Admin can promote an Employee to Department Head or Asset Manager, and only from the Employee
Directory (Org Setup → Tab C). This prevents self-elevation/privilege escalation.

---

## 3. Functional Requirements

### 3.1 Authentication
- FR-1: Email/password signup creates a standard Employee account (no role field exposed).
- FR-2: Email/password login with session validation and forgot-password flow.
- FR-3: Only authenticated users can access any part of the application.
- FR-4: Role-based access control (RBAC) gates every screen/action per the role matrix in Section 2.

### 3.2 Organization Setup (Admin only)
- FR-5: Create/edit/deactivate a Department; assign Department Head, optional Parent Department
  (for hierarchy), and Status (Active/Inactive).
- FR-6: Create/edit Asset Categories with optional category-specific fields (e.g., warranty period
  for Electronics).
- FR-7: Maintain the Employee Directory (Name, Email, Department, Role, Status).
- FR-8: Promote an Employee to Department Head or Asset Manager — this is the *only* place role
  assignment happens.

### 3.3 Asset Registration & Directory
- FR-9: Register an asset with Name, Category, auto-generated Asset Tag (e.g., `AF-0001`), Serial
  Number, Acquisition Date, Acquisition Cost (informational only — not linked to accounting),
  Condition, Location, photo/documents, and a "shared/bookable" flag.
- FR-10: Search/filter assets by Asset Tag, Serial Number, QR code, category, status, department,
  or location.
- FR-11: Track lifecycle status per asset: `Available → Allocated → Reserved → Under Maintenance
  → Lost → Retired → Disposed`, with valid back-transitions (e.g., Available ↔ Under Maintenance,
  Allocated → Available).
- FR-12: Maintain a per-asset history combining allocation history and maintenance history.

### 3.4 Asset Allocation & Transfer
- FR-13: Allocate an asset to an employee or department with an optional Expected Return Date.
- FR-14: **Conflict rule:** block allocation of an already-allocated asset; show who currently holds
  it and offer a "Transfer Request" action instead.
- FR-15: Transfer workflow: `Requested → Approved (by Asset Manager/Department Head) →
  Re-allocated`, with allocation history updated automatically.
- FR-16: Return flow: mark as returned, capture condition check-in notes, revert asset status to
  Available.
- FR-17: Auto-flag overdue allocations (past Expected Return Date) and surface them on the
  Dashboard and in Notifications.

### 3.5 Resource Booking
- FR-18: Calendar view of a shared resource's existing bookings.
- FR-19: **Overlap validation:** reject a booking request that overlaps an existing one for the
  same resource; allow requests that start exactly when a prior booking ends.
- FR-20: Booking status lifecycle: `Upcoming → Ongoing → Completed`, or `Cancelled` at any point.
- FR-21: Support cancel/reschedule and send a reminder notification before the slot starts.

### 3.6 Maintenance Management
- FR-22: Raise a maintenance request: select asset, describe issue, set priority, attach photo.
- FR-23: Workflow: `Pending → Approved/Rejected (by Asset Manager) → Technician Assigned →
  In Progress → Resolved`.
- FR-24: Asset status auto-updates to Under Maintenance on approval, and back to Available on
  resolution.
- FR-25: Retain full maintenance history per asset.

### 3.7 Asset Audit
- FR-26: Create an Audit Cycle scoped by department/location and a date range.
- FR-27: Assign one or more auditors to a cycle.
- FR-28: Auditor marks each in-scope asset as Verified / Missing / Damaged.
- FR-29: System auto-generates a discrepancy report for any flagged (Missing/Damaged) items.
- FR-30: Closing an Audit Cycle locks it and updates affected asset statuses (e.g., confirmed-missing
  items move to Lost).
- FR-31: Retain audit history per cycle.

### 3.8 Reports & Analytics
- FR-32: Asset utilization trends (most-used vs. idle assets).
- FR-33: Maintenance frequency by asset/category.
- FR-34: Assets due for maintenance or nearing retirement.
- FR-35: Department-wise allocation summary.
- FR-36: Resource booking heatmap (peak usage windows).
- FR-37: Exportable reports.

### 3.9 Activity Logs & Notifications
- FR-38: Notification triggers, at minimum: Asset Assigned, Maintenance Approved/Rejected, Booking
  Confirmed/Cancelled/Reminder, Transfer Approved, Overdue Return Alert, Audit Discrepancy Flagged.
- FR-39: Full activity log of admin/manager/employee actions (who did what, when) — immutable audit
  trail.

### 3.10 Dashboard
- FR-40: KPI cards: Assets Available, Assets Allocated, Maintenance Today, Active Bookings,
  Pending Transfers, Upcoming Returns.
- FR-41: Overdue returns shown in a separate, visually distinct section from upcoming ones.
- FR-42: Quick actions: Register Asset, Book Resource, Raise Maintenance Request.

---

## 4. Business Rules Summary

| Rule | Description |
|---|---|
| No self-elevation | Signup never allows role selection; only Admin promotes roles, only from Employee Directory. |
| Single allocation | An asset cannot be allocated to more than one holder at a time; conflicts route to a Transfer Request. |
| No booking overlaps | Two bookings for the same resource cannot share any overlapping time window. |
| Maintenance gate | An asset cannot enter Under Maintenance status without an approved maintenance request. |
| Audit lock | Once an Audit Cycle is closed, it is locked; affected assets update status based on findings. |
| Overdue flagging | Allocations and bookings past their expected end date are automatically flagged system-wide. |

---

## 5. Data Entities (Expected Model)

| Entity | Key Fields | Relationships |
|---|---|---|
| Department | Name, Head, Parent Department, Status | Has many Employees, Assets |
| Asset Category | Name, category-specific fields | Has many Assets |
| Employee | Name, Email, Department, Role, Status | Belongs to Department; holds Allocations |
| Asset | Asset Tag, Name, Category, Serial No., Acquisition Date/Cost, Condition, Location, Status, Bookable flag | Belongs to Category; has Allocation/Maintenance/Audit history |
| Allocation | Asset, Holder (Employee/Department), Allocated Date, Expected Return Date, Status | Links Asset ↔ Employee/Department |
| Transfer Request | Asset, From, To, Status, Approver | Linked to Allocation |
| Booking | Resource (Asset), Requested By, Start/End Time, Status | Belongs to Asset |
| Maintenance Request | Asset, Issue, Priority, Status, Technician | Belongs to Asset |
| Audit Cycle | Scope (Dept/Location), Date Range, Auditors, Status | Has many Audit Findings |
| Audit Finding | Audit Cycle, Asset, Result (Verified/Missing/Damaged) | Belongs to Audit Cycle & Asset |
| Notification | Type, Recipient, Read/Unread, Timestamp | — |
| Activity Log | Actor, Action, Entity, Timestamp | — |

---

## 6. Non-Functional Requirements

- **Security:** Secure authentication, RBAC enforced server-side (not just UI-hidden), no
  self-privilege-escalation paths.
- **Usability:** Intuitive, responsive UI usable across roles without training.
- **Reliability:** State transitions (allocation, booking, maintenance, audit) must be atomic and
  consistent — no double-booking or double-allocation race conditions.
- **Scalability:** Modular architecture; new asset categories, departments, or resource types should
  not require structural changes.
- **Auditability:** Every state-changing action must be traceable in the Activity Log.
- **Responsiveness:** Usable on both desktop and mobile/tablet form factors.

---

## 7. Out of Scope

- Purchasing, procurement, or invoicing workflows
- Accounting/financial ledger integration (Acquisition Cost is informational only)
- Payroll or HR management beyond the Employee Directory needed for asset ownership
