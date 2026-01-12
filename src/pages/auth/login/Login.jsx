import { useState } from "react";
import { loginApi } from "../../../api/auth";
import "./Login.css";

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
    } catch (err) {
      alert("Đăng nhập thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="traffic-layout">

        <div className="traffic-icons">
          <div className="sign-ban">CẤM</div>
          <div className="sign-guide">LOGIN</div>

          <div className="traffic-light">
            <div className="light red"></div>
            <div className="light"></div>
            <div className="light green"></div>
          </div>
        </div>

        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Đăng nhập</h2>

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <button type="submit">Login</button>
        </form>

      </div>
    </div>
  );
}

export default Login;
