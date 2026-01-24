import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API_URL = "http://127.0.0.1:8000/api/profile/";

function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    full_name: "",
    gender: "male",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("access_token");

  /* ===== AUTH CHECK + FETCH ===== */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setUser(data);
        setForm({
          full_name: data.full_name || "",
          gender: data.gender || "male",
        });
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, []);

  /* ===== HANDLERS ===== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await fetch(API_URL, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    setUser({ ...user, ...form });
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (!user) {
    return <div className="profile-loading">Đang tải hồ sơ...</div>;
  }

  const joinDate = new Date(user.date_joined).toLocaleDateString("vi-VN");

  return (
    <div className="profile-page">
      <div className="profile-card">

        {/* HEADER */}
        <div className="profile-header">
          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>

        {/* AVATAR */}
        <div className="avatar-wrapper">
          <div className="avatar">
            {user.full_name?.charAt(0)?.toUpperCase()}
          </div>
        </div>

        {/* BODY */}
        <div className="profile-body">
          <h2>{isEditing ? "Chỉnh sửa hồ sơ" : user.full_name}</h2>
          <p className="username">@{user.username}</p>

          <div className="field">
            <label>Họ và tên</label>
            {isEditing ? (
              <input
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
              />
            ) : (
              <span>{user.full_name}</span>
            )}
          </div>

          <div className="field">
            <label>Giới tính</label>
            {isEditing ? (
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <span>
                {user.gender === "male"
                  ? "Nam"
                  : user.gender === "female"
                  ? "Nữ"
                  : "Khác"}
              </span>
            )}
          </div>

          <div className="field">
            <label>Email</label>
            <span className="readonly">{user.email}</span>
          </div>

          <div className="field">
            <label>Ngày tham gia</label>
            <span>{joinDate}</span>
          </div>

          <div className="actions">
            {isEditing ? (
              <>
                <button className="btn cancel" onClick={() => setIsEditing(false)}>
                  Hủy
                </button>
                <button className="btn save" onClick={handleSave}>
                  Lưu
                </button>
              </>
            ) : (
              <button className="btn edit" onClick={() => setIsEditing(true)}>
                Chỉnh sửa
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Profile;
