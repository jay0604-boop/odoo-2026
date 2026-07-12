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
  assets: [],
  auditCycles: [],
  maintenanceRequests: [
    { id: 1, assetTag: "AF-0062", assetName: "Dell XPS 15", issue: "Screen flickering randomly", priority: "High", status: "Pending", requester: "Alice Smith" },
    { id: 2, assetTag: "AF-0014", assetName: "Herman Miller Chair", issue: "Broken armrest", priority: "Low", status: "In Progress", requester: "Charlie Brown" },
    { id: 3, assetTag: "AF-0088", assetName: "Ford Transit Van", issue: "Check engine light", priority: "Critical", status: "Approved", requester: "Bob Jones" }
  ]
};
