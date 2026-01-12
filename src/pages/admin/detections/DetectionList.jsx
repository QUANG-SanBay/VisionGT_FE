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
import { Search as SearchIcon, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
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
            <Box className={styles.headerSection}>
                <h1 className={styles.pageTitle}>🚗 Quản Lý Phát Hiện Biển Báo</h1>
                <p className={styles.pageSubtitle}>Danh sách toàn bộ biển báo đã được hệ thống nhận diện</p>
            </Box>

            <Box className={styles.toolbarSection}>
                <Box className={styles.searchBox}>
                    <TextField
                        variant="outlined"
                        placeholder="🔍 Tìm kiếm theo ID hoặc tên..."
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
                        className={styles.searchInput}
                    />
                </Box>
                <Button 
                    variant="contained" 
                    onClick={handleRefresh} 
                    color="primary"
                    startIcon={<RefreshCw size={20} />}
                    className={styles.refreshBtn}
                >
                    Làm mới
                </Button>
            </Box>

            {error && (
                <Alert severity="warning" style={{ marginBottom: '20px' }} icon={<AlertTriangle size={20} />}>
                    {error}
                </Alert>
            )}

            {filteredDetections.length > 0 ? (
                <>
                    <Box className={styles.statsBox}>
                        <Box className={styles.statItem}>
                            <span className={styles.statLabel}>Tổng phát hiện</span>
                            <span className={styles.statNumber}>{filteredDetections.length}</span>
                        </Box>
                        <Box className={styles.statItem}>
                            <span className={styles.statLabel}>Độ chính xác TB</span>
                            <span className={styles.statNumber}>
                                {Math.round(
                                    filteredDetections.reduce((sum, d) => sum + (d.confidence || 0), 0) /
                                    filteredDetections.length
                                )}%
                            </span>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} className={styles.tableContainer}>
                        <Table>
                            <TableHead>
                                <TableRow className={styles.tableHeader}>
                                    <TableCell align="center" className={styles.headerCell}>ID</TableCell>
                                    <TableCell className={styles.headerCell}>Ảnh</TableCell>
                                    <TableCell className={styles.headerCell}>Loại Biển Báo</TableCell>
                                    <TableCell align="center" className={styles.headerCell}>Độ Chính Xác</TableCell>
                                    <TableCell className={styles.headerCell}>Ngày Phát Hiện</TableCell>
                                    <TableCell align="center" className={styles.headerCell}>Hành Động</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredDetections.map((detection) => (
                                    <TableRow key={detection.id} className={styles.tableRow}>
                                        <TableCell align="center" className={styles.idCell}>
                                            <Box className={styles.idBadge}>#{detection.id}</Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className={styles.imageWrapper}>
                                                <img
                                                    src={detection.image}
                                                    alt={detection.name}
                                                    className={styles.signImage}
                                                />
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <Box className={styles.typeInfo}>
                                                <Box className={styles.typeBadge}>{detection.type}</Box>
                                                <span className={styles.typeName}>{detection.name}</span>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Box className={styles.confidenceBar}>
                                                <Box 
                                                    className={styles.confidenceFill}
                                                    style={{ width: `${detection.confidence}%` }}
                                                />
                                                <span className={styles.confidenceText}>{detection.confidence}%</span>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <span className={styles.dateText}>{detection.detectedAt}</span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handleViewDetail(detection.id)}
                                                startIcon={<Eye size={16} />}
                                                className={styles.viewBtn}
                                            >
                                                Chi tiết
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </>
            ) : (
                <Card className={styles.emptyCard}>
                    <AlertTriangle size={48} className={styles.emptyIcon} />
                    <p className={styles.emptyText}>Không tìm thấy dữ liệu</p>
                </Card>
            )}
        </div>
    );
};

export default DetectionList;
