import React from 'react';
import styles from './ResultBox.module.scss';
import { AlertCircle } from 'lucide-react';

const ResultBox = ({ data }) => {
    if (!data) return <div className={styles.empty}>Kết quả sẽ hiển thị tại đây</div>;

    return (
        <div className={styles.resultWrapper}>
            <h3>Kết quả phân tích</h3>
            {data.signs.map((sign, index) => (
                <div key={index} className={styles.signCard}>
                    <div className={styles.header}>
                        <span className={styles.id}>{sign.id}</span>
                        <span className={styles.conf}>{sign.confidence}%</span>
                    </div>
                    <h4>{sign.name}</h4>
                    <p className={styles.desc}>{sign.description}</p>
                    <div className={styles.fine}>
                        <AlertCircle size={14} />
                        <span>Phạt: {sign.fine}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResultBox;