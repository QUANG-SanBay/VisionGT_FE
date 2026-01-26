/*import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Đường dẫn tới Server Django 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Bạn cần đảm bảo có dòng này:
export default axiosClient;*/

import axios from 'axios';

const axiosClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Request interceptor - Tự động thêm token vào mọi request
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Xử lý lỗi 401 (token hết hạn)
axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Nếu lỗi 401 và chưa retry
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                
                if (refreshToken) {
                    // Gọi API refresh token
                    const response = await axios.post(
                        'http://127.0.0.1:8000/api/token/refresh/',
                        { refresh: refreshToken }
                    );

                    const newAccessToken = response.data.access;
                    
                    // Lưu token mới
                    localStorage.setItem('access_token', newAccessToken);
                    
                    // Retry request với token mới
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token hết hạn, xóa tokens và chuyển về login
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;