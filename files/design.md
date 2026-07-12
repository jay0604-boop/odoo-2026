# AssetFlow — Design Layout & Component Specs

## 1. Universal Interface Archetype

**Design System:** Functional, high-visibility layout using a modern smart-casual palette.

| Token | Role | Suggested Hex |
|---|---|---|
| Beige | Page background | `#F2ECE1` |
| Cream | Canvas / card surface | `#FFFDF7` |
| Charcoal | Primary text | `#2B2B2B` |
| Navy | Primary actions / links / active nav | `#1E3A5F` |
| Sage Green | Success / safe / "Available" status | `#8FAE7D` |
| Amber (supporting) | Warning / "Under Maintenance", "Pending" states | `#D9A441` |
| Rust/Red (supporting) | Danger / "Overdue", "Lost", conflict states | `#B5493C` |
| Slate Gray (supporting) | Disabled / "Retired", "Disposed" states | `#8A8F98` |

**Typography:** A clean, functional sans-serif (e.g., Inter or IBM Plex Sans) — Charcoal body text on
Cream/Beige surfaces for high readability. Headings in Navy or Charcoal, medium weight, no decorative
fonts — this is an operational tool, not a marketing site.

**Layout principles:**
- Left-side persistent navigation rail (role-aware — only shows screens the current role can access)
- Cream cards floating on the Beige page background, subtle shadow, rounded corners (8px)
- Status is always communicated by color + text label together (never color alone, for accessibility)
- Consistent status color mapping across every screen:
  - Available / Verified / Approved / Completed → Sage Green
  - Allocated / Reserved / In Progress / Ongoing → Navy
  - Under Maintenance / Pending / Upcoming → Amber
  - Overdue / Missing / Damaged / Rejected / Lost → Rust
  - Retired / Disposed / Inactive / Cancelled → Slate Gray

**Dashboard Layout:** Multi-card layout showcasing high-level operational statistics.
- *KPI Block Row:* `Assets Available`, `Assets Allocated`, `Maintenance Today`, `Active Bookings`,
  `Pending Transfers`, `Upcoming Returns` — six equal-width cards, Navy accent numerals, Charcoal labels.
- *Urgent Section Block:* Separated table grid specifically highlighting **Overdue Returns** (past
  `Expected Return Date`) — this block gets a Rust left-border accent to visually separate it from
  routine KPIs, and sits directly below the KPI row so it can't be missed.
- *Quick Actions:* Three prominent Navy buttons — Register Asset, Book Resource, Raise Maintenance
  Request — pinned top-right of the dashboard.

---

## 2. Core UI Screens & Layout Design

### Screen 1: Access Portal (Login / Registration)
**Purpose:** Authenticate users with realistic, non-self-elevating account creation.
- **Crucial Rule:** Registration collects only Name, Email, Password. The UI explicitly hides all role
  designation controls — there is no dropdown, checkbox, or hidden field a user could manipulate to
  self-assign a privileged role.
- Layout: centered Cream card on Beige background, AssetFlow wordmark, tab toggle between Login/Signup.
- Login: Email, Password, "Forgot password?" link, Navy "Log In" button.
- Signup: Name, Email, Password, Confirm Password, Navy "Create Account" button — resulting account is
  always Employee-role by default, server-enforced (not just UI-hidden).
- Session validation redirects unauthenticated users back to this screen from any deep link.

### Screen 2: Dashboard / Home Screen
**Purpose:** Give every role a real-time operational snapshot.
- KPI cards row (see Section 1) — values scoped to the logged-in role (Admin/Asset Manager see
  org-wide; Department Head sees their department; Employee sees personal allocations/bookings).
- Overdue Returns table: Asset, Holder, Expected Return Date, Days Overdue — sorted by most overdue first.
- Quick Actions row.
- Recent Activity feed (mini version of the Activity Log) in a sidebar card.

### Screen 3: Corporate Control Console (Admin Only)
**Layout:** 3-tab container system.

**Tab A — Department Management**
- Table: Name, Head, Parent Department, Employee Count, Status.
- "+ New Department" opens a side-drawer form: Name, Head (searchable employee picker), Parent
  Department (optional, nested dropdown), Status toggle.
- Deactivating a department greys out its row (Slate Gray) rather than deleting it.

**Tab B — Asset Categories Mapping**
- Table: Category Name, # Assets, Custom Fields, Status.
- "+ New Category" form: Name + a dynamic "Add Custom Field" builder (field name, type, e.g. warranty
  period for Electronics).

**Tab C — Master Employee Matrix**
- Table: Name, Email, Department, Role (badge-styled: Admin=Navy, Asset Manager=Sage, Department
  Head=Amber, Employee=Slate), Status.
- Row action: "Promote" opens a modal with a role selector (Department Head / Asset Manager only —
  Admin promotion is not exposed here to avoid privilege sprawl). This is the **only** place in the
  entire app where role changes happen.

### Screen 4: Asset Registration & Directory
**Purpose:** Register assets and search/track them centrally.
- Top bar: search input + filter chips (Category, Status, Department, Location) + "+ Register Asset" button.
- Grid/list toggle view of assets, each card/row showing: Asset Tag (monospace, Navy), Name, Category
  icon, Status badge (color-mapped per Section 1), Location, thumbnail photo if present.
- "Register Asset" opens a form: Name, Category (dropdown from Screen 3B), auto-filled Asset Tag
  (read-only, e.g. `AF-0114`), Serial Number, Acquisition Date, Acquisition Cost, Condition (dropdown:
  New/Good/Fair/Poor), Location, photo/document upload, "Shared/bookable" toggle.
- Asset Detail page (on row click): header with tag/name/status, tabbed sub-sections — Overview,
  Allocation History, Maintenance History — each rendered as a vertical timeline.

### Screen 5: Asset Allocation & Transfer
**Purpose:** Manage who holds what, with explicit conflict rules.
- Two-panel layout: left = asset picker/search, right = allocation action panel.
- Allocate form: Holder type toggle (Employee / Department), holder picker, optional Expected Return Date.
- **Conflict state:** if the asset is already allocated, the Allocate button is replaced by a Rust-bordered
  alert card: *"Currently held by Priya (Dept: Engineering) — Allocated on [date]"* with a single Navy
  "Request Transfer" button in place of Allocate.
- Transfer Request tracker: Kanban-style columns — Requested / Approved / Re-allocated — cards show
  asset, from-holder, to-holder, requester.
- Return flow: "Mark as Returned" opens a modal for condition check-in notes (dropdown + free text),
  then flips asset status to Available (Sage badge) automatically.
- Overdue allocations get a Rust "Overdue" tag inline in the asset picker list.

### Screen 6: Resource Booking
**Purpose:** Time-slot booking of shared resources with no overlaps.
- Left: resource list (only assets flagged "shared/bookable").
- Right: weekly calendar grid for the selected resource — existing bookings shown as Navy blocks.
- "+ Book" opens a time-slot picker; on submit, overlapping requests are rejected inline with a Rust
  toast: *"Conflicts with existing booking 9:00–10:00 — choose a different slot."*
- Booking status badges: Upcoming (Amber), Ongoing (Navy), Completed (Sage), Cancelled (Slate).
- Each booking card has Cancel/Reschedule actions (only visible to the booker or a Department
  Head/Admin).

### Screen 7: Maintenance Management
**Purpose:** Route repairs through approval before work starts.
- List view grouped by status columns (Kanban): Pending / Approved / Technician Assigned / In
  Progress / Resolved (Rejected shown as a collapsed/filterable column).
- "Raise Request" form: Asset picker, Issue description, Priority (Low/Medium/High/Critical — color
  dot), photo attachment.
- Approve/Reject buttons visible only to Asset Manager role on Pending cards; approving a request
  auto-flips the linked asset's status to "Under Maintenance" (Amber) elsewhere in the app.
- Resolving a request auto-reverts asset status to Available and closes the card into history.
- Per-asset Maintenance History tab (see Screen 4) pulls from this same data.

### Screen 8: Asset Audit
**Purpose:** Run structured verification cycles instead of a single form.
- "Create Audit Cycle" form: Scope (Department/Location picker), Date Range, Auditor multi-select.
- Active cycle view: checklist of in-scope assets, each with a 3-way toggle — Verified (Sage) / Missing
  (Rust) / Damaged (Amber) — plus a notes field.
- Live discrepancy counter in the cycle header as auditors mark items.
- "Close Audit Cycle" button (Admin/Asset Manager only) — triggers a confirmation modal warning it
  will lock the cycle and update statuses (confirmed-missing → Lost), then generates the Discrepancy
  Report automatically.
- Audit history list: past cycles with scope, date range, auditors, and a link to their locked
  discrepancy reports.

### Screen 9: Reports & Analytics
**Purpose:** Give managers actionable operational insight.
- Filter bar: Department, Date Range, Category.
- Card grid of visualizations:
  - Asset utilization trend (line chart, most-used vs idle)
  - Maintenance frequency by category (bar chart)
  - Assets due for maintenance/retirement (table with countdown)
  - Department-wise allocation summary (stacked bar)
  - Resource booking heatmap (calendar heatmap, peak windows in Navy intensity gradient)
- "Export" button (CSV/PDF) top-right of each card.

### Screen 10: Activity Logs & Notifications
**Purpose:** Keep every role informed without digging for updates.
- Two-tab layout: **Notifications** (per-user feed, unread = bold with Navy dot) and **Activity Log**
  (organization-wide audit trail, Admin/Asset Manager visibility).
- Notification row: icon (mapped to type), message, timestamp, "Mark as read."
  Types: Asset Assigned, Maintenance Approved/Rejected, Booking Confirmed/Cancelled/Reminder, Transfer
  Approved, Overdue Return Alert, Audit Discrepancy Flagged.
- Activity Log row: Actor, Action verb, Entity affected, Timestamp — filterable by actor, entity type,
  and date range; read-only, no delete/edit (this is the immutable audit trail).

---

## 3. Navigation Structure

```
Sidebar (role-aware):
├── Dashboard                (all roles)
├── Organization Setup       (Admin only)
├── Assets                   (all roles — scoped by permission)
├── Allocation & Transfer    (Asset Manager, Dept Head, Employee-view)
├── Resource Booking         (all roles)
├── Maintenance              (all roles — Employee raises, Asset Manager approves)
├── Audits                   (Admin, Asset Manager)
├── Reports                  (Admin, Asset Manager, Dept Head)
└── Notifications & Logs     (all roles — Activity Log tab restricted to Admin/Asset Manager)
```

## 4. Component Notes

- **Status badges:** consistent pill shape, colored fill at 15% opacity with full-opacity text/border
  in the matching token color — keeps the palette calm across dense tables.
- **Empty states:** every list/table gets a friendly empty state with a single primary CTA (e.g., "No
  assets yet — Register your first asset").
- **Confirmation modals:** any irreversible or workflow-gating action (Close Audit Cycle, Reject
  Maintenance, Cancel Booking) requires a confirm modal — no destructive one-click actions.
