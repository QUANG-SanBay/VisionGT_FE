import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const isLogin = !!localStorage.getItem("token");

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">VisionGT</Link>
        </div>

        <nav className="nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/customer/detection">Nhận diện</Link>
          {isLogin && <Link to="/history">Lịch sử</Link>}
        </nav>

        <div className="auth">
          {!isLogin ? (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register" className="btn">
                Đăng ký
              </Link>
            </>
          ) : (
            <button
              className="btn logout"
              onClick={() => {
                localStorage.clear();
                location.href = "/login";
              }}
            >
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
