import axiosClient from './client/axios';

const profileApi = {
    // Lấy thông tin profile
    getProfile: () => {
        return axiosClient.get('/profile/');
    },

    // Cập nhật profile
    updateProfile: (data) => {
        return axiosClient.put('/change-profile/', data);
    },

    // Đổi mật khẩu
    changePassword: (data) => {
        return axiosClient.put('/change-password/', data);
    }
};

export default profileApi;
