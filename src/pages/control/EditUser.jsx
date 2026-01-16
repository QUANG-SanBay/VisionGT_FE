import { useState, useEffect } from "react";

const EditUser = ({ user, onClose, onSave }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    setForm({ ...user });
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!form.username || !form.email || !form.full_name) {
      alert("❌ Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onSave(form);
    alert(`✏️ Cập nhật người dùng ID = ${form.id} thành công`);
    onClose();
  };

  return (
    <div style={overlay}>
      <div className="modal" style={{ width: 720 }}>
        {/* HEADER */}
        <div className="modal-header">
          <h3 style={{ color: "#0284c7" }}>✏️ Chỉnh sửa người dùng</h3>
          <button className="btn-close" onClick={onClose}>✖</button>
        </div>

        {/* FORM */}
        <div className="adduser-row">

          {/* EMAIL */}
          <div>
            <label>📧 Email</label>
            <input
              className="input"
              name="email"
              value={form.email || ""}
              onChange={handleChange}
            />
          </div>

          {/* FULL NAME */}
          <div>
            <label>Họ và tên</label>
            <input
              className="input"
              name="full_name"
              value={form.full_name || ""}
              onChange={handleChange}
            />
          </div>

          {/* GENDER */}
          <div>
            <label>🚻 Giới tính</label>
            <select
              className="input"
              name="gender"
              value={form.gender || "other"}
              onChange={handleChange}
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>

          {/* ROLE */}
          <div>
            <label>🛂 Vai trò</label>
            <select
              className="input"
              name="role"
              value={form.role || "customer"}
              onChange={handleChange}
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* PASSWORD */}
          <div>
            <label>🔑 Mật khẩu mới</label>
            <input
              className="input"
              type="password"
              name="password"
              placeholder="Để trống nếu không đổi"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* ACTION */}
        <div className="adduser-action">
          <button className="btn btn-lock" onClick={onClose}>
            ❌ Hủy
          </button>
          <button className="btn btn-add" onClick={handleSave}>
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

export default EditUser;
