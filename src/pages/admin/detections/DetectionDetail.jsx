import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Card, CardMedia, CardContent, Box, Alert } from '@mui/material';
import { ArrowLeft, AlertTriangle, CheckCircle } from 'lucide-react';
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
            <Box className={styles.detailHeader}>
                <Button 
                    variant="outlined" 
                    onClick={() => navigate(-1)}
                    startIcon={<ArrowLeft size={20} />}
                    className={styles.backBtn}
                >
                    Quay lại
                </Button>
                <h1 className={styles.detailTitle}>📋 Chi Tiết Biển Báo</h1>
            </Box>

            {error && (
                <Alert severity="warning" style={{ marginBottom: 24 }} icon={<AlertTriangle size={20} />}>
                    {error}
                </Alert>
            )}

            {detection ? (
                <Box className={styles.detailContainer}>
                    <Card className={styles.imageCard}>
                        <CardMedia
                            component="img"
                            image={detection.image}
                            alt={detection.name}
                            className={styles.detailImage}
                        />
                    </Card>

                    <Box className={styles.detailContent}>
                        <Card className={styles.infoCard}>
                            <CardContent>
                                {/* Tiêu đề */}
                                <Box className={styles.titleSection}>
                                    <h2 className={styles.detailName}>{detection.name}</h2>
                                    <Box className={styles.confidenceBadge}>
                                        <CheckCircle size={20} />
                                        <span>{detection.confidence}% Tin cậy</span>
                                    </Box>
                                </Box>

                                {/* Thông tin grid */}
                                <Box className={styles.infoGrid}>
                                    <Box className={styles.infoItem}>
                                        <span className={styles.infoLabel}>ID</span>
                                        <span className={styles.infoValue}>#{detection.id}</span>
                                    </Box>
                                    <Box className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Loại Biển Báo</span>
                                        <Box className={styles.typeBadgeDetail}>{detection.type}</Box>
                                    </Box>
                                    <Box className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Ngày Phát Hiện</span>
                                        <span className={styles.infoValue}>{detection.detectedAt}</span>
                                    </Box>
                                    <Box className={styles.infoItem}>
                                        <span className={styles.infoLabel}>Độ Chính Xác</span>
                                        <Box className={styles.confidenceDetailBar}>
                                            <Box 
                                                className={styles.confidenceDetailFill}
                                                style={{ width: `${detection.confidence}%` }}
                                            />
                                        </Box>
                                        <span className={styles.confidencePercent}>{detection.confidence}%</span>
                                    </Box>
                                </Box>

                                {/* Mô tả */}
                                {detection.description && (
                                    <Box className={styles.descriptionSection}>
                                        <h3>Mô Tả</h3>
                                        <p>{detection.description}</p>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            ) : (
                <Card className={styles.emptyCard}>
                    <AlertTriangle size={48} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Không có dữ liệu để hiển thị</p>
                </Card>
            )}
        </div>
    );
};

export default DetectionDetail;
