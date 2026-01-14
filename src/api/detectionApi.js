// Import cái axiosClient mà dự án đã cấu hình sẵn
import axiosClient from './client/axios'; 

const detectionApi = {
    /**
     * 1. Upload file (ảnh/video) để chạy nhận diện
     * @param {File} file - File để upload
     * @param {String} fileType - "image" hoặc "video"
     */
    uploadAndDetect: (file, fileType) => {
        const formData = new FormData();
        formData.append('file', file); 
        formData.append('file_type', fileType);

        return axiosClient.post('/api/recognition/upload-run/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    /**
     * 2. Lấy lịch sử các lần nhận diện của người dùng đã đăng nhập
     */
    getHistory: () => {
        return axiosClient.get('/api/recognition/history/');
    },

    /**
     * 3. Lấy chi tiết một lần nhận diện theo ID
     */
    getDetectionById: (id) => {
        return axiosClient.get(`/api/recognition/detection/${id}/`);
    },

    /**
     * 4. Lấy dữ liệu thống kê cho Dashboard
     */
    getDashboardStats: () => {
        return axiosClient.get('/api/dashboard/stats/'); // Endpoint này cần được tạo ở Backend
    },
};

export default detectionApi;