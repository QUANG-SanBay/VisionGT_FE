import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, CircularProgress, Card, CardContent, Box, Alert, Chip, CardMedia, Grid, Paper, Divider } from '@mui/material';
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, Tag, FileText, Activity, Calendar } from 'lucide-react';
import styles from './Detections.module.scss';
import detectionApi from '../../../api/detectionApi';

// Trang hiển thị chi tiết một LẦN NHẬN DIỆN (Detection)
// - Lấy `id` từ params
// - Gọi API `getDetectionById(id)`
// - Hiển thị file output (ảnh/video) và danh sách các biển báo đã phát hiện
const DetectionDetail = () => {
    const { id } = useParams(); // lấy id từ URL
    const navigate = useNavigate();

    const [detection, setDetection] = useState(null); // dữ liệu của một lần nhận diện
    const [loading, setLoading] = useState(true); // trạng thái loading
    const [error, setError] = useState(null); // lỗi khi fetch

    // Fetch chi tiết khi component mount hoặc id thay đổi
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                setLoading(true);
                const res = await detectionApi.getDetectionById(id);
                // Backend trả về object chi tiết ở res.data
                setDetection(res.data);
                setError(null);
            } catch (err) {
                console.error('Lỗi khi lấy chi tiết:', err);
                setError(err.response?.data?.message || 'Không thể tải dữ liệu chi tiết từ máy chủ.');
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
        <div className={styles.pageRoot}>
            <div className={styles.topBar}>
                <div className={styles.container}>
                    <Button 
                        onClick={() => navigate(-1)}
                        startIcon={<ArrowLeft size={18} />}
                        className={styles.backBtn}
                    >
                        Quay lại danh sách
                    </Button>
                    <div className={styles.headerMeta}>
                        <Chip icon={<Tag size={14}/>} label={`ID: #${id}`} className={styles.metaChip} />
                        <Chip icon={<Calendar size={14}/>} label={detection?.detectedAt || 'N/A'} className={styles.metaChip} />
                    </div>
                </div>
            </div>

            <div className={styles.container}>
                {error && (
                    <Alert severity="error" className={styles.alert} icon={<AlertTriangle size={20} />}>
                        {error}
                    </Alert>
                )}

                {detection ? (
                    <Grid container spacing={4}>
                        {/* Left Column: Media */}
                        <Grid item xs={12} lg={7}>
                            <Paper elevation={0} className={styles.mediaPaper}>
                                <div className={styles.mediaHeader}>
                                    <Activity size={18} /> Hình ảnh phân tích
                                </div>
                                <div className={styles.imageWrapper}>
                                    <CardMedia
                                        component="img"
                                        image={detection.image}
                                        alt={detection.name}
                                        className={styles.detailImage}
                                    />
                                </div>
                            </Paper>
                        </Grid>

                        {/* Right Column: Info */}
                        <Grid item xs={12} lg={5}>
                            <Card className={styles.infoCard} elevation={0}>
                                <CardContent className={styles.cardContent}>
                                    <Box className={styles.titleSection}>
                                        <h1 className={styles.detailName}>{detection.name}</h1>
                                        <Chip 
                                            icon={<CheckCircle size={16} />} 
                                            label={`${detection.confidence}% Tin cậy`} 
                                            className={styles.confidenceChip}
                                            color={detection.confidence > 80 ? "success" : "warning"}
                                        />
                                    </Box>

                                    <Divider className={styles.divider} />

                                    <Box className={styles.infoList}>
                                        <Box className={styles.infoRow}>
                                            <span className={styles.label}>Phân loại</span>
                                            <span className={styles.valueHighlight}>{detection.type}</span>
                                        </Box>
                                        <Box className={styles.infoRow}>
                                            <span className={styles.label}>Thời gian</span>
                                            <span className={styles.value}>{detection.detectedAt}</span>
                                        </Box>
                                    </Box>

                                    {detection.description && (
                                        <Box className={styles.descriptionBox}>
                                            <h3 className={styles.descTitle}><FileText size={16}/> Mô tả chi tiết</h3>
                                            <p className={styles.descText}>{detection.description}</p>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                ) : (
                    <Card className={styles.emptyCard}>
                        <AlertTriangle size={48} className={styles.emptyIcon} />
                        <p className={styles.emptyText}>Không có dữ liệu để hiển thị</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default DetectionDetail;
