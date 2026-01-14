import React, { useState } from 'react';
import styles from './Detection.module.scss';
import UploadBox from './components/uploadBox/UploadBox';
import ResultBox from './components/resultBox/ResultBox';
import detectionApi from '../../../api/detectionApi';
import { AlertCircle } from 'lucide-react';

const Detection = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleDetect = async (file) => {
        setLoading(true);
        setError(null);

        try {
            const response = await detectionApi.uploadAndDetect(file);
            const resData = response.data;

            if (resData.success) {
                setResult({
                    detection_id: resData.detection_id,
                    file_type: resData.file_type || resData.data.file_type,
                    output_file: resData.data.output_file,
                    signs_summary: resData.data.signs_summary || {},
                    created_at: resData.data.created_at
                });
            } else {
                setError(resData.message || "Không thể nhận diện");
            }
        } catch (err) {
            setError("Lỗi kết nối Server. Vui lòng kiểm tra lại API.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        /* SỬA DÒNG NÀY: Thêm class resultMode nếu có biến result */
        <div className={`${styles.detectionPage} ${result ? styles.resultMode : ''}`}>
            {error && (
                <div className={styles.errorAlert}>
                    <AlertCircle size={20} /> {error}
                </div>
            )}
            
            {!result ? (
                <div className={styles.uploadSection}>
                    <UploadBox onDetected={handleDetect} loading={loading} />
                </div>
            ) : (
                <ResultBox data={result} onBack={() => setResult(null)} />
            )}
        </div>
    );
};

export default Detection;