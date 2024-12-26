import React from 'react';
import './Admissions.scss';

const Admissions = () => {
    return (
        <div className="admissions-container">
            {/* Hero Section */}
            <section className="admissions-hero">
                <div className="admissions-hero-content">
                    <h1>Tuyển Sinh 2024</h1>
                    <a href="#apply" className="btn-main">Đăng Ký Ngay</a>
                </div>
            </section>

            {/* Admission Requirements */}
            <section className="admissions-requirements">
                <h2>Yêu Cầu Tuyển Sinh</h2>
                <p>Chúng tôi chào đón các ứng viên xuất sắc từ mọi nơi. Dưới đây là những yêu cầu cơ bản để bạn có thể tham gia vào quá trình tuyển sinh:</p>
                <ul>
                    <li>Điểm trung bình học bạ từ 7.0 trở lên.</li>
                    <li>Đã hoàn thành chương trình THPT.</li>
                    <li>Có chứng chỉ tiếng Anh (TOEFL, IELTS) đối với chương trình quốc tế.</li>
                    <li>Đạt yêu cầu phỏng vấn đầu vào (nếu có).</li>
                </ul>
            </section>
            {/* How To Apply */}
            <section className="how-to-apply">
                <h2>Hướng Dẫn Đăng Ký</h2>
                <p>Để tham gia vào quá trình tuyển sinh, bạn cần làm theo các bước sau:</p>
                <div className="apply-steps">
                    <div className="step">
                        <h3>Bước 1: Điền Đơn Đăng Ký</h3>
                        <p>Truy cập trang web của chúng tôi và điền đầy đủ thông tin vào mẫu đơn đăng ký.</p>
                    </div>
                    <div className="step">
                        <h3>Bước 2: Nộp Hồ Sơ</h3>
                        <p>Chúng tôi yêu cầu bạn nộp đầy đủ hồ sơ học tập, chứng chỉ và các tài liệu cần thiết khác.</p>
                    </div>
                    <div className="step">
                        <h3>Bước 3: Phỏng Vấn (Nếu Cần)</h3>
                        <p>Nếu được yêu cầu, bạn sẽ tham gia vào một cuộc phỏng vấn để đánh giá khả năng và sự phù hợp của bạn với chương trình học.</p>
                    </div>
                    <div className="step">
                        <h3>Bước 4: Nhận Thông Báo Kết Quả</h3>
                        <p>Sau khi hoàn tất các bước trên, chúng tôi sẽ gửi thông báo kết quả qua email của bạn.</p>
                    </div>
                </div>
            </section>

            {/* Scholarship Information */}
            <section className="scholarship-info">
                <h2>Thông Tin Học Bổng</h2>
                <p>Chúng tôi cung cấp nhiều loại học bổng hấp dẫn dành cho các sinh viên xuất sắc. Đây là cơ hội để bạn giảm bớt gánh nặng tài chính trong suốt quá trình học tập.</p>
                <ul>
                    <li>Học bổng toàn phần cho sinh viên có thành tích xuất sắc.</li>
                    <li>Học bổng giảm 50% học phí cho các sinh viên nghèo vượt khó.</li>
                    <li>Học bổng cho các sinh viên quốc tế.</li>
                </ul>
                <a href="#apply" className="btn-main">Đăng Ký Nhận Học Bổng</a>
            </section>
        </div>
    );
};

export default Admissions;
