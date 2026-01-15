import React from 'react';
import { Link } from 'react-router-dom';
import styles from './AdminNav.module.scss';

// Simple top navigation for admin pages
// - Provides links to Dashboard and Detections list
// - Keep it lightweight so it can be replaced later by a full layout
const AdminNav = () => {
    return (
        <nav className={styles.adminNav}>
            <div className={styles.logo}>Admin</div>
            <div className={styles.links}>
                <Link to="/admin/dashboard">Dashboard</Link>
                <Link to="/admin/detections">Detections</Link>
            </div>
        </nav>
    );
};

export default AdminNav;
