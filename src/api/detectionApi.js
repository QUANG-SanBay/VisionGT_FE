/*import axiosClient from './client/axios'; 

const detectionApi = {
    // 1. API Upload: Gửi file và file_type (image/video)
    uploadAndDetect: (file) => {
        const formData = new FormData();
        const fileType = file.type.startsWith('video') ? 'video' : 'image'; // Tự động nhận diện type
        
        formData.append('file', file); // Key 'file' theo yêu cầu của bạn
        formData.append('file_type', fileType); 

        return axiosClient.post('/recognition/upload-run/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // 2. API Xem chi tiết: Lấy thông tin qua ID
    getDetectionDetail: (detectionId) => {
        return axiosClient.get(`/recognition/detection/${detectionId}/`);
    }
};

export default detectionApi;*/

import axiosClient from './client/axios'; 

const detectionApi = {
    // API POST: Gửi file và file_type
    uploadAndDetect: (file) => {
        const formData = new FormData();
        const type = file.type.startsWith('video') ? 'video' : 'image';
        
        formData.append('file', file);      
        formData.append('file_type', type); 

        return axiosClient.post('/recognition/upload-run/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    // API GET: Lấy chi tiết qua detection_id
    getDetectionDetail: (detectionId) => {
        return axiosClient.get(`/recognition/detection/${detectionId}/`);
    }
};

export default detectionApi;