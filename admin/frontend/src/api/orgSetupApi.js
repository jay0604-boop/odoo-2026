import { mockData } from "../mocks/sharedMockData";

// Simulate network delay for REST contracts
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const orgSetupApi = {
  getDepartments: async () => {
    await delay();
    return [...mockData.departments];
  },
  addDepartment: async (dept) => {
    await delay();
    const newDept = { ...dept, id: Date.now(), status: "Active" };
    mockData.departments.push(newDept);
    return newDept;
  },
  getCategories: async () => {
    await delay();
    return [...mockData.categories];
  },
  addCategory: async (category) => {
    await delay();
    const newCategory = { ...category, id: Date.now(), assetCount: 0, status: "Active" };
    mockData.categories.push(newCategory);
    return newCategory;
  },
  getEmployees: async () => {
    await delay();
    return [...mockData.employees];
  },
  promoteEmployee: async (id, newRole) => {
    await delay();
    const emp = mockData.employees.find(e => e.id === id);
    if (emp) emp.role = newRole;
    return emp;
  }
};
