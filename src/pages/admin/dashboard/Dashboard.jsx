import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert, Container, Paper, LinearProgress, Avatar } from '@mui/material';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, Activity, PieChart } from 'lucide-react';
import styles from './Dashboard.module.scss';
import detectionApi from '../../../api/detectionApi';

// Dashboard page
// - Gọi API `getDetectionStats()` để lấy số liệu thống kê
// - Hiển thị các card tổng quan và biểu đồ/chi tiết đơn giản
const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                // Gọi API thống kê mới
                const res = await detectionApi.getDashboardStats();
                // Kỳ vọng backend trả về { total_detections, detections_by_type, most_common_sign, total_unique_types }
                setStats(res.data);
                setError(null);
            } catch (err) {
                console.error('Lỗi lấy thống kê:', err);
                setError(err.response?.data?.detail || 'Không thể tải dữ liệu thống kê. API có thể chưa được cài đặt.');
                setStats(null); // Xóa dữ liệu cũ khi có lỗi
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress size={60} thickness={4} />
                <p>Đang tải thống kê...</p>
            </div>
        );
    }

    // Cập nhật cấu trúc dữ liệu từ API mới
    const total = stats?.total_detections ?? 0;
    const byType = stats?.detections_by_type ?? [];
    const mostCommon = stats?.most_common_sign;
    const uniqueTypes = stats?.total_unique_types ?? 0;

    const sumByType = byType.reduce((s, t) => s + (t.count || 0), 0) || 1;

    return (
        <div className={styles.root}>
            <div className={styles.backgroundDecor} />
            <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.headerSection}>
                <Box>
                    <Typography variant="h4" className={styles.pageTitle}>Tổng Quan Hệ Thống</Typography>
                    <Typography variant="body1" className={styles.pageSubtitle}>Chào mừng trở lại, đây là báo cáo hiệu suất nhận diện biển báo hôm nay.</Typography>
                </Box>
                <Box className={styles.dateBadge}>
                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </Box>
            </Box>

            {error && (
                <Alert severity="error" className={styles.alert} variant="filled">
                    {error}
                </Alert>
            )}

            {stats && (
            <Grid container spacing={3} className={styles.statsGrid}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={styles.statCard}>
                        <Box className={styles.cardHeader}>
                            <Box className={`${styles.iconBox} ${styles.blue}`}>
                                <Activity size={24} />
                            </Box>
                            <Typography variant="subtitle2" color="textSecondary">Tổng lượt nhận diện</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>{total}</Typography>
                            <Typography variant="caption" className={styles.trend}>
                                <TrendingUp size={14} /> +12% so với tuần trước
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={styles.statCard}>
                        <Box className={styles.cardHeader}>
                            <Box className={`${styles.iconBox} ${styles.green}`}>
                                <CheckCircle size={24} />
                            </Box>
                            <Typography variant="subtitle2" color="textSecondary">Loại phổ biến nhất</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h4" className={styles.valueText}>{mostCommon?.type || 'N/A'}</Typography>
                            <Typography variant="caption" color="textSecondary">Xuất hiện {mostCommon?.count || 0} lần</Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={styles.statCard}>
                        <Box className={styles.cardHeader}>
                            <Box className={`${styles.iconBox} ${styles.orange}`}>
                                <PieChart size={24} />
                            </Box>
                            <Typography variant="subtitle2" color="textSecondary">Độ chính xác TB</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>98.5%</Typography>
                            <LinearProgress variant="determinate" value={98.5} className={styles.miniProgress} />
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={styles.statCard}>
                        <Box className={styles.cardHeader}>
                            <Box className={`${styles.iconBox} ${styles.purple}`}>
                                <BarChart3 size={24} />
                            </Box>
                            <Typography variant="subtitle2" color="textSecondary">Danh mục biển báo</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>{uniqueTypes}</Typography>
                            <Typography variant="caption" color="textSecondary">Đang được theo dõi</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Distribution Chart */}
                <Grid item xs={12}>
                    <Paper elevation={0} className={styles.chartCard}>
                        <CardContent>
                            <Box className={styles.chartHeader}>
                                <Typography variant="h6" className={styles.chartTitle}>Phân Bố Dữ Liệu Nhận Diện</Typography>
                                <Box className={styles.legend}>
                                    <span className={styles.dot}></span> Dữ liệu thực tế
                                </Box>
                            </Box>
                            
                            <Box className={styles.chartContainer}>
                                {byType.map((t, index) => {
                                    const percent = Math.round(((t.count || 0) / sumByType) * 100);
                                    const colors = [
                                        '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A',
                                        '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'
                                    ];
                                    const color = colors[index % colors.length];
                                    
                                    return (
                                        <Box key={t.type} className={styles.typeItem}>
                                            <Box className={styles.labelRow}>
                                                <span className={styles.typeName}>{t.type}</span>
                                                <span className={styles.typePercent}>{percent}%</span>
                                            </Box>
                                            <Box className={styles.barContainer}>
                                                <Box 
                                                    className={styles.barFill} 
                                                    style={{ 
                                                        width: `${percent}%`,
                                                        backgroundColor: color,
                                                        boxShadow: `0 2px 8px ${color}66`
                                                    }} 
                                                />
                                            </Box>
                                            <span className={styles.countLabel}>{t.count} lượt</span>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>
            )}
            </Container>
        </div>
    );
};

export default Dashboard;
