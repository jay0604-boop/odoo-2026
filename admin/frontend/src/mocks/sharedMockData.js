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
      { tag: "AF-0021", name: "Conference Room A Projector" },
      { tag: "AF-0044", name: "Delivery Van (White)" }
    ],
    idle: [
      { tag: "AF-0301", name: "Sony A6400 Camera", days: 62 },
      { tag: "AF-0118", name: "Standing Desk Frame", days: 45 }
    ],
    nearingRetirement: [
      { tag: "AF-0005", name: "Old ThinkPad T480", reason: "End of Lifecycle" },
      { tag: "AF-0014", name: "Herman Miller Chair", reason: "Due for Maintenance" }
    ]
  },
  logs: [
    { id: 1, type: "Approvals", message: "Laptop AF-0014 assigned to Priya Shah", time: "2m ago", severity: "info" },
    { id: 2, type: "Approvals", message: "Maintenance request AF-0055 approved", time: "18m ago", severity: "info" },
    { id: 3, type: "Bookings", message: "Booking confirmed : Room B2 : 2:00 to 3:00 PM", time: "1h ago", severity: "info" },
    { id: 4, type: "Approvals", message: "Transfer approved : AF-0033 to facilities dept", time: "3h ago", severity: "info" },
    { id: 5, type: "Alerts", message: "Overdue return : AF-0021 was due 3 days ago", time: "1d ago", severity: "warning" },
    { id: 6, type: "Alerts", message: "Audit discrepancy flagged : AF-0088 damaged", time: "2d ago", severity: "error" }
  ]
};
