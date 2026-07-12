export const mockData = {
  departments: [
    { id: 1, name: "Engineering", head: "Alice Smith", parent: "-", status: "Active" },
    { id: 2, name: "HR", head: "Bob Jones", parent: "-", status: "Active" }
  ],
  categories: [
    { id: 1, name: "Electronics", assetCount: 45, status: "Active", customFields: [{ id: 1, name: "Warranty", type: "text" }] },
    { id: 2, name: "Furniture", assetCount: 120, status: "Active", customFields: [] }
  ],
  employees: [
    { id: 1, name: "Alice Smith", email: "alice@example.com", department: "Engineering", role: "Department Head", status: "Active" },
    { id: 2, name: "Bob Jones", email: "bob@example.com", department: "HR", role: "Employee", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", department: "Engineering", role: "Employee", status: "Active" }
  ],
  assets: [
    { id: 1, tag: "AF-0062", name: "Dell XPS 15", category: "Electronics", location: "Engineering Floor 3", status: "Allocated", holder: "Alice Smith" },
    { id: 2, tag: "AF-0014", name: "Herman Miller Chair", category: "Furniture", location: "HR Office 1", status: "Allocated", holder: "Bob Jones" },
    { id: 3, tag: "AF-0088", name: "Ford Transit Van", category: "Vehicles", location: "Basement Parking", status: "Available", holder: "-" },
    { id: 4, tag: "AF-0102", name: "iPad Pro", category: "Electronics", location: "Engineering Floor 3", status: "Available", holder: "-" }
  ],
  auditCycles: [
    { 
      id: 1, 
      name: "Q3 Audit: Engineering Dept", 
      dateRange: "1-15 Jul", 
      auditors: "A. Rao, S. Iqbal", 
      status: "Active",
      assetsToAudit: [
        { assetId: 1, verificationState: null, notes: "" },
        { assetId: 4, verificationState: null, notes: "" }
      ]
    }
  ],
  maintenanceRequests: [
    { id: 1, assetTag: "AF-0062", assetName: "Dell XPS 15", issue: "Screen flickering randomly", priority: "High", status: "Pending", requester: "Alice Smith" },
    { id: 2, assetTag: "AF-0014", assetName: "Herman Miller Chair", issue: "Broken armrest", priority: "Low", status: "In Progress", requester: "Charlie Brown" },
    { id: 3, assetTag: "AF-0088", assetName: "Ford Transit Van", issue: "Check engine light", priority: "Critical", status: "Approved", requester: "Bob Jones" }
  ],
  transfers: [
    { id: 1, assetTag: "AF-0114", assetName: "Dell Laptop", from: "Alice Smith", to: "David Lee", reason: "Project Reassignment", dateRequested: "2026-07-10", status: "Pending", hasConflict: true },
    { id: 2, assetTag: "AF-0012", assetName: "Sony A7S III Camera", from: "Bob Jones", to: "Sarah Connor", reason: "Marketing Event", dateRequested: "2026-07-11", status: "Pending", hasConflict: false }
  ],
  analytics: {
    utilization: [
      { department: "Engineering", high: 45, idle: 5 },
      { department: "Marketing", high: 20, idle: 15 },
      { department: "Sales", high: 35, idle: 2 },
      { department: "HR", high: 8, idle: 4 }
    ],
    maintenanceFreq: [
      { month: "Jan", count: 12 }, { month: "Feb", count: 15 }, { month: "Mar", count: 8 }, { month: "Apr", count: 22 }, { month: "May", count: 18 }, { month: "Jun", count: 25 }
    ],
    mostUsed: [
      { tag: "Room B2", name: "34 bookings this month" },
      { tag: "AF-343", name: "Van - 21 trips this month" },
      { tag: "AF-335", name: "Projector - 18 uses" }
    ],
    idle: [
      { tag: "AF-0301", name: "Camera", days: "60+" },
      { tag: "AF-0410", name: "chair", days: "45" }
    ],
    nearingRetirement: [
      { tag: "AF-0089", name: "Forklift", reason: "service due in 5 days" },
      { tag: "AF-0020", name: "Laptop", reason: "4 years old : nearing retirement" }
    ]
  },
  logs: [
    { id: 1, type: "Approvals", message: "Laptop AF-0014 assigned to Priya Shah", time: "2m ago", severity: "info" },
    { id: 2, type: "Approvals", message: "Maintenance request AF-0055 approved", time: "18m ago", severity: "info" },
    { id: 3, type: "Bookings", message: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", time: "1h ago", severity: "info" },
    { id: 4, type: "Approvals", message: "Transfer approved : AF-0033 to facilities dept", time: "3h ago", severity: "info" },
    { id: 5, type: "Alerts", message: "Overdue return : AF-0021 was due 3 days ago", time: "1d ago", severity: "warning" },
    { id: 6, type: "Alerts", message: "Audit discrepancy flagged : AF-0088 damaged", time: "2d ago", severity: "error" }
  ],
  bookings: [
    { id: 1, resource: "Conference Room B2", type: "Room", requester: "Alice Smith", date: "2026-07-12", startTime: "10:00 AM", endTime: "11:30 AM", status: "Completed" },
    { id: 2, resource: "Ford Transit Van (AF-0088)", type: "Vehicle", requester: "Bob Jones", date: "2026-07-12", startTime: "01:00 PM", endTime: "04:00 PM", status: "Ongoing" },
    { id: 3, resource: "Epson Projector Pro", type: "Equipment", requester: "Charlie Brown", date: "2026-07-13", startTime: "09:00 AM", endTime: "05:00 PM", status: "Upcoming" },
    { id: 4, resource: "Conference Room A1", type: "Room", requester: "David Lee", date: "2026-07-13", startTime: "02:00 PM", endTime: "03:00 PM", status: "Cancelled" }
  ],
  employees: [
    { id: 1, name: "Alice Smith", email: "alice@company.com", department: "Engineering", role: "Admin", status: "Active" },
    { id: 2, name: "Bob Jones", email: "bob@company.com", department: "Facilities", role: "Asset Manager", status: "Active" },
    { id: 3, name: "Charlie Brown", email: "charlie@company.com", department: "IT Support", role: "Employee", status: "Active" },
    { id: 4, name: "David Lee", email: "david@company.com", department: "Engineering", role: "Department Head", status: "Active" },
    { id: 5, name: "Eve Davis", email: "eve@company.com", department: "HR", role: "Employee", status: "Inactive" }
  ],
  departments: [
    { id: 1, name: "Engineering", head: "David Lee", parent: "None", status: "Active", assetCount: 142 },
    { id: 2, name: "IT Support", head: "Unassigned", parent: "Engineering", status: "Active", assetCount: 35 },
    { id: 3, name: "Facilities", head: "Unassigned", parent: "None", status: "Active", assetCount: 88 },
    { id: 4, name: "HR", head: "Sarah Connor", parent: "None", status: "Active", assetCount: 12 }
  ],
  categories: [
    { id: 1, name: "Laptop", prefix: "LT", customFields: ["Processor", "RAM", "Storage"], bookable: false },
    { id: 2, name: "Vehicle", prefix: "VH", customFields: ["License Plate", "Mileage"], bookable: true },
    { id: 3, name: "Meeting Room", prefix: "RM", customFields: ["Capacity", "Has Projector"], bookable: true },
    { id: 4, name: "Peripherals", prefix: "PR", customFields: ["Connector Type"], bookable: false }
  ],
  auditCycles: [
    { id: 1, title: "Q3 Engineering Hardware Audit", scope: "Engineering", startDate: "2026-07-01", endDate: "2026-07-15", auditors: ["Bob Jones"], status: "Ongoing", totalAssets: 142, verifiedCount: 130 },
    { id: 2, title: "Annual IT Inventory Check", scope: "IT Support", startDate: "2026-01-10", endDate: "2026-01-20", auditors: ["Alice Smith"], status: "Closed", totalAssets: 35, verifiedCount: 34 }
  ],
  auditFindings: [
    { id: 1, cycleId: 1, assetTag: "AF-0012", assetName: "Dell XPS 15", expectedLocation: "Desk 4A", status: "Verified" },
    { id: 2, cycleId: 1, assetTag: "AF-0015", assetName: "MacBook Pro M3", expectedLocation: "Desk 4B", status: "Missing" },
    { id: 3, cycleId: 1, assetTag: "AF-0088", assetName: "Ford Transit Van", expectedLocation: "Garage A", status: "Damaged" },
    { id: 4, cycleId: 1, assetTag: "AF-0102", assetName: "Logitech MX Master 3", expectedLocation: "Desk 2C", status: "Pending" }
  ],
  activityLogs: [
    { id: 1, timestamp: "2026-07-12T10:42:00Z", actor: "Alice Smith (Admin)", action: "Approved Transfer Request", entity: "Transfer TR-092 (Asset AF-0033)", category: "Allocation" },
    { id: 2, timestamp: "2026-07-12T09:15:00Z", actor: "System", action: "Flagged Overdue Return", entity: "Allocation AL-441 (Asset AF-0021)", category: "Alert" },
    { id: 3, timestamp: "2026-07-11T16:30:00Z", actor: "Bob Jones (Asset Manager)", action: "Assigned Asset", entity: "Asset AF-0115 to Eve Davis", category: "Allocation" },
    { id: 4, timestamp: "2026-07-11T14:20:00Z", actor: "David Lee (Dept Head)", action: "Created Audit Cycle", entity: "Q3 Engineering Hardware Audit", category: "Audit" },
    { id: 5, timestamp: "2026-07-11T11:05:00Z", actor: "Charlie Brown (Employee)", action: "Raised Maintenance Request", entity: "Asset AF-0012 (Screen Flicker)", category: "Maintenance" },
    { id: 6, timestamp: "2026-07-10T15:45:00Z", actor: "Alice Smith (Admin)", action: "Promoted Employee Role", entity: "Bob Jones -> Asset Manager", category: "Security" },
    { id: 7, timestamp: "2026-07-10T09:00:00Z", actor: "System", action: "Cancelled Overlapping Booking", entity: "Booking BK-102 (Conference Room A1)", category: "Booking" }
  ]
};
