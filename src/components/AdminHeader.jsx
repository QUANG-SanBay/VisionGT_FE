import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "./AdminHeader.css";

const AdminHeader = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="admin-header">
      <div className="admin-left">
        <Link to="/admin/dashboard" className="admin-brand">
          <span className="admin-title">VisionGT</span>
          <span className="admin-badge">Admin</span>
        </Link>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard">
          <i className="fas fa-chart-line"></i>
          Dashboard
        </NavLink>
        <NavLink to="/admin/history">
          <i className="fas fa-history"></i>
          Lịch sử
        </NavLink>
        <NavLink to="/admin/users">
          <i className="fas fa-users"></i>
          Người dùng
        </NavLink>
        <NavLink to="/admin/settings">
          <i className="fas fa-cog"></i>
          Cài đặt
        </NavLink>
      </nav>

      <div className="admin-right">
        <div className="admin-notifications">
          <i className="fas fa-bell"></i>
          <span className="notification-badge">3</span>
        </div>

        <div className="admin-user" onClick={() => setOpen(!open)}>
          <img
            src={user?.avatar || "../assets/images/avatar-default.png"}
            alt="avatar"
            className="admin-avatar"
          />
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name || "Admin"}</span>
            <span className="admin-user-role">Quản trị viên</span>
          </div>
          <i className={`fas fa-chevron-down chevron ${open ? "rotate" : ""}`}></i>
        </div>

        {open && (
          <div className="admin-dropdown">
            <Link to="/admin/profile" className="admin-dropdown-item">
              <i className="fas fa-user"></i>
              Thông tin cá nhân
            </Link>
            <Link to="/admin/settings" className="admin-dropdown-item">
              <i className="fas fa-cog"></i>
              Cài đặt hệ thống
            </Link>
            <Link to="/" className="admin-dropdown-item">
              <i className="fas fa-home"></i>
              Về trang chủ
            </Link>
            <div className="admin-dropdown-divider"></div>
            <div className="admin-dropdown-item logout" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
              Đăng xuất
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminHeader;
