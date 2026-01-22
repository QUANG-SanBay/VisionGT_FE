import { useState } from "react";
import { Link } from "react-router-dom";
import { registerApi } from "../../../api/auth";
import trafficBg from "../../../assets/traffic-bg.jpg";
import "./register.css";

function Register() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    try {
      await registerApi({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
      });
      alert("Đăng ký thành công");
    } catch {
      alert("Đăng ký thất bại");
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

          <input
            name="fullName"
            placeholder="Họ và tên"
            onChange={handleChange}
            required
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            onChange={handleChange}
            required
          />

          <button type="submit">Đăng ký</button>

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
