const ViewUser = ({ user, onClose }) => {
    if (!user) return null;
  
    return (
      <div style={overlay}>
        <div className="modal">
          <h3 style={{ marginBottom: 16 }}>👁️ Chi tiết người dùng</h3>
  
          <p>🆔 <b>ID:</b> {user.id}</p>
          <p>👤 <b>Username:</b> {user.username}</p>
          <p>📧 <b>Email:</b> {user.email}</p>
          <p>👤 <b>Họ tên:</b> {user.full_name}</p>
          <p>🚻 <b>Giới tính:</b> {user.gender}</p>
          <p>🛂 <b>Vai trò:</b> {user.role}</p>
          <p>
            🔒 <b>Trạng thái:</b>{" "}
            <span className={user.is_active ? "status-active" : "status-inactive"}>
              {user.is_active ? "Hoạt động" : "Bị khóa"}
            </span>
          </p>
  
          <div className="modal-action">
            <button className="btn btn-lock" onClick={onClose}>
              ❌ Đóng
            </button>
          </div>
        </div>
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
    zIndex: 1000,
  };
  
  export default ViewUser;
  