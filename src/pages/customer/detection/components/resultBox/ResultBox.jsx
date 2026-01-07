import React from 'react';
import styles from './ResultBox.module.scss';
import { AlertCircle, Inbox, ArrowLeft, MapPin, Gauge, Zap, Database, History } from 'lucide-react';

const ResultBox = ({ data, onBack }) => {
    if (!data) {
        return (
            <div className={styles.resultWrapper}>
                <h3>Kết quả phân tích</h3>
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <Inbox size={36} strokeWidth={1.5} />
                    </div>
                    <p>Chưa có kết quả</p>
                    <p className={styles.subtext}>Tải lên ảnh để bắt đầu phân tích</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.resultWrapper}>
            {/* Unified Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <button className={styles.backBtn} onClick={onBack}>
                        <ArrowLeft size={20} strokeWidth={2.5} />
                        Quay lại
                    </button>
                    <h1 className={styles.headerTitle}>Kết quả phân tích</h1>
                </div>
                <div className={styles.timestamp}>
                    <History size={16} strokeWidth={2} />
                    <div className={styles.timestampText}>
                        <div className={styles.timestampLabel}>Phân tích lúc</div>
                        <div className={styles.timestampValue}>{new Date(data.timestamp || data.signs?.[0]?.history?.timestamp || new Date()).toLocaleString('vi-VN')}</div>
                    </div>
                </div>
            </div>
            
            <div className={styles.container}>
                {data.image && (
                    <div className={styles.leftPanel}>
                        <div className={styles.annotatedImage}>
                            <img 
                                src={data.image} 
                                alt="Ảnh phân tích với khung bao" 
                            />
                        </div>
                    </div>
                )}

                <div className={styles.rightPanel}>
                    {data.signs && data.signs.length > 0 ? (
                        <>
                            <div className={styles.statsSection}>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Zap size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className={styles.statValue}>{data.signs.length}</div>
                                        <div className={styles.statLabel}>Vi phạm được phát hiện</div>
                                    </div>
                                </div>
                                <div className={styles.statCard}>
                                    <div className={styles.statIcon}>
                                        <Gauge size={24} strokeWidth={2} />
                                    </div>
                                    <div>
                                        <div className={styles.statValue}>
                                            {Math.round(data.signs.reduce((acc, s) => acc + s.confidence, 0) / data.signs.length)}%
                                        </div>
                                        <div className={styles.statLabel}>Độ chính xác trung bình</div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.signList}>
                                <h4>Chi tiết vi phạm</h4>
                                {data.signs.map((sign, index) => (
                                    <div key={index} className={styles.signCard}>
                                        <div className={styles.cardHeader}>
                                            <span className={styles.idBadge}>ID: {sign.id}</span>
                                            <span className={styles.confidenceBadge}>{sign.confidence_score || sign.confidence}%</span>
                                        </div>
                                        
                                        <div className={styles.cardContent}>
                                            <h5>{sign.name || sign.traffic_sign?.name || 'N/A'}</h5>
                                            <div className={styles.classificationBox}>
                                                <MapPin size={14} strokeWidth={2} />
                                                <span>{sign.classification || sign.traffic_sign?.classification || 'N/A'}</span>
                                            </div>
                                        </div>

                                        {/* Analysis Timestamp */}
                                        {(sign.history?.timestamp || data.timestamp) && (
                                            <div className={styles.infoSection}>
                                                <div className={styles.infoLabel}>
                                                    <History size={14} strokeWidth={2} />
                                                    Thời gian phân tích:
                                                </div>
                                                <div className={styles.timestampValue}>
                                                    {new Date(sign.history?.timestamp || data.timestamp).toLocaleString('vi-VN')}
                                                </div>
                                            </div>
                                        )}

                                        {/* Traffic Sign Information */}
                                        {sign.traffic_sign && (
                                            <div className={styles.infoSection}>
                                                <div className={styles.infoLabel}>
                                                    <Database size={14} strokeWidth={2} />
                                                    Thông tin biển báo:
                                                </div>
                                                <div className={styles.trafficSignInfo}>
                                                    {sign.traffic_sign.id && <div className={styles.infoItem}><span className={styles.infoKey}>ID:</span> <span className={styles.infoVal}>{sign.traffic_sign.id}</span></div>}
                                                    {sign.traffic_sign.name && <div className={styles.infoItem}><span className={styles.infoKey}>Tên:</span> <span className={styles.infoVal}>{sign.traffic_sign.name}</span></div>}
                                                    {sign.traffic_sign.classification && <div className={styles.infoItem}><span className={styles.infoKey}>Phân loại:</span> <span className={styles.infoVal}>{sign.traffic_sign.classification}</span></div>}
                                                    {sign.traffic_sign.description && <div className={styles.infoItem}><span className={styles.infoKey}>Mô tả:</span> <span className={styles.infoVal}>{sign.traffic_sign.description}</span></div>}
                                                </div>
                                            </div>
                                        )}

                                        {/* Recognition History */}
                                        {sign.history && (
                                            <div className={styles.infoSection}>
                                                <div className={styles.infoLabel}>
                                                    <History size={14} strokeWidth={2} />
                                                    Lịch sử nhận dạng:
                                                </div>
                                                <div className={styles.historyInfo}>
                                                    {sign.history.timestamp && <div className={styles.infoItem}><span className={styles.infoKey}>Thời gian:</span> <span className={styles.infoVal}>{new Date(sign.history.timestamp).toLocaleString('vi-VN')}</span></div>}
                                                    {sign.history.user && <div className={styles.infoItem}><span className={styles.infoKey}>Người dùng:</span> <span className={styles.infoVal}>{sign.history.user}</span></div>}
                                                    {sign.history.source && <div className={styles.infoItem}><span className={styles.infoKey}>Nguồn:</span> <span className={styles.infoVal}>{sign.history.source}</span></div>}
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className={styles.suggestionBox}>
                                            <AlertCircle size={16} strokeWidth={2} />
                                            <div>
                                                <div className={styles.suggestionLabel}>Gợi ý:</div>
                                                <div className={styles.suggestionText}>{sign.suggestion || 'Không có gợi ý'}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <Inbox size={36} strokeWidth={1.5} />
                            </div>
                            <p>Không phát hiện vi phạm</p>
                            <p className={styles.subtext}>Hãy thử tải lên ảnh khác</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultBox;