import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="grid">
                <div className="grid__row">
                    <div className="grid__column-2-5">
                        <h4 className='footer_title_1'>Viện Nghiên cứu và Đào tạo Việt – Anh</h4>
                        <ul>
                            <li><a href="/gioi-thieu">Giới thiệu</a></li>
                            <li><a href="/tuyen-sinh">Tuyển sinh</a></li>
                            <li><a href="/chinh-sach">Chính sách</a></li>
                            <li><a href="/do-an">Đồ án</a></li>
                        </ul>
                    </div>

                    <div className="grid__column-2-5">
                        <h4>Liên hệ</h4>
                        <ul>
                            <li><a href="/lien-he">Thông tin liên hệ</a></li>
                            <li><a href="mailto:contact@university.edu">Email: contact@university.edu</a></li>
                            <li><a href="tel:+84123456789">Điện thoại: 0123456789</a></li>
                        </ul>
                    </div>

                    <div className="grid__column-2-5">
                        <h4>Tài nguyên học tập</h4>
                        <ul>
                            <li><a href="/thu-vien">Thư viện</a></li>
                            <li><a href="/online-courses">Khóa học trực tuyến</a></li>
                            <li><a href="/chuong-trinh-hoc">Chương trình học</a></li>
                            <li><a href="/sinh-vien">Dành cho sinh viên</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
