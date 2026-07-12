import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const auditsApi = {
  getActiveCycle: async () => {
    await delay();
    const activeCycle = mockData.auditCycles.find(c => c.status === "Active");
    if (!activeCycle) return null;
    
    return {
      ...activeCycle,
      assetsToAudit: activeCycle.assetsToAudit.map(item => {
        const assetInfo = mockData.assets.find(a => a.id === item.assetId);
        return { ...item, assetDetails: assetInfo };
      })
    };
  },
  
  updateVerificationState: async (cycleId, assetId, state) => {
    await delay(100);
    const cycle = mockData.auditCycles.find(c => c.id === cycleId);
    if (cycle) {
      const target = cycle.assetsToAudit.find(a => a.assetId === assetId);
      if (target) {
        target.verificationState = state;
      }
    }
  },

  closeCycle: async (cycleId, finalResults) => {
    await delay();
    const cycle = mockData.auditCycles.find(c => c.id === cycleId);
    if (cycle) {
      cycle.status = "Closed";
      
      finalResults.forEach(result => {
        const asset = mockData.assets.find(a => a.id === result.assetId);
        if (asset) {
          if (result.verificationState === "Missing") asset.status = "Lost";
          if (result.verificationState === "Damaged") asset.status = "Under Maintenance";
        }
      });
    }
    return true;
  }
};
