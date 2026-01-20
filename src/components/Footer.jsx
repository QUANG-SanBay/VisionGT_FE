import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-col">
          <div className="footer-brand">
            <h3>VisionGT</h3>
            <p className="slogan">Giải pháp thị giác máy tính hàng đầu</p>
          </div>
          <p className="company-desc">
            CÔNG TY TNHH GIẢI PHÁP THỊ GIÁC MÁY TÍNH - VisionGT cung cấp các giải pháp theo nhu cầu của quý khách hàng về Computer Vision, AI, Web, App và nhiều dịch vụ công nghệ khác.
          </p>
          <div className="social-links">
            <a href="#" className="social-icon" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Youtube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="social-icon" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a href="#" className="social-icon" aria-label="Github">
              <i className="fab fa-github"></i>
            </a>
          </div>
        </div>

        <div className="footer-col">
          <h4>DỊCH VỤ</h4>
          <ul>
            <li><a href="#">Nhận diện biển báo giao thông</a></li>
            <li><a href="#">Nhận diện khuôn mặt</a></li>
            <li><a href="#">Phân tích hình ảnh AI</a></li>
            <li><a href="#">Giải pháp Computer Vision</a></li>
            <li><a href="#">Tư vấn & triển khai AI</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>HỖ TRỢ</h4>
          <ul>
            <li><a href="#">Hướng dẫn sử dụng</a></li>
            <li><a href="#">Câu hỏi thường gặp</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Điều khoản sử dụng</a></li>
            <li><a href="#">Liên hệ hỗ trợ</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>LIÊN HỆ</h4>
          <div className="contact-info">
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>123 Đường ABC, Quận 1, TP. Hồ Chí Minh</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone-alt"></i>
              <span>0939 825 125</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <span>support@visiongt.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-globe"></i>
              <span>https://visiongt.com</span>
            </div>
            <div className="contact-item">
              <i className="fas fa-clock"></i>
              <span>Thứ 2 - Thứ 6: 8:00 - 17:30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 VisionGT. Tất cả quyền được bảo lưu.</p>
        <div className="footer-bottom-links">
          <a href="#">Chính sách bảo mật</a>
          <a href="#">Điều khoản sử dụng</a>
          <a href="#">Sitemap</a>
        </div>
      </div>
    </footer>
  );
}
