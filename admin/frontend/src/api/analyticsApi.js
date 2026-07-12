import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const analyticsApi = {
  getDashboardData: async () => {
    await delay();
    return mockData.analytics;
  }
};
