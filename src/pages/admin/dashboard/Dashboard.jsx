import React, { useState, useEffect } from 'react';
import { Box, Grid, CardContent, Typography, CircularProgress, Alert, Container, Paper, LinearProgress, Chip } from '@mui/material';
import { BarChart3, TrendingUp, CheckCircle, Activity, PieChart, Calendar, Layers, ArrowUpRight } from 'lucide-react';
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
            <Container maxWidth="xl" className={styles.container}>
            <Box className={styles.headerSection}>
                <Box>
                    <Typography variant="h4" className={styles.pageTitle}>Dashboard Tổng Quan</Typography>
                    <Typography variant="body1" className={styles.pageSubtitle}>Báo cáo hiệu suất và thống kê nhận diện biển báo giao thông.</Typography>
                </Box>
                <Box className={styles.dateBadge}>
                    <Calendar size={18} />
                    <span>{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
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
                    <Paper elevation={0} className={`${styles.statCard} ${styles.cardBlue}`}>
                        <Box className={styles.cardHeader}>
                            <Box className={styles.iconBox}>
                                <Activity size={24} />
                            </Box>
                            <Typography variant="subtitle2" className={styles.cardLabel}>Tổng lượt nhận diện</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>{total}</Typography>
                            <Typography variant="caption" className={styles.trendPositive}>
                                <TrendingUp size={14} /> +12% so với tuần trước
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={`${styles.statCard} ${styles.cardGreen}`}>
                        <Box className={styles.cardHeader}>
                            <Box className={styles.iconBox}>
                                <CheckCircle size={24} />
                            </Box>
                            <Typography variant="subtitle2" className={styles.cardLabel}>Loại phổ biến nhất</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h4" className={styles.valueText}>{mostCommon?.type || 'N/A'}</Typography>
                            <Chip size="small" label={`${mostCommon?.count || 0} lần`} className={styles.miniChip} />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={`${styles.statCard} ${styles.cardOrange}`}>
                        <Box className={styles.cardHeader}>
                            <Box className={styles.iconBox}>
                                <PieChart size={24} />
                            </Box>
                            <Typography variant="subtitle2" className={styles.cardLabel}>Độ chính xác TB</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>98.5%</Typography>
                            <Box className={styles.progressWrapper}>
                                <LinearProgress variant="determinate" value={98.5} className={styles.miniProgress} />
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Paper elevation={0} className={`${styles.statCard} ${styles.cardPurple}`}>
                        <Box className={styles.cardHeader}>
                            <Box className={styles.iconBox}>
                                <Layers size={24} />
                            </Box>
                            <Typography variant="subtitle2" className={styles.cardLabel}>Danh mục biển báo</Typography>
                        </Box>
                        <Box className={styles.statContent}>
                            <Typography variant="h3" className={styles.value}>{uniqueTypes}</Typography>
                            <Typography variant="caption" className={styles.subText}>Đang được theo dõi</Typography>
                        </Box>
                    </Paper>
                </Grid>

                {/* Distribution Chart */}
                <Grid item xs={12}>
                    <Paper elevation={0} className={styles.chartCard}>
                        <CardContent>
                            <Box className={styles.chartHeader}>
                                <Box>
                                    <Typography variant="h6" className={styles.chartTitle}>
                                        <BarChart3 size={20} /> Phân Bố Dữ Liệu Nhận Diện
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">Thống kê số lượng phát hiện theo từng loại biển báo</Typography>
                                </Box>
                                <Box className={styles.actionBox}>
                                    <button className={styles.actionBtn}>
                                        Chi tiết <ArrowUpRight size={16} />
                                    </button>
                                </Box>
                            </Box>
                            
                            <Box className={styles.chartContainer}>
                                {byType.map((t, index) => {
                                    const percent = Math.round(((t.count || 0) / sumByType) * 100);
                                    
                                    return (
                                        <Box key={t.type} className={styles.typeItem} style={{ '--delay': `${index * 0.1}s` }}>
                                            <Box className={styles.labelRow}>
                                                <span className={styles.typeName}>{t.type}</span>
                                                <span className={styles.countLabel}>{t.count} lượt</span>
                                            </Box>
                                            <Box className={styles.barContainer}>
                                                <Box 
                                                    className={styles.barFill} 
                                                    style={{ 
                                                        width: `${percent}%`,
                                                        '--bar-color': `var(--chart-color-${index % 5 + 1})`
                                                    }} 
                                                />
                                            </Box>
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
