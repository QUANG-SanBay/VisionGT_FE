import React, { useEffect, useState } from 'react';
import styles from './History.module.scss';
import detectionApi from '../../../api/detectionApi';
import { 
    Calendar, FileVideo, ImageIcon, 
    ChevronRight, Loader2, History as HistoryIcon, Clock
} from 'lucide-react';
import ResultBox from '../detection/components/resultBox/ResultBox';

const History = () => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const response = await detectionApi.getHistory();
            setHistory(response.data);
        } catch (err) {
            console.error("Lỗi tải lịch sử:", err);
        } finally {
            // ĐÃ XÓA DÒNG setLoadingDetail(false) GÂY LỖI TẠI ĐÂY
            setLoading(false);
        }
    };

    if (loading) return (
        <div className={styles.loadingState}>
            <Loader2 className={styles.spin} size={40} />
            <p>Đang tải dữ liệu lịch sử...</p>
        </div>
    );

    // NẾU ĐANG CHỌN XEM CHI TIẾT
    if (selectedItem) {
        return (
            <div className={styles.detailWrapper}>
                <ResultBox 
                    data={selectedItem} 
                    onBack={() => setSelectedItem(null)} 
                />
            </div>
        );
    }

    return (
        <div className={styles.historyPage}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.titleBox}>
                        <HistoryIcon size={28} color="#2563eb" />
                        <h1>Lịch sử nhận diện</h1>
                    </div>
                    <div className={styles.countBadge}>
                        {history.length} phiên đã thực hiện
                    </div>
                </div>

                <div className={styles.listContainer}>
                    {history.length > 0 ? history.map((item) => (
                        <div key={item.id} className={styles.listItem}>
                            <div className={styles.thumbnail}>
                                {item.file_type === 'video' ? (
                                    <div className={styles.videoIconBox}>
                                        <FileVideo size={24} />
                                        <span>Video</span>
                                    </div>
                                ) : (
                                    <img src={item.output_file} alt="Thumbnail" />
                                )}
                            </div>

                            <div className={styles.mainInfo}>
                                <div className={styles.topRow}>
                                    <span className={styles.sessionId}>Phiên nhận diện #{item.id}</span>
                                    <span className={`${styles.typeBadge} ${styles[item.file_type]}`}>
                                        {item.file_type.toUpperCase()}
                                    </span>
                                </div>
                                <div className={styles.bottomRow}>
                                    <span className={styles.metaItem}>
                                        <Calendar size={14} /> {new Date(item.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <Clock size={14} /> {new Date(item.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span className={styles.metaItem}>
                                        <b>{Object.keys(item.signs_summary || {}).length}</b> loại biển báo
                                    </span>
                                </div>
                            </div>

                            <div className={styles.actionArea}>
                                <button className={styles.viewBtn} onClick={() => setSelectedItem(item)}>
                                    Xem chi tiết <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <div className={styles.emptyState}>Không có dữ liệu lịch sử</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default History;