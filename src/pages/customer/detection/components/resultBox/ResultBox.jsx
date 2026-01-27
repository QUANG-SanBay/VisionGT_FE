import React, { useState, useRef, useEffect } from 'react';
import styles from './ResultBox.module.scss';
import { 
    RefreshCcw, Gauge, History, Search, 
    Loader2, Scale, AlertCircle, Info, LayoutDashboard, FileText, Clock, ArrowRight
} from 'lucide-react';
import detectionApi from '../../../../../api/detectionApi';
import UploadBox from '../uploadBox/UploadBox';
import VideoPlayer from './VideoPlayer';

const ResultBox = ({ data, onBack, onDetect, loading }) => {
    const [detailData, setDetailData] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [currentVideoTime, setCurrentVideoTime] = useState(0);
    const [expandedItems, setExpandedItems] = useState({});

    const currentId = data?.detection_id || data?.id;

    // Reset detailData khi có detection mới hoặc khi data bị xóa
    useEffect(() => {
        console.log('🔄 Detection ID changed, resetting detail data', { currentId });
        setDetailData(null);
        setExpandedItems({});
        setCurrentVideoTime(0);
    }, [currentId]);

    const handleViewDetail = async () => {
        if (!data) return;
        setLoadingDetail(true);
        try {
            const response = await detectionApi.getDetectionDetail(currentId);
            setDetailData(response.data);
        } catch (error) {
            alert("Không thể tải chi tiết pháp luật.");
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleVideoTimeUpdate = (time) => {
        setCurrentVideoTime(time);
    };

    const toggleExpanded = (index) => {
        setExpandedItems(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    // Kiểm tra xem biển báo có đang xuất hiện tại thời điểm hiện tại không
    const isSignActiveAtTime = (appearances, currentTime) => {
        if (!appearances || appearances.length === 0) return false;
        return appearances.some(app => 
            app.start_time !== undefined && 
            currentTime >= app.start_time && 
            currentTime <= app.end_time
        );
    };

    const summaryEntries = data?.signs_summary ? Object.entries(data.signs_summary) : [];

    return (
        <div className={styles.scrollWrapper}>
            <div className={styles.stickyHeader}>
                <div className={styles.headerContent}>
                    <div className={styles.mainTitle}>
                        <LayoutDashboard size={28} color="#2563eb" />
                        <div>
                            <h1>{data ? `Phiên nhận diện #${currentId}` : 'Hệ thống nhận diện biển báo'}</h1>
                            {data?.duration && (
                                <div className={styles.miniMeta}>
                                    Thời lượng: {data.duration.toFixed(2)}s
                                </div>
                            )}
                        </div>
                        <span className={`${styles.statusBadge} ${!data ? styles.waiting : ''}`}>
                            {data ? 'HOÀN TẤT' : 'SẴN SÀNG'}
                        </span>
                    </div>
                    <div className={styles.rightHeader}>
                        <button className={styles.backBtn} onClick={onBack}>
                            <RefreshCcw size={18} /> Làm mới
                        </button>
                    </div>
                </div>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.layoutGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.mediaContainer}>
                            <div className={styles.cardHeader}>
                                <Info size={18} /> {data ? "KẾT QUẢ PHÂN TÍCH" : "TẢI FILE ĐỂ BẮT ĐẦU"}
                            </div>
                            <div className={styles.imageBox}>
                                {data ? (
                                    data.file_type === 'video' ? (
                                        <VideoPlayer 
                                            src={data.output_file}
                                            className={styles.displayMedia}
                                            onTimeUpdate={handleVideoTimeUpdate}
                                        />
                                    ) : (
                                        <img src={data.output_file} alt="Result" className={styles.displayMedia} />
                                    )
                                ) : (
                                    <UploadBox onDetected={onDetect} loading={loading} />
                                )}
                            </div>
                        </div>

                        {data && detailData && (
                            <div className={styles.detailSection}>
                                <div className={styles.sectionHeading}>
                                    <Scale size={24} />
                                    <h2>Chi tiết quy định & Xử phạt</h2>
                                </div>
                                <div className={styles.lawCardsGrid}>
                                    {detailData.detected_signs?.map((sign, index) => (
                                        <div key={index} className={styles.lawCard}>
                                            <div className={styles.lawCardHeader}>
                                                <span className={styles.signCode}>{sign.traffic_sign.sign_Code}</span>
                                                <h3 className={styles.signName}>{sign.traffic_sign.name}</h3>
                                            </div>
                                            <div className={styles.lawCardBody}>
                                                <div className={styles.infoGroup}><label>Loại:</label><span>{sign.traffic_sign.category}</span></div>
                                                <p className={styles.descriptionText}>{sign.traffic_sign.description}</p>
                                                <div className={styles.penaltyBox}>
                                                    <div className={styles.penaltyTitle}><AlertCircle size={18} /> Mức phạt:</div>
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
                                <span className={styles.statLabel}>Phát hiện</span>
                                <div className={styles.statValue}>{summaryEntries.length} <span>loại biển</span></div>
                            </div>
                            <button className={styles.lookupBtn} onClick={handleViewDetail} disabled={loadingDetail || !!detailData || !data}>
                                {loadingDetail ? <Loader2 className={styles.spin} /> : <Search size={20} />}
                                Tra cứu luật chi tiết
                            </button>
                        </div>

                        <div className={styles.summaryCard}>
                            <h3><FileText size={20} color="#2563eb" /> Tóm tắt kết quả</h3>
                            <div className={styles.summaryList}>
                                {summaryEntries.length > 0 ? (
                                    summaryEntries.map(([name, info], index) => {
                                        const isActive = data?.file_type === 'video' && isSignActiveAtTime(info.appearances, currentVideoTime);
                                        const isExpanded = expandedItems[index];
                                        
                                        return (
                                            <div 
                                                key={index} 
                                                className={`${styles.summaryItem} ${isActive ? styles.activeItem : ''}`}
                                            >
                                                <div className={styles.itemTop}>
                                                    <span className={styles.itemName}>{name}</span>
                                                    <span className={styles.itemCount}>x{info.count}</span>
                                                </div>
                                                
                                                <div className={styles.itemStats}>
                                                    <span><Gauge size={14} /> Độ tin cậy TB: {Math.round(info.avg_confidence * 100)}%</span>
                                                    {data?.file_type === 'video' && info.total_duration !== undefined && (
                                                        <span><History size={14} /> Tổng TG: {info.total_duration.toFixed(2)}s</span>
                                                    )}
                                                </div>

                                                {/* NÚT XEM CHI TIẾT - CHỈ HIỆN KHI LÀ VIDEO VÀ CÓ DỮ LIỆU */}
                                                {data?.file_type === 'video' && info.appearances && info.appearances.length > 0 && (
                                                    <>
                                                        <button 
                                                            className={styles.toggleBtn}
                                                            onClick={() => toggleExpanded(index)}
                                                        >
                                                            <Clock size={14} />
                                                            {isExpanded ? 'Ẩn mốc thời gian' : 'Xem chi tiết mốc thời gian'}
                                                            <ArrowRight 
                                                                size={14} 
                                                                className={`${styles.toggleIcon} ${isExpanded ? styles.rotated : ''}`}
                                                            />
                                                        </button>
                                                        
                                                        {isExpanded && (
                                                            <div className={styles.appearancesBox}>
                                                                <div className={styles.boxLabel}>Chi tiết mốc thời gian xuất hiện:</div>
                                                                {info.appearances.map((app, idx) => (
                                                                    app.start_time !== undefined && (
                                                                        <div 
                                                                            key={idx} 
                                                                            className={`${styles.appRow} ${
                                                                                currentVideoTime >= app.start_time && 
                                                                                currentVideoTime <= app.end_time 
                                                                                    ? styles.activeAppRow 
                                                                                    : ''
                                                                            }`}
                                                                        >
                                                                            <Clock size={12} />
                                                                            <span>{app.start_time.toFixed(1)}s</span>
                                                                            <ArrowRight size={12} className={styles.arrow} />
                                                                            <span>{app.end_time.toFixed(1)}s</span>
                                                                            <span className={styles.durationTag}>({app.duration.toFixed(1)}s)</span>
                                                                            {app.confidence !== undefined && (
                                                                                <span className={styles.confidenceTag}>
                                                                                    <Gauge size={12} /> {Math.round(app.confidence * 100)}%
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                ))}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={styles.empty}>Chưa có dữ liệu phân tích.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tối ưu re-render với React.memo
export default React.memo(ResultBox, (prevProps, nextProps) => {
    // Chỉ re-render khi detection_id thay đổi
    const prevId = prevProps.data?.detection_id;
    const nextId = nextProps.data?.detection_id;
    
    const shouldNotUpdate = (
        prevId === nextId &&
        prevProps.loading === nextProps.loading
    );
    
    console.log('🔍 ResultBox memo check', {
        prevId,
        nextId,
        shouldNotUpdate,
        willUpdate: !shouldNotUpdate
    });
    
    return shouldNotUpdate;
});