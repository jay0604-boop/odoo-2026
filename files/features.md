# AssetFlow — Features Document

This document breaks down every feature by module and tags each as **Core (MVP)** — must work for a
credible demo — or **Stretch** — valuable but safe to cut if time runs short. Use this to sequence your
build across the hackathon.

---

## 1. Authentication & Access

| Feature | Priority |
|---|---|
| Email/password signup (Employee-only, no role field) | Core |
| Email/password login with session handling | Core |
| RBAC enforcement across all screens/actions | Core |
| Forgot password flow | Stretch |

## 2. Dashboard

| Feature | Priority |
|---|---|
| KPI cards: Assets Available, Allocated, Maintenance Today, Active Bookings, Pending Transfers, Upcoming Returns | Core |
| Overdue Returns highlighted separately | Core |
| Quick actions (Register Asset / Book Resource / Raise Maintenance Request) | Core |
| Role-specific dashboard views (Admin sees org-wide, Employee sees personal) | Stretch |

## 3. Organization Setup (Admin)

| Feature | Priority |
|---|---|
| Department CRUD (Name, Head, Parent, Status) | Core |
| Asset Category CRUD | Core |
| Employee Directory listing + status management | Core |
| Promote Employee → Department Head / Asset Manager | Core |
| Category-specific custom fields (e.g., warranty period) | Stretch |
| Department hierarchy visualization (org chart) | Stretch |

## 4. Asset Registration & Directory

| Feature | Priority |
|---|---|
| Register asset with auto-generated Asset Tag | Core |
| Core fields: Name, Category, Serial No., Condition, Location, Status | Core |
| Search/filter by tag, category, status, department, location | Core |
| Lifecycle status display (7 states) | Core |
| Per-asset combined history (allocation + maintenance) | Core |
| Photo/document upload | Stretch |
| QR code generation & scan-based lookup | Stretch |
| "Shared/bookable" flag toggle | Core |

## 5. Asset Allocation & Transfer

| Feature | Priority |
|---|---|
| Allocate asset to employee/department | Core |
| Conflict detection — block double allocation, show current holder | Core |
| "Transfer Request" action on conflict | Core |
| Transfer workflow: Requested → Approved → Re-allocated | Core |
| Return flow with condition check-in notes | Core |
| Auto-flag overdue allocations | Core |
| Allocation history auto-update on transfer | Core |
| Bulk allocation (multiple assets at once) | Stretch |

## 6. Resource Booking

| Feature | Priority |
|---|---|
| Calendar view of existing bookings per resource | Core |
| Overlap validation on new booking requests | Core |
| Booking status: Upcoming / Ongoing / Completed / Cancelled | Core |
| Cancel/reschedule booking | Core |
| Reminder notification before slot starts | Stretch |
| Recurring bookings | Stretch |

## 7. Maintenance Management

| Feature | Priority |
|---|---|
| Raise maintenance request (asset, issue, priority) | Core |
| Approval workflow: Pending → Approved/Rejected | Core |
| Technician Assigned → In Progress → Resolved stages | Core |
| Auto status change: asset → Under Maintenance on approval, → Available on resolution | Core |
| Maintenance history per asset | Core |
| Photo attachment on request | Stretch |

## 8. Asset Audit

| Feature | Priority |
|---|---|
| Create Audit Cycle (scope + date range) | Core |
| Assign auditor(s) to cycle | Core |
| Mark assets Verified / Missing / Damaged | Core |
| Auto-generate discrepancy report | Core |
| Close Audit Cycle (lock + status updates, e.g. → Lost) | Core |
| Audit history per cycle | Core |
| Multi-auditor concurrent audit support | Stretch |

## 9. Reports & Analytics

| Feature | Priority |
|---|---|
| Department-wise allocation summary | Core |
| Assets due for maintenance / nearing retirement | Core |
| Asset utilization trends (most-used vs idle) | Stretch |
| Maintenance frequency by asset/category | Stretch |
| Resource booking heatmap | Stretch |
| Exportable reports (CSV/PDF) | Stretch |

## 10. Activity Logs & Notifications

| Feature | Priority |
|---|---|
| In-app notifications for key events (assignment, approval/rejection, booking, overdue, discrepancy) | Core |
| Full activity log (actor, action, entity, timestamp) | Core |
| Email notifications | Stretch |
| Notification preferences/settings | Stretch |

---

## Suggested Build Order (for an 8-hour window)

1. **Hour 1:** Auth + RBAC skeleton, Department/Category/Employee CRUD (Org Setup)
2. **Hours 2-3:** Asset Registration & Directory, Dashboard KPI shell
3. **Hours 3-4:** Allocation & Transfer workflow (the signature "conflict handling" feature — get this demo-ready)
4. **Hours 4-5:** Resource Booking with overlap validation (the second signature feature)
5. **Hours 5-6:** Maintenance approval workflow
6. **Hours 6-7:** Audit Cycle + discrepancy reports
7. **Hour 7:** Notifications + Activity Log wiring across all modules
8. **Hour 8:** Polish, seed demo data, rehearse the walkthrough (register → allocate → conflict → transfer → book → overlap-reject → maintenance → audit)

**If time gets tight, cut in this order:** Reports/Analytics visuals → Email notifications → QR codes/photo
uploads → Recurring bookings → Bulk allocation. Never cut the allocation-conflict or booking-overlap logic —
those are the features that most directly prove the business rules work.
