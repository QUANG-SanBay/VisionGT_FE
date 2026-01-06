import React from "react";

const UserTable = ({ users, onLock, onUnlock, onDelete }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Tài khoản</th>
          <th>Email</th>
          <th>Quyền</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>

            {/* Trạng thái */}
            <td className={user.status === "active" ? "status-active" : "status-locked"}>
              {user.status}
            </td>

            {/* Thao tác */}
            <td>
              {user.status === "active" ? (
                <button className="btn-lock" onClick={() => onLock(user.id)}>
                  Khóa
                </button>
              ) : (
                <button className="btn-unlock" onClick={() => onUnlock(user.id)}>
                  Mở
                </button>
              )}
              <button className="btn-delete" onClick={() => onDelete(user.id)}>
                Xóa
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
