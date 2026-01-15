import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Card, CardMedia, CardContent } from '@mui/material';
import styles from './Detections.module.scss';
import detectionApi from '../../../api/detectionApi';

// Trang hiển thị chi tiết một biển báo
// - Lấy `id` từ params
// - Gọi API `getDetectionById(id)`
// - Hiển thị ảnh, tên, loại, độ chính xác, ngày phát hiện và mô tả
const DetectionDetail = () => {
    const { id } = useParams(); // lấy id từ URL
    const navigate = useNavigate();

    const [detection, setDetection] = useState(null); // dữ liệu biển báo
    const [loading, setLoading] = useState(true); // trạng thái loading
    const [error, setError] = useState(null); // lỗi khi fetch

    // Fetch chi tiết khi component mount hoặc id thay đổi
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await detectionApi.getDetectionById(id);
                // Backend kỳ vọng trả object chi tiết ở res.data
                setDetection(res.data);
                setError(null);
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết:', err);
                setError('Không thể tải chi tiết. Hiển thị dữ liệu mẫu.');
                // Dữ liệu mẫu để demo giao diện khi backend chưa có
                setDetection({
                    id,
                    name: 'Cấm đi ngược chiều (mẫu)',
                    type: 'P.102',
                    image: 'https://via.placeholder.com/600x400',
                    detectedAt: '2024-01-08',
                    confidence: 99,
                    description: 'Mô tả mẫu cho biển báo',
                });
            } finally {
                setLoading(false);
            }
        };

        fetchDetail();
    }, [id]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress />
                <p>Đang tải chi tiết...</p>
            </div>
        );
    }

    return (
        <div className={styles.detectionDetailPage}>
            <Button variant="outlined" onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
                Quay lại
            </Button>

            {error && (
                <div style={{ marginBottom: 12, color: '#d9534f' }}>{error}</div>
            )}

            {detection ? (
                <Card>
                    {/* Hình ảnh biển báo */}
                    <CardMedia
                        component="img"
                        height="360"
                        image={detection.image}
                        alt={detection.name}
                    />

                    <CardContent>
                        {/* Thông tin cơ bản */}
                        <h2 style={{ margin: '8px 0' }}>{detection.name}</h2>
                        <p><strong>ID:</strong> {detection.id}</p>
                        <p><strong>Loại:</strong> {detection.type}</p>
                        <p><strong>Độ chính xác:</strong> {detection.confidence}%</p>
                        <p><strong>Ngày phát hiện:</strong> {detection.detectedAt}</p>
                        <p><strong>Mô tả:</strong> {detection.description || 'Không có mô tả'}</p>
                    </CardContent>
                </Card>
            ) : (
                <div>Không có dữ liệu để hiển thị</div>
            )}
        </div>
    );
};

export default DetectionDetail;
