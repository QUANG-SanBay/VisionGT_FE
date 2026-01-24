import React, { useEffect, useState } from 'react';
import { Grid, CircularProgress, Avatar } from '@mui/material';
import dashboardApi from '../../../api/dashboardApi';
import { 
    Users, Activity, AlertTriangle, CheckCircle, 
    Clock, Shield, FileImage, FileVideo, TrendingUp,
    Calendar, MoreHorizontal, UserCheck
} from 'lucide-react';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [health, setHealth] = useState(null);
    const [recentDetections, setRecentDetections] = useState([]);
    const [topSigns, setTopSigns] = useState([]);
    const [userActivity, setUserActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, healthRes, recentRes, topSignsRes, activityRes] = await Promise.all([
                    dashboardApi.getStats(),
                    dashboardApi.getSystemHealth(),
                    dashboardApi.getRecentDetections(5),
                    dashboardApi.getTopSigns(5),
                    dashboardApi.getUserActivity(5)
                ]);
                setStats(statsRes.data);
                setHealth(healthRes.data);
                setRecentDetections(recentRes.data);
                setTopSigns(topSignsRes.data);
                setUserActivity(activityRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <CircularProgress />
                <p>Đang tải dữ liệu hệ thống...</p>
            </div>
        );
    }

    // Calculate max count for progress bars
    const maxSignCount = Math.max(...topSigns.map(s => s.count), 1);

    return (
        <div className={styles.root}>
            <div className={styles.container}>
                {/* HEADER */}
                <div className={styles.headerSection}>
                    <div>
                        <h1 className={styles.pageTitle}>Dashboard Tổng Quan</h1>
                        <p className={styles.pageSubtitle}>Thống kê hiệu suất và hoạt động hệ thống</p>
                    </div>
                    <div className={styles.dateBadge}>
                        <Calendar size={16} />
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                
                {/* STATS CARDS */}
                <Grid container spacing={3} className={styles.statsGrid}>
                    {/* Users Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className={`${styles.statCard} ${styles.cardBlue}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <Users size={24} />
                                </div>
                                <span className={styles.cardLabel}>Người dùng</span>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.value}>{stats?.total_users || 0}</div>
                                <div className={styles.subText}>Tổng tài khoản</div>
                                <div className={styles.progressWrapper}>
                                    <div className={styles.miniProgress}><span style={{width: '70%'}}></span></div>
                                </div>
                            </div>
                        </div>
                    </Grid>

                    {/* Detections Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className={`${styles.statCard} ${styles.cardGreen}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <Activity size={24} />
                                </div>
                                <span className={styles.cardLabel}>Lượt nhận diện</span>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.value}>{stats?.total_detections || 0}</div>
                                <div className={styles.trendPositive}>
                                    <TrendingUp size={14} /> +{health?.detections_last_24h || 0} hôm nay
                                </div>
                            </div>
                        </div>
                    </Grid>

                    {/* Signs Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className={`${styles.statCard} ${styles.cardOrange}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <AlertTriangle size={24} />
                                </div>
                                <span className={styles.cardLabel}>Biển báo</span>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.value}>{stats?.total_detected_signs || 0}</div>
                                <div className={styles.subText}>Đã phát hiện</div>
                            </div>
                        </div>
                    </Grid>

                    {/* Health Card */}
                    <Grid item xs={12} sm={6} md={3}>
                        <div className={`${styles.statCard} ${styles.cardPurple}`}>
                            <div className={styles.cardHeader}>
                                <div className={styles.iconBox}>
                                    <Shield size={24} />
                                </div>
                                <span className={styles.cardLabel}>Hệ thống</span>
                            </div>
                            <div className={styles.statContent}>
                                <div className={styles.valueText} style={{ fontSize: '1.2rem', textTransform: 'uppercase' }}>
                                    {health?.system_status || 'Unknown'}
                                </div>
                                <div className={styles.subText}>
                                    Tỷ lệ thành công: {health?.success_rate}%
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>

                <Grid container spacing={3}>
                    {/* TOP SIGNS CHART */}
                    <Grid item xs={12} lg={6}>
                        <div className={`${styles.statCard} ${styles.chartCard}`} style={{ height: 'auto', minHeight: '100%' }}>
                            <div className={styles.chartHeader}>
                                <div className={styles.chartTitle}>
                                    <CheckCircle size={20} className="text-blue-600" />
                                    Top Biển Báo Phổ Biến
                                </div>
                                <button className={styles.actionBtn}>
                                    <MoreHorizontal size={16} />
                                </button>
                            </div>
                            
                            <div className={styles.chartContainer}>
                                {topSigns.length > 0 ? topSigns.map((sign, index) => (
                                    <div key={index} className={styles.typeItem} style={{'--delay': `${index * 0.1}s`}}>
                                        <div className={styles.labelRow}>
                                            <span className={styles.typeName}>
                                                {sign.sign_code} - {sign.sign_name}
                                            </span>
                                            <span className={styles.countLabel}>{sign.count} lần</span>
                                        </div>
                                        <div className={styles.barContainer}>
                                            <div 
                                                className={styles.barFill} 
                                                style={{ 
                                                    width: `${(sign.count / maxSignCount) * 100}%`,
                                                    '--bar-color': index % 2 === 0 ? '#3b82f6' : '#10b981'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-8 text-gray-400">Chưa có dữ liệu thống kê</div>
                                )}
                            </div>
                        </div>
                    </Grid>

                    {/* RECENT DETECTIONS & USER ACTIVITY */}
                    <Grid item xs={12} lg={6}>
                        <div className="flex flex-col gap-6 h-full">
                            {/* Recent Detections */}
                            <div className={`${styles.statCard} ${styles.chartCard}`} style={{ height: 'auto' }}>
                                <div className={styles.chartHeader}>
                                    <div className={styles.chartTitle}>
                                        <Clock size={20} className="text-orange-500" />
                                        Nhận Diện Gần Đây
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4">
                                    {recentDetections.length > 0 ? recentDetections.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2.5 rounded-lg ${item.file_type === 'video' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                                    {item.file_type === 'video' ? <FileVideo size={18} /> : <FileImage size={18} />}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-700 text-sm">#{item.id} • {item.user_email.split('@')[0]}</div>
                                                    <div className="text-xs text-slate-500 flex items-center gap-1">
                                                        {new Date(item.created_at).toLocaleString('vi-VN')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                                                    ${item.status === 'done' ? 'bg-green-100 text-green-700' : 
                                                      item.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {item.status}
                                                </span>
                                                <div className="text-xs font-semibold text-slate-400 mt-1">
                                                    {item.detected_signs_count} biển báo
                                                </div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-6 text-gray-400">Chưa có hoạt động nào</div>
                                    )}
                                </div>
                            </div>

                            {/* User Activity */}
                            <div className={`${styles.statCard} ${styles.chartCard}`} style={{ height: 'auto', flex: 1 }}>
                                <div className={styles.chartHeader}>
                                    <div className={styles.chartTitle}>
                                        <UserCheck size={20} className="text-indigo-500" />
                                        Người Dùng Tích Cực
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    {userActivity.length > 0 ? userActivity.map((user) => (
                                        <div key={user.user_id} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#3b82f6', fontSize: '0.8rem' }}>
                                                    {user.full_name?.charAt(0) || 'U'}
                                                </Avatar>
                                                <div>
                                                    <div className="font-semibold text-slate-700 text-sm">{user.full_name}</div>
                                                    <div className="text-xs text-slate-400">{user.user_email}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-slate-700">{user.total_detections}</div>
                                                <div className="text-[10px] text-slate-400 uppercase font-bold">Detections</div>
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="text-center py-4 text-gray-400">Chưa có dữ liệu</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
};

export default Dashboard;