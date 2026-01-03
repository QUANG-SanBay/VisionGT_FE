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
    }
};

export default detectionApi;