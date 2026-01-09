import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        
        <div className="footer-brand">
          <h3>VisionGT</h3>
          <p>Hệ thống nhận diện biển báo giao thông thông minh</p>
        </div>

        <div className="footer-links">
          <h4>Chức năng</h4>
          <ul>
            <li>Nhận diện biển báo</li>
            <li>Lịch sử nhận diện</li>
            <li>Quản lý tài khoản</li>
          </ul>
        </div>

        <div className="footer-members">
          <h4>Thành viên nhóm</h4>
          <ul>
            <li>Nguyễn Quốc Khang</li>
            <li>Trương Minh Quang</li>
            <li>Nguyễn Đăng Khoa</li>
            <li>Ngô Công Thành</li>
            <li>Nguyễn Trường Thịnh</li>
            <li>Trần Ngọc Quí</li>
          </ul>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
