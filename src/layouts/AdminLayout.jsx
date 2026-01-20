import AdminHeader from "../components/AdminHeader";
import AdminFooter from "../components/AdminFooter";
import "./AdminLayout.css";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <AdminHeader />
      <main className="admin-main">{children}</main>
      <AdminFooter />
    </div>
  );
};

export default AdminLayout;
