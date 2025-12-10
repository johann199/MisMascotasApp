const mockStorage = {};

export default {
  setItem: jest.fn((key, value) => {
    return new Promise((resolve) => {
      mockStorage[key] = value;
      resolve(null);
    });
  }),
  getItem: jest.fn((key) => {
    return new Promise((resolve) => {
      resolve(mockStorage[key] || null);
    });
  }),
  removeItem: jest.fn((key) => {
    return new Promise((resolve) => {
      delete mockStorage[key];
      resolve(null);
    });
  }),
  clear: jest.fn(() => {
    return new Promise((resolve) => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
      resolve(null);
    });
  }),
  getAllKeys: jest.fn(() => {
    return new Promise((resolve) => {
      resolve(Object.keys(mockStorage));
    });
  }),
  multiGet: jest.fn((keys) => {
    return new Promise((resolve) => {
      const result = keys.map(key => [key, mockStorage[key] || null]);
      resolve(result);
    });
  }),
  multiSet: jest.fn((keyValuePairs) => {
    return new Promise((resolve) => {
      keyValuePairs.forEach(([key, value]) => {
        mockStorage[key] = value;
      });
      resolve(null);
    });
  }),
  multiRemove: jest.fn((keys) => {
    return new Promise((resolve) => {
      keys.forEach(key => delete mockStorage[key]);
      resolve(null);
    });
  }),
  // Metodo para testing
  __resetMockStorage: () => {
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  }
};
