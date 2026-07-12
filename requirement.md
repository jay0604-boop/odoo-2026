# AssetFlow - Requirement Specification

## 1. System Vision & Objective
AssetFlow acts as a multi-role ERP portal designed to digitalize physical asset lifecycles and shared resource distributions. The scope excludes purchasing, procurement, accounting, and billing, focusing strictly on operational visibility, conflict-free state changes, and accountability.

## 2. Target Roles & Access Hierarchy
* **Employee (Base Role):** Self-allocation viewing, individual resource scheduling, opening maintenance requests, initiating returns or out-of-department transfers.
* **Department Head:** Inherits Employee rights. Views departmental inventories, approves cross-departmental transfers, and books resources on behalf of subordinate staff.
* **Asset Manager:** Registers and allocates assets, acts as final gatekeeper for transfer validations, accepts/evaluates physical asset condition checks upon return, handles maintenance assignments, resolves audit discrepancies.
* **System Admin:** Handles primary master configurations, organizes organizational tier systems, deactivates assets/employees, and serves as the **only** layer capable of assigning roles or elevating user privileges.
