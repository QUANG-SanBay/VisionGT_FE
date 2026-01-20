import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/recognition/history/";

export const getHistory = () => {
  return axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
