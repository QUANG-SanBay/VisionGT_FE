import { useState } from "react";

const AddUser = ({ onAdd }) => {
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    gender: "other",
    role: "customer",
    password: "",
    password2: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (!form.username || !form.email || !form.full_name) {
      alert("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (form.password !== form.password2) {
      alert("❌ Mật khẩu không khớp");
      return;
    }

    onAdd({
      id: Date.now(),
      username: form.username,
      email: form.email,
      full_name: form.full_name,
      gender: form.gender,
      role: form.role,
      password: form.password,
      is_active: false,
    });

    alert("➕ Thêm người dùng thành công");

    setForm({
      username: "",
      email: "",
      full_name: "",
      gender: "other",
      role: "customer",
      password: "",
      password2: "",
    });

    setShowModal(false);
  };

  return (
    <>
      {/* ===== NÚT MỞ MODAL ===== */}
      <div className="card">
        <h2 style={{ color: "#0284c7" }}>👥 Thêm người dùng mới</h2>
        <button className="btn btn-add" onClick={() => setShowModal(true)}>
          ➕ Thêm người dùng 
        </button>
      </div>

      {/* ===== MODAL ===== */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            {/* HEADER */}
            <div className="modal-header">
              <h3 style={{ color: "#0284c7" }}>👤➕ Thêm người dùng mới</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                ✖
              </button>
            </div>

            {/* ===== HÀNG 1: THÔNG TIN ===== */}
            <div className="adduser-row">
              <div>
                <label>Username</label>
                <input
                  className="input"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Email</label>
                <input
                  className="input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Họ và tên</label>
                <input
                  className="input"
                  name="full_name"
                  value={form.full_name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Giới tính</label>
                <select
                  className="input"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>

              <div>
                <label>Vai trò</label>
                <select
                  className="input"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label>Mật khẩu</label>
                <input
                  className="input"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label>Nhập lại mật khẩu</label>
                <input
                  className="input"
                  type="password"
                  name="password2"
                  value={form.password2}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ===== HÀNG 2: NÚT ===== */}
            <div className="adduser-action">
              <button className="btn btn-add" onClick={handleSubmit}>
                ➕ Thêm người dùng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddUser;
