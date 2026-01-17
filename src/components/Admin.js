import { useState } from "react";
import usersData from "../data/users";
import AddUser from "../pages/control/AddUser";
import UserList from "../pages/control/UserList";

function App() {
  const [users, setUsers] = useState(usersData);

  const addUser = (user) => {
    setUsers([user, ...users]);
    alert("➕ Thêm người dùng thành công!");
  };

  const updateUser = (updated) => {
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    alert(`✏️ Cập nhật người dùng ID = ${updated.id} thành công`);
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
    alert(`🗑️ Đã xóa người dùng ID = ${id}`);
  };

  const toggleUser = (user) => {
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, is_active: !u.is_active } : u
    ));
    alert(
      user.is_active
        ? "🔒 Vô hiệu hóa tài khoản thành công"
        : "🔓 Kích hoạt tài khoản thành công"
    );
  };

  return (
    <div className="container">
      <AddUser onAdd={addUser} />
      <UserList
        users={users}
        onDelete={deleteUser}
        onUpdate={updateUser}
        onToggle={toggleUser}
      />
    </div>
  );
}

export default App;
