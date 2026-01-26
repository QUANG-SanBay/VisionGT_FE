import axiosClient from './client/axios';

const trafficSignApi = {
    // Lấy danh sách biển báo (Admin)
    getAllSigns: (params) => {
        return axiosClient.get('/traffic-signs/', { params });
    },
    
    // Xem chi tiết biển báo (Admin)
    getSignDetail: (signCode) => {
        return axiosClient.get(`/traffic-signs/${signCode}/`);
    },
    
    // Tạo biển báo mới (Admin)
    createSign: (data) => {
        return axiosClient.post('/traffic-signs/', data);
    },
    
    // Cập nhật biển báo (Admin)
    updateSign: (signCode, data) => {
        return axiosClient.put(`/traffic-signs/${signCode}/`, data);
    },
    
    // Cập nhật một phần biển báo (Admin)
    partialUpdateSign: (signCode, data) => {
        return axiosClient.patch(`/traffic-signs/${signCode}/`, data);
    },
    
    // Xóa biển báo (Admin)
    deleteSign: (signCode) => {
        return axiosClient.delete(`/traffic-signs/${signCode}/`);
    },
    
    // Tìm kiếm biển báo (Admin)
    searchSigns: (keyword) => {
        return axiosClient.get('/traffic-signs/search/', { params: { q: keyword } });
    }
};

export default trafficSignApi;
