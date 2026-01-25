import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Home.module.scss';
import { ShieldCheck, Zap, Eye, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: <Eye size={40} />,
            title: "Nhận diện chính xác",
            description: "Sử dụng AI tiên tiến để nhận diện biển báo với độ chính xác cao"
        },
        {
            icon: <Zap size={40} />,
            title: "Xử lý nhanh chóng",
            description: "Phân tích hình ảnh và video trong vài giây với công nghệ tối ưu"
        },
        {
            icon: <ShieldCheck size={40} />,
            title: "Tra cứu luật giao thông",
            description: "Cung cấp thông tin chi tiết về quy định và mức phạt tương ứng"
        },
        {
            icon: <TrendingUp size={40} />,
            title: "Thống kê chi tiết",
            description: "Theo dõi lịch sử nhận diện và phân tích dữ liệu trực quan"
        }
    ];

    const benefits = [
        "Nhận diện cả ảnh và video",
        "Hỗ trợ hơn 50+ loại biển báo",
        "Giao diện thân thiện, dễ sử dụng",
        "Lưu trữ lịch sử nhận diện",
        "Cập nhật luật giao thông mới nhất"
    ];

    return (
        <div className={styles.homePage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <span className={styles.badge}>
                            <ShieldCheck size={20} /> Công nghệ AI tiên tiến
                        </span>
                        <h1 className={styles.heroTitle}>
                            Hệ thống nhận diện<br />
                            <span className={styles.highlight}>Biển báo giao thông</span>
                        </h1>
                        <p className={styles.heroDescription}>
                            Ứng dụng AI giúp bạn nhận diện biển báo giao thông từ ảnh và video một cách nhanh chóng, 
                            chính xác và cung cấp thông tin chi tiết về quy định pháp luật.
                        </p>
                        <div className={styles.heroButtons}>
                            <button 
                                className={styles.primaryBtn}
                                onClick={() => navigate('/detection')}
                            >
                                Bắt đầu nhận diện <ArrowRight size={20} />
                            </button>
                            <button 
                                className={styles.secondaryBtn}
                                onClick={() => navigate('/history')}
                            >
                                Xem lịch sử
                            </button>
                        </div>
                    </div>
                    <div className={styles.heroImage}>
                        <div className={styles.imageContainer}>
                            <div className={styles.floatingCard}>
                                <ShieldCheck size={30} />
                                <div>
                                    <div className={styles.cardTitle}>Độ chính xác</div>
                                    <div className={styles.cardValue}>98.5%</div>
                                </div>
                            </div>
                            <div className={`${styles.floatingCard} ${styles.card2}`}>
                                <Zap size={30} />
                                <div>
                                    <div className={styles.cardTitle}>Thời gian xử lý</div>
                                    <div className={styles.cardValue}>2-5s</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className={styles.features}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Tính năng nổi bật</h2>
                    <p className={styles.sectionDescription}>
                        Các tính năng mạnh mẽ giúp bạn nhận diện biển báo hiệu quả
                    </p>
                </div>
                <div className={styles.featuresGrid}>
                    {features.map((feature, index) => (
                        <div key={index} className={styles.featureCard}>
                            <div className={styles.featureIcon}>{feature.icon}</div>
                            <h3 className={styles.featureTitle}>{feature.title}</h3>
                            <p className={styles.featureDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Benefits Section */}
            <section className={styles.benefits}>
                <div className={styles.benefitsContent}>
                    <div className={styles.benefitsText}>
                        <h2 className={styles.sectionTitle}>Tại sao chọn VisionGT?</h2>
                        <p className={styles.sectionDescription}>
                            Giải pháp toàn diện cho việc nhận diện và tra cứu thông tin biển báo giao thông
                        </p>
                        <ul className={styles.benefitsList}>
                            {benefits.map((benefit, index) => (
                                <li key={index} className={styles.benefitItem}>
                                    <CheckCircle size={24} />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                        <button 
                            className={styles.benefitsBtn}
                            onClick={() => navigate('/detection')}
                        >
                            Thử ngay miễn phí <ArrowRight size={20} />
                        </button>
                    </div>
                    <div className={styles.benefitsVisual}>
                        <div className={styles.statsCard}>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>50+</div>
                                <div className={styles.statLabel}>Loại biển báo</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>10k+</div>
                                <div className={styles.statLabel}>Lượt nhận diện</div>
                            </div>
                            <div className={styles.stat}>
                                <div className={styles.statValue}>98.5%</div>
                                <div className={styles.statLabel}>Độ chính xác</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.cta}>
                <div className={styles.ctaContent}>
                    <h2 className={styles.ctaTitle}>Sẵn sàng bắt đầu?</h2>
                    <p className={styles.ctaDescription}>
                        Trải nghiệm ngay hệ thống nhận diện biển báo thông minh
                    </p>
                    <button 
                        className={styles.ctaBtn}
                        onClick={() => navigate('/detection')}
                    >
                        Bắt đầu ngay <ArrowRight size={20} />
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Home;