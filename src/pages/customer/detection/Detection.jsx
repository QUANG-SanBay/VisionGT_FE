import React, { useState } from 'react';
import styles from './Detection.module.scss';
import UploadBox from './components/uploadBox/UploadBox';
import ResultBox from './components/resultBox/ResultBox';
import detectionApi from '../../../api/detectionApi';
import { AlertCircle, CheckCircle } from 'lucide-react';

const Detection = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleDetect = async (file) => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await detectionApi.uploadAndDetect(file);
            // Backend returns: { results: [RecognitionResult], image: "url" }
            const processedData = {
                image: response.data.image,
                signs: response.data.results?.map(result => ({
                    id: result.traffic_sign.id,
                    name: result.traffic_sign.name,
                    classification: result.traffic_sign.classification,
                    suggestion: result.traffic_sign.suggestion,
                    bounding_box: result.bounding_box,
                    confidence: Math.round(result.confidence_score * 100)
                })) || []
            };
            setResult(processedData);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            setError("Không thể kết nối đến server. Hiển thị dữ liệu mẫu.");
            
            // Demo data matching RecognitionResult structure
            setResult({
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2NjYyIvPjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjEyMCIgaGVpZ2h0PSIxMjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2ZmMDAwMCIgc3Ryb2tlLXdpZHRoPSIzIi8+PHRleHQgeD0iNjAiIHk9IjMwIiBmb250LXNpemU9IjE2IiBmaWxsPSIjZmYwMDAwIj5QLjEwMjwvdGV4dD48L3N2Zz4=',
                signs: [
                    { 
                        id: 'P.102', 
                        name: 'Cấm đi ngược chiều', 
                        classification: 'Biển báo cấm - Cấm các hành vi nguy hiểm hoặc vi phạm quy tắc giao thông',
                        suggestion: 'Tuân thủ hướng chiều giao thông, chỉ đi theo chiều mũi tên trên biển báo',
                        bounding_box: { x: 50, y: 50, width: 120, height: 120 },
                        confidence: 98
                    },
                    { 
                        id: 'V.1', 
                        name: 'Vượt tốc độ', 
                        classification: 'Biển báo hiệu lệnh - Bắt buộc người tham gia giao thông phải tuân thủ',
                        suggestion: 'Giảm tốc độ, tuân thủ giới hạn tốc độ quy định để đảm bảo an toàn',
                        bounding_box: { x: 200, y: 150, width: 100, height: 100 },
                        confidence: 85
                    }
                ]
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.detectionPage}>
            {!result ? (
                <>
                    {(error || success) && (
                        <div className={styles.alertContainer}>
                            {error && (
                                <div className={styles.errorAlert}>
                                    <AlertCircle size={18} strokeWidth={2} />
                                    <span>{error}</span>
                                </div>
                            )}
                            {success && (
                                <div className={styles.successAlert}>
                                    <CheckCircle size={18} strokeWidth={2} />
                                    <span>Phân tích thành công!</span>
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.uploadSection}>
                        <UploadBox onDetected={handleDetect} loading={loading} />
                    </div>
                </>
            ) : (
                <ResultBox data={result} onBack={() => {
                    setResult(null);
                    setError(null);
                    setSuccess(false);
                }} />
            )}
        </div>
    );
};

export default Detection;