import React, { useState } from 'react';
import styles from './Detection.module.scss';
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
            setError("Lỗi kết nối Server.");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setResult(null);
        setError(null);
    };

    return (
        <div className={styles.detectionPage}>
            <div className={styles.pageContainer}>
                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}
                
                {/* Dùng KEY để ép React xóa sạch dữ liệu cũ khi Reset */}
                <ResultBox 
                    key={result ? result.detection_id : 'initial'} 
                    data={result} 
                    onBack={handleReset} 
                    onDetect={handleDetect} 
                    loading={loading} 
                />
            </div>
        </div>
    );
};

export default Detection;