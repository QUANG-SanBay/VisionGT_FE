import React, { useState, useEffect } from 'react';
import styles from './UploadBox.module.scss';
import { Upload, Loader2, Image as ImageIcon, Video } from 'lucide-react';

const UploadBox = ({ onDetected, loading }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    useEffect(() => {
        return () => { if (preview) URL.revokeObjectURL(preview); };
    }, [preview]);

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
                    <p>Tải lên Ảnh hoặc Video giao thông</p>
                    <span>Hệ thống AI sẽ tự động nhận diện biển báo</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} hidden />
                </label>
            ) : (
                <div className={styles.previewWrapper}>
                    {isVideo ? (
                        <video src={preview} className={styles.imgPreview} controls />
                    ) : (
                        <img src={preview} alt="Preview" className={styles.imgPreview} />
                    )}
                    <div className={styles.actionGroup}>
                        <button className={styles.btnMain} onClick={() => onDetected(file)} disabled={loading}>
                            {loading ? <Loader2 className={styles.spin} /> : "Bắt đầu phân tích AI"}
                        </button>
                        <button className={styles.btnReset} onClick={() => {setPreview(null); setFile(null);}} disabled={loading}>
                            Chọn file khác
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadBox;