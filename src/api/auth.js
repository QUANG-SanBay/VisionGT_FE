import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

// API đăng nhập - trả về access token và refresh token
export const loginApi = (data) => {
  return axios.post(`${API_URL}/token/`, data);
};

// API đăng ký
export const registerApi = (data) => {
  return axios.post(`${API_URL}/register/`, data);
};

// Lưu tokens vào localStorage
export const saveTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

// Lấy access token
export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

// Lấy refresh token
export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

// Xóa tokens (logout)
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Kiểm tra đã đăng nhập chưa
export const isAuthenticated = () => {
  return !!getAccessToken();
};
