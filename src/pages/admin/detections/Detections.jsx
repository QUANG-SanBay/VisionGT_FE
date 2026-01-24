import React, { useEffect, useState } from 'react';
import detectionApi from '../../../api/detectionApi';
import { FileVideo, FileImage, RefreshCw } from 'lucide-react';

const Detections = () => {
    const [detections, setDetections] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDetections = async () => {
        setLoading(true);
        try {
            // Sử dụng API để lấy tất cả detections
            const response = await detectionApi.getAllDetections();
            // Dữ liệu có thể được gói trong key 'results' (do phân trang) hoặc 'detections'
            const detectionList = response.data.results || response.data.detections || response.data;
            
            // Đảm bảo rằng chúng ta luôn set một mảng
            setDetections(Array.isArray(detectionList) ? detectionList : []);
        } catch (error) {
            console.error("Error fetching detections:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetections();
    }, []);

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Nhận diện</h1>
                <button 
                    onClick={fetchDetections}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Làm mới
                </button>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại File</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kết quả</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thời gian</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {detections.map((item) => (
                                  <tr key={item.id} className="hover:bg-gray-50">
                                  {/* Sử dụng try...catch để bắt lỗi render từng dòng */}
                                  {(() => {
                                      try {
                                          return (
                                              <>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{item.id}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.user_email || 'N/A'}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <span className="flex items-center text-sm text-gray-600">
                                                          {item.file_type === 'video' ? <FileVideo size={16} className="mr-2 text-purple-500" /> : <FileImage size={16} className="mr-2 text-indigo-500" />}
                                                          {item.file_type || 'Unknown'}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'done' ? 'bg-green-100 text-green-800' : item.status === 'failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status || 'Unknown'}</span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.detected_signs_count} biển báo</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.created_at ? new Date(item.created_at).toLocaleString('vi-VN') : 'N/A'}</td>
                                              </>
                                          );
                                      } catch (e) {
                                          console.error(`Render error for item ${item.id}: `, e);
                                          return null; // Hoặc trả về một dòng thông báo lỗi
                                      }
                                  })()}
                              </tr>
                            ))}
                            {detections.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">Không có dữ liệu</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Detections;