import React, { useState } from 'react';
import styles from './UploadBox.module.scss';
import { Upload, X } from 'lucide-react';

const UploadBox = ({ onDetected, loading }) => {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleReset = () => {
        setPreview(null);
        setFile(null);
    };

    return (
        <div className={styles.uploadContainer}>
            {!preview ? (
                <label className={styles.dropzone}>
                    <div className={styles.iconBox}>
                        <Upload size={40} strokeWidth={1.5} />
                    </div>
                    <p>Tải lên ảnh giao thông</p>
                    <span>JPG, PNG hoặc MP4 • Tối đa 50MB</span>
                    <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
                </label>
            ) : (
                <div className={styles.previewWrapper}>
                    <img src={preview} alt="Preview" className={styles.imgPreview} />
                    {loading && (
                        <>
                            <div className={styles.scanningLine}></div>
                            <div className={styles.processIndicator}>
                                <div className={styles.spinner}></div>
                                <span>Đang quét...</span>
                            </div>
                        </>
                    )}
                    <div className={styles.actionGroup}>
                        <button className={styles.btnMain} onClick={() => onDetected(file)} disabled={loading}>
                            {loading ? 'Hệ thống đang xử lý...' : 'Phân tích AI'}
                        </button>
                        <button className={styles.btnReset} onClick={handleReset} disabled={loading}>
                            <X size={18} style={{marginRight: '6px'}} />
                            Hủy
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadBox;