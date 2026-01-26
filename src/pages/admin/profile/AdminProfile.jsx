import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  TextField,
  Button,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Avatar,
  Typography,
  Divider,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  User,
  Lock,
  Mail,
  Calendar,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import profileApi from '../../../api/profileApi';
import styles from './AdminProfile.module.scss';

const AdminProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile data
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    gender: '',
    username: '',
    date_joined: '',
    role: '',
  });

  // Profile form
  const [profileForm, setProfileForm] = useState({
    full_name: '',
    email: '',
    gender: '',
  });

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileApi.getProfile();
      const data = response.data;
      setProfile(data);
      setProfileForm({
        full_name: data.full_name || '',
        email: data.email || '',
        gender: data.gender || '',
      });
      setError(null);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Không thể tải thông tin profile');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError(null);
    setSuccess(null);
  };

  const handleProfileChange = (e) => {
    setProfileForm({
      ...profileForm,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({
      ...passwordForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    // Validate
    if (!profileForm.full_name.trim()) {
      setError('Họ và tên không được để trống');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!profileForm.email.trim()) {
      setError('Email không được để trống');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await profileApi.updateProfile(profileForm);
      setSuccess('Cập nhật thông tin thành công!');
      await fetchProfile();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error ||
                       JSON.stringify(err.response?.data) ||
                       'Cập nhật thất bại';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setError(null);
    setSuccess(null);

    // Validate
    if (!passwordForm.old_password.trim()) {
      setError('Vui lòng nhập mật khẩu hiện tại');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!passwordForm.new_password.trim()) {
      setError('Vui lòng nhập mật khẩu mới');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (passwordForm.new_password.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setError('Mật khẩu mới không khớp!');
      setUpdating(false);
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      await profileApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
        confirm_new_password: passwordForm.confirm_new_password,
      });
      setSuccess('Đổi mật khẩu thành công!');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      });
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error changing password:', err);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error ||
                       JSON.stringify(err.response?.data) ||
                       'Đổi mật khẩu thất bại';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      customer: 'Khách hàng',
    };
    return roles[role] || role;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <Typography>Đang tải dữ liệu...</Typography>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Thông Tin Cá Nhân</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
      </div>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} className={styles.alert}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" onClose={() => setSuccess(null)} className={styles.alert}>
          {success}
        </Alert>
      )}

      <Card className={styles.profileCard}>
        <Box className={styles.profileHeader}>
          <Avatar className={styles.avatar}>
            <User size={60} />
          </Avatar>
          <Box className={styles.profileInfo}>
            <Typography variant="h5" className={styles.name}>
              {profile.full_name || 'Chưa cập nhật'}
            </Typography>
            <Typography variant="body2" className={styles.username}>
              @{profile.username}
            </Typography>
            <Box className={styles.metadata}>
              <Box className={styles.metaItem}>
                <Mail size={16} />
                <span>{profile.email}</span>
              </Box>
              <Box className={styles.metaItem}>
                <Calendar size={16} />
                <span>Tham gia: {formatDate(profile.date_joined)}</span>
              </Box>
              {profile.role && (
                <Box className={styles.metaItem}>
                  <User size={16} />
                  <span>{getRoleText(profile.role)}</span>
                </Box>
              )}
            </Box>
          </Box>
        </Box>

        <Divider />

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          className={styles.tabs}
          variant="fullWidth"
        >
          <Tab
            label="Thông tin cá nhân"
            icon={<User size={20} />}
            iconPosition="start"
          />
          <Tab
            label="Đổi mật khẩu"
            icon={<Lock size={20} />}
            iconPosition="start"
          />
        </Tabs>

        <Box className={styles.tabContent}>
          {activeTab === 0 ? (
            <form onSubmit={handleProfileSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Họ và tên"
                    name="full_name"
                    value={profileForm.full_name}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                    disabled={updating}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <User size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={profileForm.email}
                    onChange={handleProfileChange}
                    fullWidth
                    required
                    disabled={updating}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail size={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth disabled={updating}>
                    <InputLabel>Giới tính</InputLabel>
                    <Select
                      name="gender"
                      value={profileForm.gender}
                      onChange={handleProfileChange}
                      label="Giới tính"
                    >
                      <MenuItem value="">Chọn giới tính</MenuItem>
                      <MenuItem value="male">Nam</MenuItem>
                      <MenuItem value="female">Nữ</MenuItem>
                      <MenuItem value="other">Khác</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Save size={20} />}
                    disabled={updating}
                    fullWidth
                  >
                    {updating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          ) : (
            <form onSubmit={handlePasswordSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Mật khẩu hiện tại"
                    name="old_password"
                    type={showOldPassword ? 'text' : 'password'}
                    value={passwordForm.old_password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    disabled={updating}
                    placeholder="Nhập mật khẩu hiện tại"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            edge="end"
                          >
                            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Mật khẩu mới"
                    name="new_password"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordForm.new_password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    disabled={updating}
                    placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            edge="end"
                          >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    label="Xác nhận mật khẩu mới"
                    name="confirm_new_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordForm.confirm_new_password}
                    onChange={handlePasswordChange}
                    fullWidth
                    required
                    disabled={updating}
                    placeholder="Nhập lại mật khẩu mới"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock size={20} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<Lock size={20} />}
                    disabled={updating}
                    fullWidth
                  >
                    {updating ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Box>
      </Card>
    </div>
  );
};

export default AdminProfile;
