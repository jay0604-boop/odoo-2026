import { mockData } from "../mocks/sharedMockData";

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const inventoryApi = {
  getAssets: async () => {
    await delay();
    return [...mockData.assets];
  },
  
  registerAsset: async (formData, config) => {
    // Note: config header is passed to simulate the 'Content-Type': 'multipart/form-data'
    await delay();
    const tagCounter = mockData.assets.length + 1;
    const newTag = `AF-${String(tagCounter).padStart(4, '0')}`;
    
    // Extract values from FormData
    const newAsset = {
      id: Date.now(),
      tag: newTag,
      name: formData.get("name"),
      category: formData.get("category"),
      location: formData.get("location"),
      status: "Available",
      holder: "-",
      photo_url: formData.has("image") ? `/static/uploads/mock_asset_${Date.now()}.png` : null
    };
    
    mockData.assets.push(newAsset);
    return newAsset;
  },

  getCategories: async () => {
    await delay(100);
    return [...mockData.categories.map(c => c.name)];
  },
  
  getDepartments: async () => {
    await delay(100);
    return [...mockData.departments.map(d => d.name)];
  }
};
