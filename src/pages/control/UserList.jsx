import { useState } from "react";

const UserList = ({ users, onDelete, onUpdate, onToggle }) => {
  const [editing, setEditing] = useState(null);
  const [view, setView] = useState(null);

  const saveEdit = () => {
    onUpdate(editing);
    alert(`✏️ Cập nhật người dùng ID = ${editing.id} thành công`);
    setEditing(null);
  };

  return (
    <div className="card">
      <h2 style={{ color: "#16a34a" }}>🧾 Danh sách người dùng</h2>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Vai trò</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.full_name}</td>
              <td>{u.role}</td>
              <td className={u.is_active ? "status-active" : "status-inactive"}>
                {u.is_active ? "Hoạt động" : "Vô hiệu"}
              </td>
              <td>
                <button className="btn btn-lock" onClick={() => onToggle(u)}>
                  {u.is_active ? "🔒" : "🔓"}
                </button>
                <button className="btn" onClick={() => setEditing({ ...u })}>
                  ✏️
                </button>
                <button className="btn" onClick={() => setView(u)}>
                  👁️
                </button>
                <button
                 className="btn btn-delete"
                 onClick={() => {
                   if (window.confirm(`❗ Bạn có chắc chắn xoá người dùng ID = ${u.id} không?`)) {
                    onDelete(u.id);
                  }
                }}
>
  🗑️
</button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= MODAL EDIT ================= */}
      {editing && (
        <div style={overlay}>
          <div className="modal">
            <h3>✏️ Chỉnh sửa người dùng</h3>

            <label>📧 Email</label>
            <input
              className="input"
              value={editing.email}
              onChange={(e) =>
                setEditing({ ...editing, email: e.target.value })
              }
            />

            <label>Họ và tên</label>
            <input
              className="input"
              value={editing.full_name}
              onChange={(e) =>
                setEditing({ ...editing, full_name: e.target.value })
              }
            />

            <label>🚻 Giới tính</label>
            <select
              className="input"
              value={editing.gender}
              onChange={(e) =>
                setEditing({ ...editing, gender: e.target.value })
              }
            >
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>

            <label>🛂 Vai trò</label>
            <select
              className="input"
              value={editing.role}
              onChange={(e) =>
                setEditing({ ...editing, role: e.target.value })
              }
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>

            <label>🔑 Mật khẩu mới</label>
            <input
              className="input"
              type="password"
              placeholder="Để trống nếu không đổi"
              onChange={(e) =>
                setEditing({ ...editing, password: e.target.value })
              }
            />

            <div className="modal-action">
              <button className="btn btn-lock" onClick={() => setEditing(null)}>
                ❌ Hủy
              </button>
              <button className="btn btn-add" onClick={saveEdit}>
                💾 Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL VIEW ================= */}
      {view && (
        <div style={overlay}>
          <div className="modal">
            <h3>👁️ Chi tiết người dùng</h3>
            <p><b>ID:</b> {view.id}</p>
            <p><b>Username:</b> {view.username}</p>
            <p><b>Email:</b> {view.email}</p>
            <p><b>Họ tên:</b> {view.full_name}</p>
            <p><b>Giới tính:</b> {view.gender}</p>
            <p><b>Vai trò:</b> {view.role}</p>
            <p><b>Mật khẩu:</b> {"******"}</p>
            <p>
              <b>Trạng thái:</b>{" "}
              {view.is_active ? "Hoạt động" : "Vô hiệu"}
            </p>

            <div className="modal-action">
              <button className="btn" onClick={() => setView(null)}>
                ❌ Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== STYLE MODAL ===== */
const overlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.45)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

export default UserList;
