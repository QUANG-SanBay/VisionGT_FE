import { useState } from "react";
import { registerApi } from "../../../api/auth";
import "./Register.css";

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
    } catch (err) {
      alert("Đăng ký thất bại");
    }
  };

  return (
    <div className="auth-container">
      <div className="traffic-layout">

        <div className="traffic-icons">
          <div className="sign-ban">CẤM</div>
          <div className="sign-guide">REGISTER</div>

          <div className="traffic-light">
            <div className="light red"></div>
            <div className="light"></div>
            <div className="light green"></div>
          </div>
        </div>

        <form className="auth-box" onSubmit={handleSubmit}>
          <h2>Đăng ký</h2>

          <input name="email" placeholder="Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />

          <button type="submit">Register</button>
        </form>

      </div>
    </div>
  );
}

export default Register;
