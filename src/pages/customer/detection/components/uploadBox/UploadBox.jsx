import React, { useState, useEffect } from 'react';
import styles from './UploadBox.module.scss';
import { Upload, Loader2 } from 'lucide-react';

const UploadBox = ({ onDetected, loading }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

    // Reset preview và file khi có kết quả mới (component được render lại với loading = false)
    useEffect(() => {
        if (!loading && preview) {
            console.log('🔄 Resetting upload preview after detection');
            if (preview) URL.revokeObjectURL(preview);
            setPreview(null);
            setFile(null);
        }
    }, [loading]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const isVideo = file?.type.startsWith('video');

    return (
        <div className={styles.uploadContainer}>
            {!preview ? (
                <label className={styles.dropzone}>
                    <div className={styles.iconBox}><Upload size={40} /></div>
                    <p>Nhấn vào đây để tải ảnh/video</p>
                    <span>Hệ thống AI sẽ tự động phân tích</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} hidden />
                </label>
            ) : (
                <div className={styles.previewWrapper}>
                    {isVideo ? (
                        <video src={preview} className={styles.imgPreview} muted />
                    ) : (
                        <img src={preview} alt="Preview" className={styles.imgPreview} />
                    )}
                    
                    {loading && <div className={styles.scanningLine}></div>}

                    <div className={styles.actionGroup}>
                        <button className={styles.btnMain} onClick={() => onDetected(file)} disabled={loading}>
                            {loading ? <><Loader2 className={styles.spin} /> Đang xử lý...</> : "Bắt đầu nhận diện"}
                        </button>
                        <button className={styles.btnReset} onClick={() => {setPreview(null); setFile(null);}} disabled={loading}>
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadBox;