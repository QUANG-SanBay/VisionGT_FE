import { useState } from "react";
import { registerApi } from "../../../api/auth";
import "../login/Login.css";
import bg from "../../../assets/traffic-bg.jpg";

function Register() {
  const [form, setForm] = useState({
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
      alert("Mật khẩu không khớp");
      return;
    }

    try {
      await registerApi({
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
        background: `url(${bg}) no-repeat center center`,
        backgroundSize: "cover",
      }}
    >
      <div className="traffic-layout">

        {/* CỘT CHỦ ĐỀ */}
        <div className="traffic-icons">
          <div className="sign-ban">CẤM</div>

          <div className="sign-guide">
            HỆ THỐNG<br />
            NHẬN DIỆN<br />
            BIỂN BÁO<br />
            THÔNG MINH
          </div>

          <div className="traffic-light">
            <div className="light red"></div>
            <div className="light"></div>
            <div className="light green"></div>
          </div>
        </div>

        {/* FORM ĐĂNG KÝ */}
        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>

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

          <input
            type="password"
            name="confirmPassword"
            placeholder="Nhập lại mật khẩu"
            onChange={handleChange}
            required
          />

          <button type="submit">Đăng ký</button>

          <div className="form-link">
            <a href="/auth/login">Đã có tài khoản? Đăng nhập</a>
          </div>
        </form>

      </div>
    </div>
  );
}

export default Register;
