import React, { useState, useEffect } from 'react';
import { User, Lock, Mail, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import profileApi from '../../api/profileApi';
import './Profile.css';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('info'); // 'info' or 'password'
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    
    // Profile data
    const [profile, setProfile] = useState({
        full_name: '',
        email: '',
        gender: '',
        username: '',
        date_joined: ''
    });

    // Profile form
    const [profileForm, setProfileForm] = useState({
        full_name: '',
        email: '',
        gender: ''
    });

    // Password form
    const [passwordForm, setPasswordForm] = useState({
        old_password: '',
        new_password: '',
        confirm_new_password: ''
    });

    // Fetch profile on mount
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        setLoading(true);
        try {
            const response = await profileApi.getProfile();
            const data = response.data;
            setProfile(data);
            setProfileForm({
                full_name: data.full_name || '',
                email: data.email || '',
                gender: data.gender || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
            setMessage({
                type: 'error',
                text: 'Không thể tải thông tin profile'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileChange = (e) => {
        setProfileForm({
            ...profileForm,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordForm({
            ...passwordForm,
            [e.target.name]: e.target.value
        });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        try {
            await profileApi.updateProfile(profileForm);
            setMessage({
                type: 'success',
                text: 'Cập nhật thông tin thành công!'
            });
            // Refresh profile
            await fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Cập nhật thất bại'
            });
        } finally {
            setUpdating(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setMessage({ type: '', text: '' });

        // Validate password match
        if (passwordForm.new_password !== passwordForm.confirm_new_password) {
            setMessage({
                type: 'error',
                text: 'Mật khẩu mới không khớp!'
            });
            setUpdating(false);
            return;
        }

        try {
            await profileApi.changePassword({
                old_password: passwordForm.old_password,
                new_password: passwordForm.new_password,
                confirm_new_password: passwordForm.confirm_new_password
            });
            setMessage({
                type: 'success',
                text: 'Đổi mật khẩu thành công!'
            });
            // Clear form
            setPasswordForm({
                old_password: '',
                new_password: '',
                confirm_new_password: ''
            });
        } catch (error) {
            console.error('Error changing password:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Đổi mật khẩu thất bại'
            });
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="profile-page">
                <div className="profile-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-container">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <User size={60} />
                    </div>
                    <div className="profile-header-info">
                        <h1>{profile.full_name}</h1>
                        <p className="profile-username">@{profile.username}</p>
                        <p className="profile-joined">
                            <Calendar size={16} />
                            Tham gia: {formatDate(profile.date_joined)}
                        </p>
                    </div>
                </div>

                {message.text && (
                    <div className={`profile-message ${message.type}`}>
                        {message.type === 'success' ? (
                            <CheckCircle size={20} />
                        ) : (
                            <AlertCircle size={20} />
                        )}
                        {message.text}
                    </div>
                )}

                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${activeTab === 'info' ? 'active' : ''}`}
                        onClick={() => setActiveTab('info')}
                    >
                        <User size={20} />
                        Thông tin cá nhân
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        <Lock size={20} />
                        Đổi mật khẩu
                    </button>
                </div>

                <div className="profile-content">
                    {activeTab === 'info' ? (
                        <form className="profile-form" onSubmit={handleProfileSubmit}>
                            <div className="form-group">
                                <label htmlFor="full_name">
                                    <User size={18} /> Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="full_name"
                                    name="full_name"
                                    value={profileForm.full_name}
                                    onChange={handleProfileChange}
                                    required
                                    disabled={updating}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">
                                    <Mail size={18} /> Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={profileForm.email}
                                    onChange={handleProfileChange}
                                    required
                                    disabled={updating}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="gender">
                                    <User size={18} /> Giới tính
                                </label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={profileForm.gender}
                                    onChange={handleProfileChange}
                                    disabled={updating}
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="male">Nam</option>
                                    <option value="female">Nữ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="profile-submit-btn"
                                disabled={updating}
                            >
                                {updating ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                            </button>
                        </form>
                    ) : (
                        <form className="profile-form" onSubmit={handlePasswordSubmit}>
                            <div className="form-group">
                                <label htmlFor="old_password">
                                    <Lock size={18} /> Mật khẩu hiện tại
                                </label>
                                <input
                                    type="password"
                                    id="old_password"
                                    name="old_password"
                                    value={passwordForm.old_password}
                                    onChange={handlePasswordChange}
                                    required
                                    disabled={updating}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="new_password">
                                    <Lock size={18} /> Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    id="new_password"
                                    name="new_password"
                                    value={passwordForm.new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    disabled={updating}
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirm_new_password">
                                    <Lock size={18} /> Xác nhận mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    id="confirm_new_password"
                                    name="confirm_new_password"
                                    value={passwordForm.confirm_new_password}
                                    onChange={handlePasswordChange}
                                    required
                                    disabled={updating}
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>

                            <button
                                type="submit"
                                className="profile-submit-btn"
                                disabled={updating}
                            >
                                {updating ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
