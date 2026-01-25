import axiosClient from './client/axios';

const userApi = {
    // Lấy danh sách users
    getAllUsers: () => {
        return axiosClient.get('/dashboard/users/');
    },
    
    // Xem chi tiết user
    getUserDetail: (userId) => {
        return axiosClient.get(`/dashboard/users/${userId}/`);
    },
    
    // Tạo user mới
    createUser: (data) => {
        return axiosClient.post('/dashboard/users/', data);
    },
    
    // Cập nhật user
    updateUser: (userId, data) => {
        return axiosClient.put(`/dashboard/users/${userId}/`, data);
    },
    
    // Xóa user
    deleteUser: (userId) => {
        return axiosClient.delete(`/dashboard/users/${userId}/`);
    },
    
    // Kích hoạt tài khoản
    activateUser: (userId) => {
        return axiosClient.post(`/dashboard/users/${userId}/activate/`);
    },
    
    // Vô hiệu hóa tài khoản
    deactivateUser: (userId) => {
        return axiosClient.post(`/dashboard/users/${userId}/deactivate/`);
    }
};

export default userApi;
