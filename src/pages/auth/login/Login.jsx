import { useState } from "react";
import { loginApi } from "../../../api/auth";
import { Link } from "react-router-dom";
import "./Login.css";
import bg from "../../../assets/traffic-bg.jpg";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await loginApi(form);
      alert("Đăng nhập thành công");
    } catch {
      alert("Đăng nhập thất bại");
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

          <input
            type="email"
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

          <button type="submit">Đăng nhập</button>

          <div className="form-link">
            <Link to="/register">Chưa có tài khoản? Đăng ký</Link>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Login;
