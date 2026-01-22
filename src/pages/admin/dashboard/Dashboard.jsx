import React, { useEffect, useState } from 'react';
import dashboardApi from '../../../api/dashboardApi';
import { 
    Users, Activity, AlertTriangle, CheckCircle, 
    Clock, Shield, FileImage, FileVideo 
} from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [recentDetections, setRecentDetections] = useState([]);
    const [topSigns, setTopSigns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, healthRes, recentRes, topSignsRes] = await Promise.all([
                    dashboardApi.getStats(),
                    dashboardApi.getSystemHealth(),
                    dashboardApi.getRecentDetections(5),
                    dashboardApi.getTopSigns(5)
                ]);
                setStats(statsRes.data);
                setHealth(healthRes.data);
                setRecentDetections(recentRes.data);
                setTopSigns(topSignsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Dashboard Tổng Quan</h1>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 rounded-full bg-blue-50 text-blue-600 mr-4">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng người dùng</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.total_users}</p>
                    </div>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 rounded-full bg-green-50 text-green-600 mr-4">
                        <Activity size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Tổng lượt nhận diện</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.total_detections}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className="p-4 rounded-full bg-yellow-50 text-yellow-600 mr-4">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Biển báo phát hiện</p>
                        <p className="text-2xl font-bold text-gray-800">{stats?.total_detected_signs}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
                    <div className={`p-4 rounded-full mr-4 ${health?.system_status === 'healthy' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                        <Shield size={24} />
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Trạng thái hệ thống</p>
                        <p className="text-2xl font-bold text-gray-800 capitalize">{health?.system_status}</p>
                        <p className="text-xs text-gray-500">Tỷ lệ thành công: {health?.success_rate}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Detections */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                        <Clock size={20} className="mr-2 text-blue-600" />
                        Nhận diện gần đây
                    </h2>
                    <div className="space-y-4">
                        {recentDetections.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center">
                                    <div className={`p-2 rounded-lg mr-3 ${item.file_type === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                        {item.file_type === 'video' ? <FileVideo size={18} /> : <FileImage size={18} />}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">#{item.id} - {item.user_email}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString('vi-VN')}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                        ${item.status === 'done' ? 'bg-green-100 text-green-700' : 
                                          item.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {item.status}
                                    </span>
                                    <p className="text-xs text-gray-500 mt-1">{item.detected_signs_count} biển báo</p>
                                </div>
                            </div>
                        ))}
                        {recentDetections.length === 0 && <p className="text-gray-500 text-center">Chưa có dữ liệu</p>}
                    </div>
                </div>

                {/* Top Signs */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center">
                        <CheckCircle size={20} className="mr-2 text-green-600" />
                        Top biển báo phổ biến
                    </h2>
                    <div className="space-y-4">
                        {topSigns.map((sign, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                                <div className="flex items-center">
                                    <span className="w-6 h-6 flex items-center justify-center bg-gray-200 rounded-full text-xs font-bold text-gray-600 mr-3">
                                        {index + 1}
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{sign.sign_name}</p>
                                        <p className="text-xs text-gray-500">{sign.sign_code} - {sign.category}</p>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-blue-600">{sign.count} lần</span>
                            </div>
                        ))}
                        {topSigns.length === 0 && <p className="text-gray-500 text-center">Chưa có dữ liệu</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;