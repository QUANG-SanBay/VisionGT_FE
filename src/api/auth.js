import axios from "axios";

const API_URL = "http://localhost:5173/api"; // hoặc 3000, 5000

export const loginApi = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const registerApi = (data) => {
  return axios.post(`${API_URL}/register`, data);
};
