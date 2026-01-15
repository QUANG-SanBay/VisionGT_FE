import React, { useState } from 'react';
import styles from './ResultBox.module.scss';
import { 
    ArrowLeft, Gauge, History, Search, 
    Loader2, Scale, AlertCircle, Info
} from 'lucide-react';
import detectionApi from '../../../../../api/detectionApi';

const ResultBox = ({ data, onBack }) => {
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const handleViewDetail = async () => {
        setLoadingDetail(true);
        try {
            const response = await detectionApi.getDetectionDetail(data.detection_id);
            setDetailData(response.data);
        } catch (error) {
            alert("Không thể tải chi tiết pháp luật.");
        } finally {
            setLoadingDetail(false);
        }
    };

    const summaryEntries = Object.entries(data.signs_summary || {});

    return (
        <div className={styles.scrollWrapper}>
            {/* Header */}
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <button className={styles.backBtn} onClick={onBack}>
                        <ArrowLeft size={18} /> Quay lại
                    </button>
                    <div className={styles.mainTitle}>
                        <h1>Kết quả nhận diện lần {data.detection_id}</h1>
                        <span className={styles.statusBadge}>Hoàn tất</span>
                    </div>
                    <div className={styles.dateTime}>
                        {new Date(data.created_at).toLocaleString('vi-VN')}
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.layoutGrid}>
                    
                    {/* CỘT TRÁI */}
                    <div className={styles.leftColumn}>
                        <div className={styles.mediaContainer}>
                            <div className={styles.cardHeader}>
                                <Info size={16} /> Hình ảnh nhận diện thực tế
                            </div>
                            <div className={styles.imageBox}>
                                {data.file_type === 'video' ? (
                                    <video src={data.output_file} controls autoPlay className={styles.displayMedia} />
                                ) : (
                                    <img src={data.output_file} alt="Result" className={styles.displayMedia} />
                                )}
                            </div>
                        </div>

                        {/* CHI TIẾT PHÁP LUẬT */}
                        {detailData && (
                            <div className={styles.detailSection}>
                                <div className={styles.sectionHeading}>
                                    <Scale size={22} />
                                    <h2>Chi tiết quy định pháp luật & Mức phạt</h2>
                                </div>
                                <div className={styles.lawCardsGrid}>
                                    {detailData.detected_signs?.map((sign, index) => (
                                        <div key={index} className={styles.lawCard}>
                                            <div className={styles.lawCardHeader}>
                                                <span className={styles.signCode}>{sign.traffic_sign.sign_Code}</span>
                                                <h3 className={styles.signName}>{sign.traffic_sign.name}</h3>
                                            </div>
                                            <div className={styles.lawCardBody}>
                                                <div className={styles.infoGroup}>
                                                    <label>Phân loại:</label>
                                                    <span>{sign.traffic_sign.category || 'Biển báo giao thông'}</span>
                                                </div>
                                                <div className={styles.descriptionText}>
                                                    {sign.traffic_sign.description}
                                                </div>
                                                <div className={styles.penaltyBox}>
                                                    <div className={styles.penaltyTitle}>
                                                        <AlertCircle size={16} /> Mức xử phạt vi phạm:
                                                    </div>
                                                    <div className={styles.penaltyContent}>
                                                        {sign.traffic_sign.penalty_details}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* CỘT PHẢI */}
                    <div className={styles.rightColumn}>
                        <div className={styles.actionCard}>
                            <div className={styles.totalStats}>
                                <span className={styles.statLabel}>Phát hiện được</span>
                                <div className={styles.statValue}>{summaryEntries.length} <span>loại biển</span></div>
                            </div>
                            <button 
                                className={styles.lookupBtn} 
                                onClick={handleViewDetail} 
                                disabled={loadingDetail || detailData}
                            >
                                {loadingDetail ? <Loader2 className={styles.spin} /> : <Search size={18} />}
                                {detailData ? "Đã hiển thị chi tiết" : "Tra cứu luật giao thông"}
                            </button>
                        </div>

                        <div className={styles.summaryCard}>
                            <h3>Tóm tắt nhận diện</h3>
                            <div className={styles.summaryList}>
                                {summaryEntries.length > 0 ? (
                                    summaryEntries.map(([name, info], index) => (
                                        <div key={index} className={styles.summaryItem}>
                                            <div className={styles.itemTop}>
                                                <span className={styles.itemName}>{name}</span>
                                                <span className={styles.itemCount}>Số lượng biển: x{info.count}</span>
                                            </div>
                                            <div className={styles.itemBottom}>
                                                <span>
                                                    <Gauge size={12} /> 
                                                    Độ tin tưởng: {Math.round(info.avg_confidence * 100)}%
                                                </span>
                                                {info.total_duration > 0 && (
                                                    <span><History size={12} /> {info.total_duration.toFixed(1)}s</span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.empty}>Không có dữ liệu</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResultBox;