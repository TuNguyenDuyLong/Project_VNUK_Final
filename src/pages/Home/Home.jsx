import React from 'react';
import './Home.scss';

const Home = () => {
    return (
        <div className="home">
            <header className="hero-section">
                <div className="hero-text">
                    <h1>VIỆN ĐÀO TẠO NGHIÊN CỨU VIỆN - ANH</h1>
                    <p>Giải pháp giáo dục sáng tạo, tiên tiến và phát triển toàn diện</p>
                    <button className="cta-btn">Khám Phá Ngay</button>
                </div>
            </header>

            <section className="about">
                <div className="container">
                    <h2>Giới Thiệu Về Viện</h2>
                    <p>
                        Viện Đào Tạo Nghiên Cứu Việt Anh tự hào là một trong những cơ sở giáo dục uy tín tại Việt Nam, cung cấp các chương trình đào tạo chất lượng cao, nghiên cứu khoa học ứng dụng phục vụ xã hội và phát triển kinh tế.
                    </p>
                </div>
            </section>

            <section className="programs">
                <div className="container">
                    <h2>Chương Trình Đào Tạo</h2>
                    <div className="programs-list">
                        <div className="program">
                            <h3>Chương Trình Cử Nhân</h3>
                            <p>
                                Đào tạo cử nhân các ngành như Công nghệ thông tin, Kinh tế, Quản trị kinh doanh, và nhiều ngành khác.
                            </p>
                        </div>
                        <div className="program">
                            <h3>Chương Trình Sau Đại Học</h3>
                            <p>
                                Chương trình thạc sĩ và tiến sĩ giúp học viên nâng cao kiến thức chuyên sâu trong các lĩnh vực nghiên cứu hàng đầu.
                            </p>
                        </div>
                        <div className="program">
                            <h3>Khóa Học Ngắn Hạn</h3>
                            <p>
                                Cung cấp các khóa học ngắn hạn, tập trung vào việc nâng cao kỹ năng chuyên môn cho người đi làm.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="research">
                <div className="container">
                    <h2>Nghiên Cứu & Phát Triển</h2>
                    <p>
                        Viện luôn chú trọng nghiên cứu khoa học ứng dụng, đồng thời hợp tác với các viện nghiên cứu quốc tế để phát triển các giải pháp sáng tạo và phục vụ cộng đồng.
                    </p>
                </div>
            </section>

            <section className="faculty">
                <div className="container">
                    <h2>Đội Ngũ Giảng Viên</h2>
                    <p>
                        Đội ngũ giảng viên của chúng tôi gồm các chuyên gia đầu ngành, giảng viên là các giáo sư, tiến sĩ với nhiều năm kinh nghiệm trong việc giảng dạy và nghiên cứu.
                    </p>
                </div>
            </section>


        </div>
    );
};

export default Home;
