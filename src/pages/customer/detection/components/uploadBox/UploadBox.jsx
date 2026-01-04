import React, { useState } from 'react';
import styles from './UploadBox.module.scss';
import { Upload } from 'lucide-react';

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

    return (
        <div className={styles.uploadContainer}>
            {!preview ? (
                <label className={styles.dropzone}>
                    <div className={styles.iconBox}><Upload size={32} /></div>
                    <p>Kéo thả ảnh hoặc video vào đây</p>
                    <span style={{color: '#a3aed0', fontSize: '0.8rem'}}>Hỗ trợ định dạng JPG, PNG, MP4</span>
                    <input type="file" hidden onChange={handleFileChange} />
                </label>
            ) : (
                <div className={styles.previewWrapper}>
                    <img src={preview} alt="Preview" className={styles.imgPreview} />
                    {loading && <div className={styles.scanningLine}></div>}
                    <div className={styles.actionGroup}>
                        <button className={styles.btnMain} onClick={() => onDetected(file)} disabled={loading}>
                            {loading ? 'Hệ thống đang quét...' : 'Phân tích dữ liệu AI'}
                        </button>
                        <button className={styles.btnReset} onClick={() => setPreview(null)}>Hủy</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadBox;