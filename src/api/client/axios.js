import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:8000/api', // Đường dẫn tới Server Django 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bạn cần đảm bảo có dòng này:
export default axiosClient;