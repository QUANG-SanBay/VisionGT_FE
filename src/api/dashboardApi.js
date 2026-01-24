import axiosClient from './client/axios';

const dashboardApi = {
    // Thống kê tổng quan
    getStats: () => {
        return axiosClient.get('/dashboard/stats/');
    },
    
    // Detection gần đây
    getRecentDetections: (limit = 10) => {
        return axiosClient.get('/dashboard/recent-detections/', { params: { limit } });
    },
    
    // Top biển báo
    getTopSigns: (limit = 10) => {
        return axiosClient.get('/dashboard/top-signs/', { params: { limit } });
    },
    
    // Hoạt động người dùng
    getUserActivity: (limit = 10) => {
        return axiosClient.get('/dashboard/user-activity/', { params: { limit } });
    },
    
    // Thống kê theo ngày
    getDailyStats: (days = 7) => {
        return axiosClient.get('/dashboard/daily-stats/', { params: { days } });
    },
    
    // Sức khỏe hệ thống
    getSystemHealth: () => {
        return axiosClient.get('/dashboard/system-health/');
    }
};

export default dashboardApi;