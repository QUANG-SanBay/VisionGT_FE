import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Box,
    CircularProgress,
    Alert,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from 'lucide-react';
import styles from './Detections.module.scss';
import detectionApi from '../../../api/detectionApi';

const DetectionList = () => {
    const navigate = useNavigate();
    const [detections, setDetections] = useState([]);
    const [filteredDetections, setFilteredDetections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch dữ liệu từ API
    useEffect(() => {
        fetchDetections();
    }, []);

    // Lọc dữ liệu khi searchTerm thay đổi
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredDetections(detections);
        } else {
            const filtered = detections.filter((detection) =>
                detection.id?.toString().includes(searchTerm) ||
                detection.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredDetections(filtered);
        }
    }, [searchTerm, detections]);

    const fetchDetections = async () => {
        try {
            setLoading(true);
            const response = await detectionApi.getAllDetections();
            setDetections(response.data || []);
            setError(null);
        } catch (err) {
            console.error('Lỗi fetch dữ liệu:', err);
            setError('Không thể tải dữ liệu. Vui lòng thử lại!');
            // Mock data để demo
            setDetections([
                {
                    id: 1,
                    name: 'Cấm đi ngược chiều',
                    type: 'P.102',
                    image: 'https://via.placeholder.com/100',
                    detectedAt: '2024-01-08',
                    confidence: 99,
                },
                {
                    id: 2,
                    name: 'Cấm dừng xe',
                    type: 'P.103',
                    image: 'https://via.placeholder.com/100',
                    detectedAt: '2024-01-07',
                    confidence: 95,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        navigate(`/admin/detections/${id}`);
    };

    const handleRefresh = () => {
        fetchDetections();
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
        <div className={styles.detectionListPage}>
            <Box className={styles.header}>
                <h1>Danh sách biển báo</h1>
                <Button variant="contained" onClick={handleRefresh} color="primary">
                    Làm mới
                </Button>
            </Box>

            {error && (
                <Alert severity="warning" style={{ marginBottom: '16px' }}>
                    {error}
                </Alert>
            )}

            <Box className={styles.searchBox}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm theo ID hoặc tên..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon size={20} />
                            </InputAdornment>
                        ),
                    }}
                    fullWidth
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: '#f5f5f5' }}>
                            <TableCell align="center"><strong>ID</strong></TableCell>
                            <TableCell><strong>Ảnh</strong></TableCell>
                            <TableCell><strong>Loại biển báo</strong></TableCell>
                            <TableCell align="center"><strong>Độ chính xác</strong></TableCell>
                            <TableCell><strong>Ngày phát hiện</strong></TableCell>
                            <TableCell align="center"><strong>Hành động</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredDetections.length > 0 ? (
                            filteredDetections.map((detection) => (
                                <TableRow key={detection.id} hover>
                                    <TableCell align="center">{detection.id}</TableCell>
                                    <TableCell>
                                        <img
                                            src={detection.image}
                                            alt={detection.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div>
                                            <div><strong>{detection.type}</strong></div>
                                            <div style={{ fontSize: '12px', color: '#666' }}>
                                                {detection.name}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">{detection.confidence}%</TableCell>
                                    <TableCell>{detection.detectedAt}</TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleViewDetail(detection.id)}
                                            color="primary"
                                        >
                                            Xem chi tiết
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center" style={{ padding: '32px' }}>
                                    Không tìm thấy dữ liệu
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box className={styles.footer}>
                <p>Tổng cộng: {filteredDetections.length} biển báo</p>
            </Box>
        </div>
    );
};

export default DetectionList;
