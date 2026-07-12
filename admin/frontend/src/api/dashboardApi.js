import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const dashboardApi = {
  getKpis: async () => {
    await delay();
    const assets = mockData.assets || [];
    
    const available = assets.filter(a => a.status === "Available").length;
    const allocated = assets.filter(a => a.status === "Allocated").length;
    const maintenance = assets.filter(a => a.status === "Under Maintenance").length;
    
    return {
      available,
      allocated,
      maintenance,
      activeBookings: 12, 
      pendingTransfers: 4, 
      upcomingReturns: 7 
    };
  },
  
  getOverdueReturns: async () => {
    await delay();
    return [
      { id: 101, tag: "AF-0012", name: "Sony A7S III Camera", expectedReturn: "2026-07-10", holder: "David Lee", department: "Marketing", daysOverdue: 2 },
      { id: 102, tag: "AF-0045", name: "MacBook Pro M3", expectedReturn: "2026-07-05", holder: "Sarah Connor", department: "Engineering", daysOverdue: 7 }
    ];
  }
};
