import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const maintenanceApi = {
  getRequests: async () => {
    await delay();
    return [...mockData.maintenanceRequests];
  },
  updateStatus: async (id, newStatus) => {
    await delay();
    const req = mockData.maintenanceRequests.find(r => r.id === id);
    if (req) {
      req.status = newStatus;
    }
    return req;
  },
  
  uploadRepairPhoto: async (formData, config) => {
    await delay(500);
    // Simulate processing the binary file data attached to the request
    // formData.get('requestId') and formData.get('photo')
    return { success: true };
  }
};
