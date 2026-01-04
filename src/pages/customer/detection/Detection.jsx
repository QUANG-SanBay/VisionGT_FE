import React, { useState } from 'react';
import styles from './Detection.module.scss';
import UploadBox from './components/uploadBox/UploadBox';
import ResultBox from './components/resultBox/ResultBox';
import detectionApi from '../../../api/detectionApi'; // Đường dẫn tới file API của bạn

const Detection = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleDetect = async (file) => {
    setLoading(true);
    try {
        // Gọi API thực tế
        const response = await detectionApi.uploadAndDetect(file);
        
        // Giả sử Backend trả về data đúng cấu trúc { signs: [...] }
        setResult(response.data); 
        
    } catch (error) {
        console.error("Lỗi kết nối API:", error);
        // Nếu lỗi, mình có thể dùng data giả để demo giao diện trước
        setResult({
            signs: [
                { id: 'P.102', name: 'Cấm đi ngược chiều', confidence: 99, description: 'Mô tả giả định...', fine: '1.000.000đ' }
            ]
        });
        alert("Lưu ý: Đang hiển thị dữ liệu mẫu vì chưa kết nối được Server.");
    } finally {
        setLoading(false);
    }
};

    return (
        <div className={styles.detectionPage}>
            <h1 className={styles.title}>Nhận diện biển báo giao thông</h1>
            <div className={styles.content}>
                <div className={styles.left}>
                    <UploadBox onDetected={handleDetect} loading={loading} />
                </div>
                <div className={styles.right}>
                    <ResultBox data={result} />
                </div>
            </div>
        </div>
    );
};

export default Detection;