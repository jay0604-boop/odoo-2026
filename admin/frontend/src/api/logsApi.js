import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const logsApi = {
  getLogs: async (filter = "All") => {
    await delay();
    if (filter === "All") return mockData.logs;
    return mockData.logs.filter(log => log.type === filter);
  }
};
