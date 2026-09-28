/**
 * HousePredict API Configuration & Service Stubs
 * Prepared for upcoming backend integration (FastAPI / Node / Express / MongoDB)
 */

// Configurable API Base URL via Vite environment variables with fallback
export const API_BASE_URL =
  (typeof import.meta !== "undefined" &&
    import.meta.env &&
    (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL)) ||
  "http://localhost:5000";

// Standard HTTP Headers helper
export const getDefaultHeaders = () => {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Generic API Client Placeholder
export const apiClient = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  // Actual request execution will be attached upon backend connection
  console.log(`[API Stub] ${options.method || "GET"} -> ${url}`);
  return Promise.resolve({ success: true, message: "Stub response" });
};

// 1. Authentication Services Stubs
export const authService = {
  login: async (credentials) => {
    console.log("[AuthService] login called with:", credentials);
    return Promise.resolve({ user: null, token: null });
  },
  register: async (userData) => {
    console.log("[AuthService] register called with:", userData);
    return Promise.resolve({ user: null, token: null });
  },
  getCurrentUser: async () => {
    console.log("[AuthService] getCurrentUser called");
    return Promise.resolve(null);
  },
  logout: async () => {
    console.log("[AuthService] logout called");
    return Promise.resolve(true);
  },
};

// 2. Prediction Services Stubs
export const predictionService = {
  predictPrice: async (propertyFeatures) => {
    console.log("[PredictionService] predictPrice called with features:", propertyFeatures);
    return Promise.resolve({
      predictedPrice: null,
      confidence: null,
      range: null,
    });
  },
  getHistory: async (params = {}) => {
    console.log("[PredictionService] getHistory called with params:", params);
    return Promise.resolve({ predictions: [], total: 0 });
  },
  getPredictionById: async (id) => {
    console.log("[PredictionService] getPredictionById called for ID:", id);
    return Promise.resolve(null);
  },
  savePrediction: async (id) => {
    console.log("[PredictionService] savePrediction called for ID:", id);
    return Promise.resolve(true);
  },
  deletePrediction: async (id) => {
    console.log("[PredictionService] deletePrediction called for ID:", id);
    return Promise.resolve(true);
  },
};

// 3. User & Admin Services Stubs
export const userService = {
  getProfile: async () => {
    console.log("[UserService] getProfile called");
    return Promise.resolve(null);
  },
  updateProfile: async (data) => {
    console.log("[UserService] updateProfile called with:", data);
    return Promise.resolve(data);
  },
  changePassword: async (passwords) => {
    console.log("[UserService] changePassword called with:", passwords);
    return Promise.resolve(true);
  },
  deleteAccount: async () => {
    console.log("[UserService] deleteAccount called");
    return Promise.resolve(true);
  },
};

export const adminService = {
  getDashboardStats: async () => {
    console.log("[AdminService] getDashboardStats called");
    return Promise.resolve({
      totalUsers: 0,
      totalPredictions: 0,
      activeUsers: 0,
      systemHealth: "OK",
    });
  },
  getAllUsers: async () => {
    console.log("[AdminService] getAllUsers called");
    return Promise.resolve([]);
  },
  getModelInfo: async () => {
    console.log("[AdminService] getModelInfo called");
    return Promise.resolve({});
  },
};

export default {
  API_BASE_URL,
  getDefaultHeaders,
  apiClient,
  authService,
  predictionService,
  userService,
  adminService,
};
