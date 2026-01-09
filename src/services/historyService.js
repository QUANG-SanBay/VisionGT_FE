import axios from "axios";

const API_URL = "http://localhost:8000/api/history/";

export const getHistory = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
