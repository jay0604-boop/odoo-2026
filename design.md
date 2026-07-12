# AssetFlow - Design Layout & Component Specs

## 1. Universal Interface Archetype
* **Design System:** Functional, high-visibility layout using a modern smart-casual palette (Beige backgrounds, Cream canvas elements, Charcoal text, Navy blue primary controls, Sage green success/safe indicators).
* **Dashboard Layout:** Multi-card layout showcasing high-level operational statistics metrics.
    * *KPI Block Row:* Displays `Assets Available`, `Assets Allocated`, `Maintenance Today`, `Active Bookings`, `Pending Transfers`, `Upcoming Returns`.
    * *Urgent Section Block:* Separated table grid specifically highlighting **Overdue Returns** (items past their `Expected Return Date`).

## 2. Core UI Screens & Layout Design
### Screen 1: Access Portal (Login / Registration)
* **Crucial Rule:** Registration handles basic collection details only (Name, Email, Password). The UI explicitly hides all role designation dropdowns to prevent malicious privilege escalation.

### Screen 3: Corporate Control Console (Admin Only)
* **Layout:** 3-Tab container system (Department Management, Asset Categories Mapping, Master Employee Matrix). Admin promotes an Employee to Department Head or Asset Manager strictly from the Employee Directory tab.
