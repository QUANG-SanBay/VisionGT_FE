import { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  AlertTriangle,
  Activity,
  Clock,
  CheckCircle,
  XCircle,
  Image,
  Video,
  TrendingUp,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import dashboardApi from '../../../api/dashboardApi';
import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentDetections, setRecentDetections] = useState([]);
  const [topSigns, setTopSigns] = useState([]);
  const [userActivity, setUserActivity] = useState([]);
  const [dailyStats, setDailyStats] = useState([]);
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [
        statsRes,
        recentRes,
        topSignsRes,
        userActivityRes,
        dailyStatsRes,
        systemHealthRes,
      ] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentDetections(10),
        dashboardApi.getTopSigns(10),
        dashboardApi.getUserActivity(10),
        dashboardApi.getDailyStats(7),
        dashboardApi.getSystemHealth(),
      ]);

      setStats(statsRes.data);
      setRecentDetections(recentRes.data);
      setTopSigns(topSignsRes.data);
      setUserActivity(userActivityRes.data);
      setDailyStats(dailyStatsRes.data);
      setSystemHealth(systemHealthRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return styles.statusDone;
      case 'processing':
        return styles.statusProcessing;
      case 'pending':
        return styles.statusPending;
      case 'failed':
        return styles.statusFailed;
      default:
        return '';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'done':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      case 'failed':
        return 'Thất bại';
      default:
        return status;
    }
  };

  const getSystemStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return styles.healthHealthy;
      case 'warning':
        return styles.healthWarning;
      case 'critical':
        return styles.healthCritical;
      default:
        return '';
    }
  };

  const getSystemStatusText = (status) => {
    switch (status) {
      case 'healthy':
        return 'Hoạt động tốt';
      case 'warning':
        return 'Cảnh báo';
      case 'critical':
        return 'Nghiêm trọng';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <h1>Dashboard Quản Trị</h1>
        <p>Tổng quan hệ thống phát hiện biển báo giao thông</p>
      </div>

      {/* System Health Alert */}
      {systemHealth && (
        <div
          className={`${styles.systemHealth} ${getSystemStatusColor(
            systemHealth.system_status
          )}`}
        >
          <Activity size={24} />
          <div className={styles.healthInfo}>
            <h3>Trạng thái hệ thống: {getSystemStatusText(systemHealth.system_status)}</h3>
            <div className={styles.healthStats}>
              <span>Tỷ lệ thành công: {systemHealth.success_rate}%</span>
              <span>Hoạt động 24h: {systemHealth.detections_last_24h} lượt</span>
              <span>Users hoạt động (7 ngày): {systemHealth.active_users_last_7d}</span>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#4CAF50' }}>
            <Users size={28} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats?.total_users || 0}</h3>
            <p>Tổng người dùng</p>
            <div className={styles.statDetails}>
              <span>Admin: {stats?.total_admins || 0}</span>
              <span>Customer: {stats?.total_customers || 0}</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#2196F3' }}>
            <FileText size={28} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats?.total_detections || 0}</h3>
            <p>Tổng số phát hiện</p>
            <div className={styles.statDetails}>
              <span>
                <Image size={14} /> {stats?.image_detections || 0}
              </span>
              <span>
                <Video size={14} /> {stats?.video_detections || 0}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#FF9800' }}>
            <AlertTriangle size={28} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats?.total_traffic_signs || 0}</h3>
            <p>Tổng biển báo</p>
            <div className={styles.statDetails}>
              <span>Đã phát hiện: {stats?.total_detected_signs || 0}</span>
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon} style={{ background: '#9C27B0' }}>
            <TrendingUp size={28} />
          </div>
          <div className={styles.statInfo}>
            <h3>{stats?.done_detections || 0}</h3>
            <p>Đã hoàn thành</p>
            <div className={styles.statDetails}>
              <span>
                <Clock size={14} /> Chờ: {stats?.pending_detections || 0}
              </span>
              <span>
                <Activity size={14} /> Xử lý: {stats?.processing_detections || 0}
              </span>
              <span>
                <XCircle size={14} /> Lỗi: {stats?.failed_detections || 0}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className={styles.chartsGrid}>
        {/* Daily Stats Chart */}
        <div className={styles.chartCard}>
          <h2>Thống kê theo ngày (7 ngày qua)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="detections_count"
                stroke="#2196F3"
                name="Phát hiện"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="new_users_count"
                stroke="#4CAF50"
                name="Users mới"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="detected_signs_count"
                stroke="#FF9800"
                name="Biển báo"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Signs Chart */}
        <div className={styles.chartCard}>
          <h2>Top 10 biển báo phổ biến</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topSigns.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sign_code" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#4CAF50" name="Số lần phát hiện" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables Section */}
      <div className={styles.tablesGrid}>
        {/* Recent Detections */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Phát hiện gần đây</h2>
            <span className={styles.badge}>{recentDetections.length}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Loại</th>
                  <th>Người dùng</th>
                  <th>Trạng thái</th>
                  <th>Biển báo</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {recentDetections.map((detection) => (
                  <tr key={detection.id}>
                    <td>#{detection.id}</td>
                    <td>
                      <span className={styles.fileType}>
                        {detection.file_type === 'image' ? (
                          <Image size={16} />
                        ) : (
                          <Video size={16} />
                        )}
                        {detection.file_type === 'image' ? 'Ảnh' : 'Video'}
                      </span>
                    </td>
                    <td>{detection.user_email}</td>
                    <td>
                      <span className={`${styles.status} ${getStatusColor(detection.status)}`}>
                        {getStatusText(detection.status)}
                      </span>
                    </td>
                    <td>{detection.detected_signs_count}</td>
                    <td>{formatDate(detection.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {recentDetections.length === 0 && (
              <div className={styles.emptyState}>
                <p>Chưa có phát hiện nào</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Signs Table */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Top biển báo</h2>
            <span className={styles.badge}>{topSigns.length}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Mã</th>
                  <th>Tên biển báo</th>
                  <th>Danh mục</th>
                  <th>Số lần</th>
                </tr>
              </thead>
              <tbody>
                {topSigns.map((sign, index) => (
                  <tr key={sign.sign_code}>
                    <td>{index + 1}</td>
                    <td>
                      <span className={styles.signCode}>{sign.sign_code}</span>
                    </td>
                    <td>{sign.sign_name}</td>
                    <td>
                      <span className={styles.category}>{sign.category}</span>
                    </td>
                    <td>
                      <span className={styles.count}>{sign.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {topSigns.length === 0 && (
              <div className={styles.emptyState}>
                <p>Chưa có dữ liệu biển báo</p>
              </div>
            )}
          </div>
        </div>

        {/* User Activity */}
        <div className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <h2>Hoạt động người dùng</h2>
            <span className={styles.badge}>{userActivity.length}</span>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Email</th>
                  <th>Họ tên</th>
                  <th>Tổng phát hiện</th>
                  <th>Hoạt động gần nhất</th>
                </tr>
              </thead>
              <tbody>
                {userActivity.map((user) => (
                  <tr key={user.user_id}>
                    <td>#{user.user_id}</td>
                    <td>{user.user_email}</td>
                    <td>{user.full_name}</td>
                    <td>
                      <span className={styles.count}>{user.total_detections}</span>
                    </td>
                    <td>{formatDate(user.last_activity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {userActivity.length === 0 && (
              <div className={styles.emptyState}>
                <p>Chưa có hoạt động nào</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
