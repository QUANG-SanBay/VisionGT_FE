import axiosClient from './client/axios';

const detectionApi = {
    uploadAndDetect: (file) => {
        const formData = new FormData();
        const type = file.type.startsWith('video') ? 'video' : 'image';

        formData.append('file', file);
        formData.append('file_type', type);

        return axiosClient.post('/recognition/upload-run/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getDetectionDetail: (detectionId) => {
        return axiosClient.get(`/recognition/detection/${detectionId}/`);
    },

    getHistory: () => {
        return axiosClient.get('/recognition/history/');
    },

    getDetectionById: (id) => {
        return axiosClient.get(`/api/recognition/detection/${id}/`);
    },

    getDetectionStats: () => {
        return axiosClient.get('/detection/stats/');
    },

    getHistory: () => {
        return axiosClient.get('/recognition/history/');
    },
};

export default detectionApi;
