// Import cái axiosClient mà dự án đã cấu hình sẵn
import axiosClient from './client/axios'; 

const detectionApi = {
    // Hàm gửi ảnh lên Server
    uploadAndDetect: (file) => {
        const formData = new FormData();
        // 'image' là cái key mà Backend Django sẽ nhận (Thịnh sẽ code phần này)
        formData.append('image', file); 

        return axiosClient.post('/detection/predict/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
    /**
     * 2. Lấy danh sách biển báo đã nhận diện (quản lý biển báo)
     */
    getAllDetections: () => {
        return axiosClient.get('/detection/list/');
    },

    /**
     * 3. Lấy chi tiết 1 biển báo theo ID
     */
    getDetectionById: (id) => {
        return axiosClient.get(`/detection/${id}/`);
    },

    /**
     * 4. Lấy dữ liệu thống kê cho Dashboard
     */
    getDetectionStats: () => {
        return axiosClient.get('/detection/stats/');
    }
};

export default detectionApi;