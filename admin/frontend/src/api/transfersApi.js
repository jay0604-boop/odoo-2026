import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const transfersApi = {
  getRequests: async () => {
    await delay();
    return mockData.transfers.filter(t => t.status === "Pending");
  },
  
  approveTransfer: async (id) => {
    await delay();
    const req = mockData.transfers.find(t => t.id === id);
    if (req) req.status = "Approved";
    return true;
  },

  rejectTransfer: async (id) => {
    await delay();
    const req = mockData.transfers.find(t => t.id === id);
    if (req) req.status = "Rejected";
    return true;
  }
};
