import React, { useState, useEffect } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert } from '@mui/material';
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
            <h1>Dashboard</h1>

            {error && (
                <Alert severity="warning" style={{ marginBottom: 12 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Tổng số biển báo</Typography>
                            <Typography variant="h3" color="primary">{total}</Typography>
                            <Typography variant="body2" color="textSecondary">Tổng số biển báo đã được nhận diện</Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Phân bố theo loại biển báo</Typography>

                            <Box mt={2}>
                                {byType.map((t) => {
                                    const percent = Math.round(((t.count || 0) / sumByType) * 100);
                                    return (
                                        <Box key={t.type} className={styles.typeRow}>
                                            <Box className={styles.typeLabel}>
                                                <strong>{t.type}</strong> <span className={styles.typeCount}>({t.count})</span>
                                            </Box>

                                            <Box className={styles.barBackground}>
                                                <Box className={styles.barFill} style={{ width: `${percent}%` }} />
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
