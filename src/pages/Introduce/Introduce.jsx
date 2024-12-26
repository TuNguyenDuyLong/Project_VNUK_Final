import React from 'react';
import './Introduce.scss';

const Introduce = () => {
    return (
        <div className="introduce-container">
            <section className="intro-header">
                <div className="intro-header-content">
                    <h1>Viện đào tạo nghiên cứu Việt - Anh</h1>
                    <p>
                        Viện Nghiên cứu và Đào tạo Việt – Anh (VNUK), Đại học Đà Nẵng tự hào là cơ sở giáo dục đại học công lập quốc tế đầu tiên được thành lập theo thỏa thuận hợp tác giữa hai chính phủ Việt Nam và Anh Quốc. Là tiền thân của trường Đại học Quốc tế thuộc Đại học Đà Nẵng, VNUK mang trong mình sứ mệnh góp phần đưa hoạt động nghiên cứu và giảng dạy đại học của Việt Nam lên tầm cỡ quốc tế.
                    </p>
                </div>
            </section>

            <section className="intro-history">
                <div className="section-title">
                    <h2>Lịch Sử Hình Thành</h2>
                </div>
                <p>
                    Đại học Đà Nẵng vinh dự được hai chính phủ Việt Nam và Vương quốc Anh chọn và giao nhiệm vụ hợp tác với các trường đại học Vương quốc Anh triển khai dự án thành lập trường Đại học Việt – Anh, một trường đại học công lập đẳng cấp quốc tế tại Đà Nẵng. Theo Quyết định số 5555/QĐ-BGDĐT ngày 22 tháng 11 năm 2013 của Bộ Giáo dục và Đào tạo,  trường Đại học Công lập Quốc tế Việt – Anh được phát triển qua hai giai đoạn: (i) thành lập Viện Nghiên cứu và Đào tạo Việt – Anh (gọi tắt là VNUK) thuộc Đại học Đà Nẵng, (ii) phát triển Viện thành trường Đại học Quốc tế Việt – Anh. Theo quyết định này, VNUK được tổ chức đào tạo các chương trình bậc đại học, thạc sĩ, và tiến sĩ cũng như các khóa đào tạo bồi dưỡng ngắn hạn.
                </p>
            </section>

            <section className="intro-mission">
                <div className="section-title">
                    <h2>Sứ Mệnh và Tầm Nhìn</h2>
                </div>
                <p>
                    Thực hiện các dự án nghiên cứu có chất lượng quốc tế, góp phần quan trọng nâng cao chất lượng cuộc sống và phát triển của xã hội;

                    Phát triển và cung cấp các chương trình đào tạo hiện đại và đẳng cấp;

                    Trang bị cho người học những kỹ năng cần thiết để có thể làm chủ tương lai của bản thân và góp phần xây dựng thế giới tốt đẹp hơn;

                    Đem đến cho giảng viên và người học môi trường học tập và làm việc thân thiện và đầy hứng khởi.
                </p>
            </section>

            <section className="intro-achievements">
                <div className="section-title">
                    <h2>Thành Tựu Nổi Bật</h2>
                </div>
                <ul>
                    <li>Top 10 trường đại học hàng đầu về đào tạo và nghiên cứu (2023)</li>
                    <li>Cộng tác với các trường đại học hàng đầu trên thế giới</li>
                    <li>Hơn 50.000 sinh viên tốt nghiệp đang làm việc tại các công ty lớn trong và ngoài nước</li>
                </ul>
            </section>

            <section className="intro-footer">
                <p>Gia nhập cộng đồng sinh viên Trường Đại Học XYZ ngay hôm nay để cùng nhau xây dựng tương lai sáng lạn!</p>
            </section>
        </div>
    );
};

export default Introduce;
