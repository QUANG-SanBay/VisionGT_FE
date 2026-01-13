import axios from "axios";

const API_URL = "http://localhost:5173/api";


export const loginApi = (data) => {
  return axios.post(`${API_URL}/login`, data);
};

export const registerApi = (data) => {
  return axios.post(`${API_URL}/register`, data);

};
