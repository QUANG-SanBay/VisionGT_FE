import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styles from './Detection.module.scss';
import ResultBox from './components/resultBox/ResultBox';
import detectionApi from '../../../api/detectionApi';
import { AlertCircle } from 'lucide-react';

const Detection = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Debug: Kiểm tra component re-render
    useEffect(() => {
        console.log('🔄 Detection component render', {
            hasResult: !!result,
            detectionId: result?.detection_id,
            timestamp: new Date().toLocaleTimeString()
        });
    });

    const handleDetect = useCallback(async (file) => {
        console.log('🚀 Starting detection...');
        // Reset kết quả cũ trước khi bắt đầu detection mới
        setResult(null);
        setLoading(true);
        setError(null);
        try {
            const response = await detectionApi.uploadAndDetect(file);
            const resData = response.data;
            
            console.log('✅ Detection response:', resData);
            
            if (resData.success) {
                const newResult = {
                    detection_id: resData.detection_id,
                    file_type: resData.file_type || resData.data?.file_type,
                    output_file: resData.data?.output_file,
                    signs_summary: resData.data?.signs_summary || {},
                    duration: resData.data?.duration,
                    created_at: resData.data?.created_at
                };
                
                console.log('📦 Setting result:', newResult);
                setResult(newResult);
            } else {
                setError(resData.message || "Không thể nhận diện");
            }
        } catch (err) {
            console.error('❌ Detection error:', err);
            setError("Lỗi kết nối Server.");
        } finally {
            setLoading(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        console.log('🔄 Reset detection');
        setResult(null);
        setError(null);
    }, []);

    // Sử dụng useMemo để tránh tạo object mới mỗi lần render
    const memoizedResult = useMemo(() => result, [result?.detection_id]);
    
    return (
        <div className={styles.detectionPage}>
            <div className={styles.pageContainer}>
                {error && (
                    <div className={styles.errorAlert}>
                        <AlertCircle size={20} /> {error}
                    </div>
                )}
                <ResultBox 
                    data={memoizedResult} 
                    onBack={handleReset} 
                    onDetect={handleDetect} 
                    loading={loading} 
                />
            </div>
        </div>
    );
};

export default Detection;