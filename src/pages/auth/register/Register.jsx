import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerApi } from "../../../api/auth";
import trafficBg from "../../../assets/traffic-bg.jpg";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Xóa error khi user nhập lại
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.password2) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await registerApi({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        password2: form.password2,
      });
      
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      
      // Chuyển hướng đến trang login
      navigate('/login');
    } catch (error) {
      console.error('Register error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        
        // Hiển thị lỗi email nếu có
        if (errors.email) {
          setError(errors.email[0]);
        } else if (errors.password) {
          setError(errors.password[0]);
        } else if (errors.full_name) {
          setError(errors.full_name[0]);
        } else {
          setError("Đăng ký thất bại. Vui lòng kiểm tra lại thông tin!");
        }
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Đăng ký thất bại. Vui lòng thử lại!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="auth-container"
      style={{
        backgroundImage: `url(${trafficBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="traffic-layout">
        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>

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
            name="full_name"
            placeholder="Họ và tên"
            value={form.full_name}
            onChange={handleChange}
            disabled={loading}
            required
          />

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

          <input
            type="password"
            name="password2"
            placeholder="Nhập lại mật khẩu"
            value={form.password2}
            onChange={handleChange}
            disabled={loading}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>

          {/* LINK CHUYỂN SANG LOGIN */}
          <div className="form-link">
            Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
