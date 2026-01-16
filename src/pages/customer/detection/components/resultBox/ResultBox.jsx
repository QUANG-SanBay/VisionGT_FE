import React, { useState } from 'react';
import styles from './ResultBox.module.scss';
import { 
    RefreshCcw, Gauge, History, Search, 
    Loader2, Scale, AlertCircle, Info, LayoutDashboard, FileText
} from 'lucide-react';
import detectionApi from '../../../../../api/detectionApi';
import UploadBox from '../uploadBox/UploadBox';

const ResultBox = ({ data, onBack, onDetect, loading }) => {
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const handleViewDetail = async () => {
        if (!data) return;
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

    const summaryEntries = data ? Object.entries(data.signs_summary || {}) : [];

    return (
        <div className={styles.scrollWrapper}>
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.mainTitle}>
                        <LayoutDashboard size={28} color="#2563eb" />
                        <h1>{data ? `Phiên nhận diện #${data.detection_id}` : 'Hệ thống nhận diện AI'}</h1>
                        <span className={`${styles.statusBadge} ${!data ? styles.waiting : ''}`}>
                            {data ? 'ĐÃ HOÀN TẤT' : 'CHỜ TẢI LÊN'}
                        </span>
                    </div>
                    <div className={styles.rightHeader}>
                        <button className={styles.backBtn} onClick={onBack}>
                            <RefreshCcw size={18} /> Làm mới hệ thống
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.layoutGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.mediaContainer}>
                            <div className={styles.cardHeader}>
                                <Info size={18} /> {data ? "HÌNH ẢNH SAU PHÂN TÍCH" : "CHƯA CÓ DỮ LIỆU ĐẦU VÀO"}
                            </div>
                            <div className={styles.imageBox}>
                                {data ? (
                                    data.file_type === 'video' ? (
                                        <video src={data.output_file} controls autoPlay className={styles.displayMedia} />
                                    ) : (
                                        <img src={data.output_file} alt="Result" className={styles.displayMedia} />
                                    )
                                ) : (
                                    <UploadBox onDetected={onDetect} loading={loading} />
                                )}
                            </div>
                        </div>

                        {/* QUAN TRỌNG: Chỉ hiện khung này khi CÓ data và CÓ detailData */}
                        {data && detailData && (
                            <div className={styles.detailSection}>
                                <div className={styles.sectionHeading}>
                                    <Scale size={24} />
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
                                                <div className={styles.infoGroup}><label>Phân loại:</label><span>{sign.traffic_sign.category}</span></div>
                                                <p className={styles.descriptionText}>{sign.traffic_sign.description}</p>
                                                <div className={styles.penaltyBox}>
                                                    <div className={styles.penaltyTitle}><AlertCircle size={18} /> Mức xử phạt:</div>
                                                    <div className={styles.penaltyContent}>{sign.traffic_sign.penalty_details}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.actionCard}>
                            <div className={styles.totalStats}>
                                <span className={styles.statLabel}>Phát hiện được</span>
                                <div className={styles.statValue}>{summaryEntries.length} <span>loại biển</span></div>
                            </div>
                            <button className={styles.lookupBtn} onClick={handleViewDetail} disabled={loadingDetail || !!detailData || !data}>
                                {loadingDetail ? <Loader2 className={styles.spin} /> : <Search size={20} />}
                                {detailData ? "ĐÃ TRA CỨU XONG" : "TRA CỨU LUẬT CHI TIẾT"}
                            </button>
                        </div>

                        <div className={styles.summaryCard}>
                            <h3><FileText size={20} color="#2563eb" /> Tóm tắt kết quả</h3>
                            <div className={styles.summaryList}>
                                {summaryEntries.length > 0 ? (
                                    summaryEntries.map(([name, info], index) => (
                                        <div key={index} className={styles.summaryItem}>
                                            <div className={styles.itemTop}>
                                                <span className={styles.itemName}>{name}</span>
                                                <span className={styles.itemCount}>x{info.count}</span>
                                            </div>
                                            <div className={styles.itemBottom}>
                                                <span><Gauge size={14} /> Tin tưởng: {Math.round(info.avg_confidence * 100)}%</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.empty}>Chờ dữ liệu phân tích...</div>
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