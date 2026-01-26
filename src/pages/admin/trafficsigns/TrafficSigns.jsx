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
} from '@mui/material';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import trafficSignApi from '../../../api/trafficSignApi';
import styles from './TrafficSigns.module.scss';

const TrafficSigns = () => {
  const [signs, setSigns] = useState([]);
  const [filteredSigns, setFilteredSigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSign, setSelectedSign] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('view'); // view, create, edit

  // Helper function to check if a value is empty (null, undefined, empty string, or whitespace)
  const isEmpty = (value) => {
    return value === null || value === undefined || String(value).trim() === '';
  };
  const [formData, setFormData] = useState({
    sign_Code: '',
    name: '',
    description: '',
    category: '',
    image_url: '',
    penalty_details: '',
    model_class_id: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchSigns();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSigns(signs);
    } else {
      const filtered = signs.filter(
        (sign) =>
          sign.sign_Code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sign.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sign.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSigns(filtered);
    }
  }, [searchTerm, signs]);

  const fetchSigns = async () => {
    try {
      setLoading(true);
      const response = await trafficSignApi.getAllSigns();
      setSigns(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching signs:', err);
      setError('Không thể tải dữ liệu biển báo');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (mode, sign = null) => {
    setDialogMode(mode);
    if (sign) {
      setSelectedSign(sign);
      if (mode === 'edit') {
        setFormData({
          sign_Code: sign.sign_Code || '',
          name: sign.name || '',
          description: sign.description || '',
          category: sign.category || '',
          image_url: sign.image_url || '',
          penalty_details: sign.penalty_details || '',
          model_class_id: sign.model_class_id || '',
        });
      }
    } else {
      setFormData({
        sign_Code: '',
        name: '',
        description: '',
        category: '',
        image_url: '',
        penalty_details: '',
        model_class_id: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSign(null);
    setFormData({
      sign_Code: '',
      name: '',
      description: '',
      category: '',
      image_url: '',
      penalty_details: '',
      model_class_id: '',
    });
  };

  const handleViewDetail = async (signCode) => {
    try {
      setDetailLoading(true);
      setOpenDialog(true);
      setDialogMode('view');
      const response = await trafficSignApi.getSignDetail(signCode);
      
      console.log('=== API Response Debug ===');
      console.log('Full response:', response);
      console.log('response.data:', response.data);
      console.log('response.data.data:', response.data?.data);
      
      // Xử lý cả 2 cấu trúc response
      let signData;
      if (response.data?.success && response.data?.data) {
        // Cấu trúc: { success: true, data: {...} }
        signData = response.data.data;
      } else if (response.data?.data) {
        // Cấu trúc: { data: {...} }
        signData = response.data.data;
      } else {
        // Cấu trúc trực tiếp: {...}
        signData = response.data;
      }
      
      console.log('Final signData:', signData);
      console.log('penalty_details:', signData.penalty_details);
      console.log('penalty_details type:', typeof signData.penalty_details);
      console.log('penalty_details isEmpty:', isEmpty(signData.penalty_details));
      
      setSelectedSign(signData);
    } catch (err) {
      console.error('Error fetching sign detail:', err);
      setError('Không thể tải chi tiết biển báo');
      setOpenDialog(false);
      setTimeout(() => setError(null), 3000);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCreateSign = async () => {
    try {
      await trafficSignApi.createSign(formData);
      setSuccess('Tạo biển báo thành công');
      handleCloseDialog();
      fetchSigns();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error creating sign:', err);
      setError(err.response?.data?.message || 'Không thể tạo biển báo');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleUpdateSign = async () => {
    try {
      await trafficSignApi.updateSign(selectedSign.sign_Code, formData);
      setSuccess('Cập nhật biển báo thành công');
      handleCloseDialog();
      fetchSigns();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error updating sign:', err);
      setError(err.response?.data?.message || 'Không thể cập nhật biển báo');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteSign = async (signCode) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa biển báo này?')) {
      return;
    }

    try {
      await trafficSignApi.deleteSign(signCode);
      setSuccess('Xóa biển báo thành công');
      fetchSigns();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Error deleting sign:', err);
      setError(err.response?.data?.message || 'Không thể xóa biển báo');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Biển cấm': 'error',
      'Biển báo nguy hiểm': 'warning',
      'Biển hiệu lệnh': 'info',
      'Biển chỉ dẫn': 'success',
    };
    return colors[category] || 'default';
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
        <h1>Quản Lý Biển Báo Giao Thông</h1>
        <p>Tổng số: {signs.length} biển báo</p>
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
          placeholder="Tìm kiếm theo mã, tên hoặc danh mục..."
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
            onClick={fetchSigns}
          >
            Làm mới
          </Button>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => handleOpenDialog('create')}
          >
            Thêm biển báo
          </Button>
        </Box>
      </Box>

      <Card className={styles.tableCard}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã biển</TableCell>
                <TableCell>Tên biển báo</TableCell>
                <TableCell>Danh mục</TableCell>
                <TableCell>Model Class ID</TableCell>
                <TableCell align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSigns.map((sign) => (
                <TableRow key={sign.sign_Code} hover>
                  <TableCell>
                    <span className={styles.signCode}>{sign.sign_Code}</span>
                  </TableCell>
                  <TableCell>{sign.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={sign.category}
                      color={getCategoryColor(sign.category)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <span className={styles.modelId}>{sign.model_class_id}</span>
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetail(sign.sign_Code)}
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

        {filteredSigns.length === 0 && (
          <Box className={styles.emptyState}>
            <AlertCircle size={48} />
            <p>Không tìm thấy biển báo nào</p>
          </Box>
        )}
      </Card>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {dialogMode === 'view' && 'Chi tiết biển báo'}
          {dialogMode === 'create' && 'Thêm biển báo mới'}
          {dialogMode === 'edit' && 'Chỉnh sửa biển báo'}
        </DialogTitle>
        <DialogContent>
          {dialogMode === 'view' ? (
            detailLoading ? (
              <Box className={styles.loadingDialog}>
                <CircularProgress size={40} />
                <p>Đang tải thông tin...</p>
              </Box>
            ) : selectedSign ? (
              <Box className={styles.detailView}>
                <Box className={styles.detailRow}>
                  <strong>Mã biển:</strong>
                  <span>{selectedSign.sign_Code}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Tên:</strong>
                  <span>{selectedSign.name}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Mô tả:</strong>
                  <span className={isEmpty(selectedSign.description) ? styles.emptyValue : ''}>
                    {isEmpty(selectedSign.description) ? 'Chưa có mô tả' : selectedSign.description}
                  </span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Danh mục:</strong>
                  <Chip
                    label={selectedSign.category}
                    color={getCategoryColor(selectedSign.category)}
                    size="small"
                  />
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Model Class ID:</strong>
                  <span>{selectedSign.model_class_id}</span>
                </Box>
                <Box className={styles.detailRow}>
                  <strong>Mức phạt:</strong>
                  <span className={isEmpty(selectedSign.penalty_details) ? styles.emptyValue : ''}>
                    {isEmpty(selectedSign.penalty_details) ? 'Chưa có thông tin' : selectedSign.penalty_details}
                  </span>
                </Box>
                {selectedSign.image_url && (
                  <Box className={styles.detailRow}>
                    <strong>Hình ảnh:</strong>
                    <a href={selectedSign.image_url} target="_blank" rel="noopener noreferrer">
                      {selectedSign.image_url}
                    </a>
                  </Box>
                )}
                {selectedSign.created_at && (
                  <Box className={styles.detailRow}>
                    <strong>Ngày tạo:</strong>
                    <span>{new Date(selectedSign.created_at).toLocaleString('vi-VN')}</span>
                  </Box>
                )}
                {selectedSign.last_updated && (
                  <Box className={styles.detailRow}>
                    <strong>Cập nhật lần cuối:</strong>
                    <span>{new Date(selectedSign.last_updated).toLocaleString('vi-VN')}</span>
                  </Box>
                )}
              </Box>
            ) : (
              <Box className={styles.emptyDialog}>
                <p>Không có dữ liệu</p>
              </Box>
            )
          ) : (
            <Box className={styles.formGrid}>
              <TextField
                label="Mã biển *"
                name="sign_Code"
                value={formData.sign_Code}
                onChange={handleInputChange}
                disabled={dialogMode === 'edit'}
                fullWidth
                required
              />
              <TextField
                label="Tên biển báo *"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Danh mục *"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                fullWidth
                required
                placeholder="VD: Biển cấm, Biển báo nguy hiểm..."
              />
              <TextField
                label="Model Class ID *"
                name="model_class_id"
                value={formData.model_class_id}
                onChange={handleInputChange}
                fullWidth
                required
              />
              <TextField
                label="Mức phạt"
                name="penalty_details"
                value={formData.penalty_details}
                onChange={handleInputChange}
                fullWidth
                placeholder="VD: Phạt 1-2 triệu đồng"
              />
              <TextField
                label="URL hình ảnh"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                fullWidth
                placeholder="http://example.com/image.jpg"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          {dialogMode === 'view' && selectedSign && (
            <>
              <Button
                color="error"
                startIcon={<Trash2 size={18} />}
                onClick={() => {
                  handleCloseDialog();
                  handleDeleteSign(selectedSign.sign_Code);
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
          {dialogMode === 'view' && selectedSign && (
            <Button
              variant="contained"
              startIcon={<Edit size={18} />}
              onClick={() => {
                setDialogMode('edit');
                setFormData({
                  sign_Code: selectedSign.sign_Code || '',
                  name: selectedSign.name || '',
                  description: selectedSign.description || '',
                  category: selectedSign.category || '',
                  image_url: selectedSign.image_url || '',
                  penalty_details: selectedSign.penalty_details || '',
                  model_class_id: selectedSign.model_class_id || '',
                });
              }}
            >
              Chỉnh sửa
            </Button>
          )}
          {dialogMode === 'create' && (
            <Button variant="contained" onClick={handleCreateSign}>
              Tạo mới
            </Button>
          )}
          {dialogMode === 'edit' && (
            <Button variant="contained" onClick={handleUpdateSign}>
              Cập nhật
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TrafficSigns;
