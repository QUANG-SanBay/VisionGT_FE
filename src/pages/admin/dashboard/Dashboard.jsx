import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
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
                const res = await detectionApi.getDetectionStats();
                // Kỳ vọng backend trả về { total: number, by_type: [{type, count}], timeseries: [...] }
                setStats(res.data);
                setError(null);
            } catch (err) {
                console.error('Lỗi lấy thống kê:', err);
                setError('Không thể tải thống kê. Hiển thị dữ liệu mẫu.');
                // Dữ liệu mẫu để demo giao diện
                setStats({
                    total: 37,
                    by_type: [
                        { type: 'P.102', count: 15 },
                        { type: 'P.103', count: 10 },
                        { type: 'W.201', count: 6 },
                        { type: 'Other', count: 6 },
                    ],
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress />
                <p>Đang tải thống kê...</p>
            </div>
        );
    }

    const total = stats?.total ?? 0;
    const byType = stats?.by_type ?? [];

    // Tính tổng để chuẩn hóa thanh phần trăm
    const sumByType = byType.reduce((s, t) => s + (t.count || 0), 0) || 1;

    return (
        <div className={styles.dashboardPage}>
            <Box className={styles.headerSection}>
                <h1 className={styles.pageTitle}>📊 Dashboard Quản Lý</h1>
                <p className={styles.pageSubtitle}>Thống kê và phân tích hệ thống nhận diện biển báo</p>
            </Box>

            {error && (
                <Alert severity="warning" style={{ marginBottom: 20 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {/* Stat Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Box className={styles.statCard}>
                        <Box className={styles.statIcon}>
                            <BarChart3 size={32} />
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography className={styles.statLabel}>Tổng Biển Báo</Typography>
                            <Typography className={styles.statValue}>{total}</Typography>
                            <Typography className={styles.statDesc}>Đã nhận diện</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box className={styles.statCard}>
                        <Box className={`${styles.statIcon} ${styles.iconSuccess}`}>
                            <CheckCircle size={32} />
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography className={styles.statLabel}>Loại Phổ Biến</Typography>
                            <Typography className={styles.statValue}>{byType[0]?.type || 'N/A'}</Typography>
                            <Typography className={styles.statDesc}>{byType[0]?.count || 0} lần</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box className={styles.statCard}>
                        <Box className={`${styles.statIcon} ${styles.iconWarning}`}>
                            <TrendingUp size={32} />
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography className={styles.statLabel}>Tỉ Lệ Thành Công</Typography>
                            <Typography className={styles.statValue}>98%</Typography>
                            <Typography className={styles.statDesc}>Trong tháng</Typography>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Box className={styles.statCard}>
                        <Box className={`${styles.statIcon} ${styles.iconInfo}`}>
                            <AlertCircle size={32} />
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography className={styles.statLabel}>Loại Khác Nhau</Typography>
                            <Typography className={styles.statValue}>{byType.length}</Typography>
                            <Typography className={styles.statDesc}>Được hệ thống hỗ trợ</Typography>
                        </Box>
                    </Box>
                </Grid>

                {/* Distribution Chart */}
                <Grid item xs={12}>
                    <Card className={styles.chartCard}>
                        <CardContent>
                            <Typography className={styles.chartTitle}>📈 Phân Bố Theo Loại Biển Báo</Typography>
                            
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
                                            <Box className={styles.typeInfo}>
                                                <Box className={styles.typeBadge} style={{ backgroundColor: color }}>
                                                    {t.type}
                                                </Box>
                                                <span className={styles.typeCount}>{t.count} báo ({percent}%)</span>
                                            </Box>
                                            <Box className={styles.barContainer}>
                                                <Box 
                                                    className={styles.barFill} 
                                                    style={{ 
                                                        width: `${percent}%`,
                                                        backgroundColor: color
                                                    }} 
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
};

export default Dashboard;
