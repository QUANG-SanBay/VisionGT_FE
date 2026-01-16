import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/dashboard/users/";

export const getUsers = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

export const createUser = async (data) => {
  const res = await axios.post(API_URL, {
    email: data.email,
    input_full_name: data.full_name,
    password: data.password,
    password2: data.password2,
  });
  return res.data;
};

export const getUserById = async (id) => {
  const res = await axios.get(`${API_URL}${id}/`);
  return res.data;
};

export const updateUser = async (id, data) => {
  const res = await axios.put(`${API_URL}${id}/`, data);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await axios.delete(`${API_URL}${id}/`);
  return res.data;
};

export const activateUser = async (id) => {
  const res = await axios.post(`${API_URL}${id}/activate/`);
  return res.data;
};

export const deactivateUser = async (id) => {
  const res = await axios.post(`${API_URL}${id}/deactivate/`);
  return res.data;
};
