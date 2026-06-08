// frontend/lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

const fetchAPI = async (endpoint, options = {}) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || "Terjadi kesalahan");
  }
  
  return data;
};

// ============= USER ENDPOINTS =============
export const getUserReportsWithFilter = async (status = "Semua", search = "") => {
  const params = new URLSearchParams();
  if (status && status !== "Semua") params.append("status", status);
  if (search) params.append("search", search);
  
  const endpoint = `/reports/my/filter${params.toString() ? `?${params.toString()}` : ""}`;
  return await fetchAPI(endpoint);
};

export const getUserStats = async () => {
  return await fetchAPI("/reports/my/stats");
};

export const getReportDetail = async (id) => {
  return await fetchAPI(`/reports/${id}`);
};

export const createReport = async (formData) => {
  const token = getToken();
  
  const response = await fetch(`${API_BASE}/reports`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Gagal membuat laporan");
  }
  return data;
};

export const addComment = async (reportId, isi) => {
  return await fetchAPI(`/reports/${reportId}/comments`, {
    method: "POST",
    body: JSON.stringify({ isi }),
  });
};

// ============= ADMIN ENDPOINTS =============
export const getAllReports = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  return await fetchAPI(`/reports/admin/all?${params.toString()}`);
};

export const getDashboardStats = async () => {
  return await fetchAPI("/reports/admin/dashboard-stats");
};

export const updateReportStatus = async (id, status, admin_notes) => {
  return await fetchAPI(`/reports/admin/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, admin_notes }),
  });
};

export const deleteReport = async (id) => {
  return await fetchAPI(`/reports/admin/${id}`, {
    method: "DELETE",
  });
};

// ============= USER MANAGEMENT =============
export const getAllUsers = async () => {
  return await fetchAPI("/users");
};

export const createUser = async (userData) => {
  return await fetchAPI("/users", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUserStatus = async (id, status) => {
  return await fetchAPI(`/users/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
};

export const deleteUser = async (id) => {
  return await fetchAPI(`/users/${id}`, {
    method: "DELETE",
  });
};