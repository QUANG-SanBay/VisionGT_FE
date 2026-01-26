import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Alert,
  CircularProgress,
  InputAdornment,
  Tooltip,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
  UserCheck,
  UserX,
} from 'lucide-react';
import userApi from '../../../api/userApi';
import styles from './Users.module.scss';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // view, create, edit
  const [formData, setFormData] = useState({
    email: '',
    input_full_name: '',
    password: '',
    password2: '',
    gender: 'other',
    role: 'customer',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Helper function
  const isEmpty = (value) => {
    return value === null || value === undefined || String(value).trim() === '';
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userApi.getAllUsers();
      setUsers(response.data.users || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, user = null) => {
    setDialogMode(mode);
    if (user) {
      setSelectedUser(user);
      if (mode === 'edit') {
        setFormData({
          email: user.email || '',
          input_full_name: user.full_name || '',
          password: '',
          password2: '',
          gender: user.gender || 'other',
          role: user.role || 'customer',
        });
      }
    } else {
      setFormData({
        email: '',
        input_full_name: '',
        password: '',
        password2: '',
        gender: 'other',
        role: 'customer',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
    setFormData({
      email: '',
      input_full_name: '',
      password: '',
      password2: '',
      gender: 'other',
      role: 'customer',
    });
  };

  const handleViewDetail = async (userId) => {
    try {
      setDetailLoading(true);
      setOpenDialog(true);
      setDialogMode('view');
      const response = await userApi.getUserDetail(userId);
      const userData = response.data.user || response.data;
      setSelectedUser(userData);
    } catch (err) {
      console.error('Error fetching user detail:', err);
      setError('Không thể tải chi tiết người dùng');
      setOpenDialog(false);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateUser = async () => {
    // Validate required fields
    if (!formData.email || !formData.email.trim()) {
      setError('Email là bắt buộc');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!formData.input_full_name || !formData.input_full_name.trim()) {
      setError('Tên đầy đủ là bắt buộc');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!formData.password || !formData.password.trim()) {
      setError('Mật khẩu là bắt buộc');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (!formData.password2 || !formData.password2.trim()) {
      setError('Xác nhận mật khẩu là bắt buộc');
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (formData.password !== formData.password2) {
      setError('Mật khẩu không khớp');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const createData = {
        email: formData.email.trim(),
        input_full_name: formData.input_full_name.trim(),
        password: formData.password,
        password2: formData.password2,
        gender: formData.gender || 'other',
        role: formData.role || 'customer',
      };

      console.log('=== CREATE USER DEBUG ===');
      console.log('Sending data:', createData);
      console.log('Data as JSON:', JSON.stringify(createData, null, 2));

      const response = await userApi.createUser(createData);
      console.log('Create response:', response);

      setSuccess('Tạo người dùng thành công');
      handleCloseDialog();
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating user:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error ||
                       JSON.stringify(err.response?.data) ||
                       'Không thể tạo người dùng';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleUpdateUser = async () => {
    // Validate required fields
    if (!formData.input_full_name || !formData.input_full_name.trim()) {
      setError('Tên đầy đủ là bắt buộc');
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      const updateData = {
        email: selectedUser.email, // Gửi lại email hiện tại (không cho đổi)
        input_full_name: formData.input_full_name.trim(),
        gender: formData.gender || 'other',
        role: formData.role || 'customer',
      };

      // Chỉ thêm password nếu có nhập
      if (formData.password && formData.password.trim()) {
        if (!formData.password2 || !formData.password2.trim()) {
          setError('Vui lòng xác nhận mật khẩu mới');
          setTimeout(() => setError(null), 3000);
          return;
        }
        if (formData.password !== formData.password2) {
          setError('Mật khẩu không khớp');
          setTimeout(() => setError(null), 3000);
          return;
        }
        updateData.password = formData.password;
        updateData.password2 = formData.password2;
      }

      console.log('=== UPDATE USER DEBUG ===');
      console.log('User ID:', selectedUser.id);
      console.log('Sending data:', updateData);
      console.log('Data as JSON:', JSON.stringify(updateData, null, 2));

      const response = await userApi.updateUser(selectedUser.id, updateData);
      console.log('Update response:', response);

      setSuccess('Cập nhật người dùng thành công');
      handleCloseDialog();
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating user:', err);
      console.error('Error response:', err.response?.data);
      const errorMsg = err.response?.data?.message || 
                       err.response?.data?.error ||
                       JSON.stringify(err.response?.data) ||
                       'Không thể cập nhật người dùng';
      setError(errorMsg);
      setTimeout(() => setError(null), 5000);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return;
    }

    try {
      await userApi.deleteUser(userId);
      setSuccess('Xóa người dùng thành công');
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Không thể xóa người dùng');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleToggleActive = async (userId, isActive) => {
    try {
      if (isActive) {
        await userApi.deactivateUser(userId);
        setSuccess('Vô hiệu hóa tài khoản thành công');
      } else {
        await userApi.activateUser(userId);
        setSuccess('Kích hoạt tài khoản thành công');
      }
      fetchUsers();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error toggling user status:', err);
      setError(err.response?.data?.message || 'Không thể thay đổi trạng thái');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      staff: 'warning',
      customer: 'info',
    };
    return colors[role] || 'default';
  };

  const getRoleText = (role) => {
    const roles = {
      admin: 'Quản trị viên',
      staff: 'Nhân viên',
      customer: 'Khách hàng',
    };
    return roles[role] || role;
  };

  const getGenderText = (gender) => {
    const genders = {
      male: 'Nam',
      female: 'Nữ',
      other: 'Khác',
    };
    return genders[gender] || gender;
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <CircularProgress />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Quản Lý Người Dùng</h1>
        <p>Tổng số: {users.length} người dùng</p>
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

      <Box className={styles.toolbar}>
        <TextField
          placeholder="Tìm kiếm theo email, username hoặc tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          className={styles.searchField}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={20} />
              </InputAdornment>
            ),
          }}
        />
        <Box className={styles.actions}>
          <Button
            variant="outlined"
            startIcon={<RefreshCw size={18} />}
            onClick={fetchUsers}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => handleOpenDialog('create')}
          >
            Thêm người dùng
          </Button>
        </Box>
      </Box>

      <Card className={styles.tableCard}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Tên đầy đủ</TableCell>
                <TableCell>Vai trò</TableCell>
                <TableCell>Giới tính</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <span className={styles.userId}>#{user.id}</span>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.full_name || (
                      <span className={styles.emptyValue}>Chưa cập nhật</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getRoleText(user.role)}
                      color={getRoleColor(user.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{getGenderText(user.gender)}</TableCell>
                  <TableCell>
                    <Box className={styles.statusCell}>
                      <Switch
                        checked={user.is_active}
                        onChange={() => handleToggleActive(user.id, user.is_active)}
                        size="small"
                      />
                      <span className={user.is_active ? styles.active : styles.inactive}>
                        {user.is_active ? 'Hoạt động' : 'Vô hiệu hóa'}
                      </span>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetail(user.id)}
                      >
                        <Eye size={18} />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredUsers.length === 0 && (
          <Box className={styles.emptyState}>
            <AlertCircle size={48} />
            <p>Không tìm thấy người dùng nào</p>
          </Box>
        )}
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' && 'Chi tiết người dùng'}
          {dialogMode === 'create' && 'Thêm người dùng mới'}
          {dialogMode === 'edit' && 'Chỉnh sửa người dùng'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            detailLoading ? (
              <Box className={styles.loadingDialog}>
                <CircularProgress size={40} />
                <p>Đang tải thông tin...</p>
              </Box>
            ) : selectedUser ? (
              <Box className={styles.detailView}>
                <Box className={styles.detailRow}>
                  <strong>ID:</strong>
                  <span>#{selectedUser.id}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Username:</strong>
                  <span>{selectedUser.username}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Email:</strong>
                  <span>{selectedUser.email}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Tên đầy đủ:</strong>
                  <span className={isEmpty(selectedUser.full_name) ? styles.emptyValue : ''}>
                    {isEmpty(selectedUser.full_name) ? 'Chưa cập nhật' : selectedUser.full_name}
                  </span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Giới tính:</strong>
                  <span>{getGenderText(selectedUser.gender)}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Vai trò:</strong>
                  <Chip
                    label={getRoleText(selectedUser.role)}
                    color={getRoleColor(selectedUser.role)}
                    size="small"
                  />
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Trạng thái:</strong>
                  <Chip
                    label={selectedUser.is_active ? 'Đang hoạt động' : 'Vô hiệu hóa'}
                    color={selectedUser.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Staff:</strong>
                  <Chip
                    label={selectedUser.is_staff ? 'Có' : 'Không'}
                    color={selectedUser.is_staff ? 'info' : 'default'}
                    size="small"
                  />
                </Box>
              </Box>
            ) : (
              <Box className={styles.emptyDialog}>
                <p>Không có dữ liệu</p>
              </Box>
            )
          ) : (
            <Box className={styles.formGrid}>
              <TextField
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={dialogMode === 'edit'}
                fullWidth
                required
              />
              <TextField
                label="Tên đầy đủ *"
                name="input_full_name"
                value={formData.input_full_name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label={dialogMode === 'create' ? 'Mật khẩu *' : 'Mật khẩu mới (để trống nếu không đổi)'}
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required={dialogMode === 'create'}
              />
              <TextField
                label={dialogMode === 'create' ? 'Xác nhận mật khẩu *' : 'Xác nhận mật khẩu mới'}
                name="password2"
                type="password"
                value={formData.password2}
                onChange={handleInputChange}
                fullWidth
                required={dialogMode === 'create'}
              />
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  label="Giới tính"
                >
                  <MenuItem value="male">Nam</MenuItem>
                  <MenuItem value="female">Nữ</MenuItem>
                  <MenuItem value="other">Khác</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Vai trò</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  label="Vai trò"
                >
                  <MenuItem value="customer">Khách hàng</MenuItem>
                  <MenuItem value="staff">Nhân viên</MenuItem>
                  <MenuItem value="admin">Quản trị viên</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {dialogMode === 'view' && selectedUser && (
            <>
              <Button
                color="error"
                startIcon={<Trash2 size={18} />}
                onClick={() => {
                  handleCloseDialog();
                  handleDeleteUser(selectedUser.id);
                }}
              >
                Xóa
              </Button>
              <Box sx={{ flex: 1 }} />
            </>
          )}
          <Button onClick={handleCloseDialog}>
            {dialogMode === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {dialogMode === 'view' && selectedUser && (
            <Button
              variant="contained"
              startIcon={<Edit size={18} />}
              onClick={() => {
                setDialogMode('edit');
                setFormData({
                  email: selectedUser.email || '',
                  input_full_name: selectedUser.full_name || '',
                  password: '',
                  password2: '',
                  gender: selectedUser.gender || 'other',
                  role: selectedUser.role || 'customer',
                });
              }}
            >
              Chỉnh sửa
            </Button>
          )}
          {dialogMode === 'create' && (
            <Button variant="contained" onClick={handleCreateUser}>
              Tạo mới
            </Button>
          )}
          {dialogMode === 'edit' && (
            <Button variant="contained" onClick={handleUpdateUser}>
              Cập nhật
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Users;
