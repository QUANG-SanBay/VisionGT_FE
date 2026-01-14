import React, { useState } from 'react';
import styles from './Detection.module.scss';
import UploadBox from './components/uploadBox/UploadBox';
import ResultBox from './components/resultBox/ResultBox';
import detectionApi from '../../../api/detectionApi'; // Đường dẫn tới file API 

const Detection = () => {
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Thêm state để quản lý lỗi

    const handleDetect = async (file) => {
        setLoading(true);
        setError(null); // Reset lỗi mỗi lần upload
        setResult(null); // Xóa kết quả cũ
        try {
            // Gọi API thực tế
            const response = await detectionApi.uploadAndDetect(file); // `file` ở đây là file ảnh/video

            // Dựa vào API_DOCUMENTATION.md, dữ liệu chi tiết nằm trong response.data.data
            if (response.data && response.data.success) {
                // Backend trả về data đúng cấu trúc, gán vào state result
                setResult(response.data.data);
            } else {
                // Xử lý trường hợp API trả về success: false nhưng không ném lỗi (ví dụ: file không hợp lệ)
                setError(response.data.message || "Có lỗi xảy ra từ máy chủ.");
            }

        } catch (err) {
            console.error("Lỗi kết nối API:", err);
            // Xử lý lỗi mạng hoặc lỗi server 500
            const errorMessage = err.response?.data?.message || "Không thể kết nối tới máy chủ. Vui lòng thử lại sau.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.detectionPage}>
            <h1 className={styles.title}>Nhận diện biển báo giao thông</h1>
            {error && <p style={{color: 'red', textAlign: 'center'}}>{error}</p>}
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