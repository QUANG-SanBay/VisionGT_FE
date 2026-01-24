import "./AdminFooter.css";

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="admin-footer">
      <div className="admin-footer-left">
        <p>© {currentYear} VisionGT. Tất cả quyền được bảo lưu.</p>
      </div>
      <div className="admin-footer-right">
        <span>Phiên bản 1.0.0</span>
        <a href="#">Tài liệu</a>
        <a href="#">Hỗ trợ</a>
      </div>
    </footer>
  );
};

export default AdminFooter;
