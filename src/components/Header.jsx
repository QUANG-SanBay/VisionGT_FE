import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User } from "lucide-react";
import { logoutApi, clearTokens } from "../api/auth";
import "./Header.css";

export default function Header({ user }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      navigate('/login');
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="brand">VisionGT</Link>
      </div>


      <div className="header-right">
        <div className="avatar-wrapper" onClick={() => setOpen(!open)}>
          <div className="avatar">
            <User size={24} />
          </div>
        </div>

        {open && (
          <div className="dropdown">
            <div className="dropdown-item" onClick={() => { navigate("/profile"); setOpen(false); }}>
              Thông tin cá nhân
            </div>

            {user?.role === "admin" && (
              <div className="dropdown-item">
                Quản trị hệ thống
              </div>
            )}

            <div className="dropdown-item" onClick={() => { navigate("/history"); setOpen(false); }}>
              Lịch sử nhận diện
            </div>
            <div className="dropdown-item logout" onClick={handleLogout}>Đăng xuất</div>
          </div>
        )}
      </div>
    </header>
  );
}
