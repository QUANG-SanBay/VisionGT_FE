import { useState } from "react";
import { loginApi, saveTokens } from "../../../api/auth";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import bg from "../../../assets/traffic-bg.jpg";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Xóa error khi user nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await loginApi(form);
      
      console.log('Login response:', response.data);
      
      // Lưu tokens vào localStorage - tokens nằm trong userToken object
      if (response.data.userToken?.access && response.data.userToken?.refresh) {
        saveTokens(response.data.userToken.access, response.data.userToken.refresh);
        
        // Lưu thông tin user
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        alert("Đăng nhập thành công!");
        
        // Chuyển hướng dựa vào role
        const userRole = response.data.user?.role || 'customer';
        if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError("Phản hồi từ server không hợp lệ");
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 401) {
        setError("Email hoặc mật khẩu không đúng!");
      } else if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.data?.errors) {
        setError(error.response.data.errors);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        background: `url(${bg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div className="traffic-layout">

        {/* CỘT TRÁI */}
        <div className="traffic-icons">
          <div className="sign-ban">CẤM</div>

          <div className="sign-guide">
            HỆ THỐNG<br />
            NHẬN DIỆN<br />
            BIỂN BÁO
          </div>

          <div className="traffic-light">
            <div className="light red"></div>
            <div className="light"></div>
            <div className="light green"></div>
          </div>
        </div>

        {/* FORM LOGIN */}
        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>

          {error && (
            <div style={{ 
              color: 'red', 
              marginBottom: '10px', 
              padding: '10px', 
              backgroundColor: '#ffe6e6',
              borderRadius: '4px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={form.password}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <div className="form-link">
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
