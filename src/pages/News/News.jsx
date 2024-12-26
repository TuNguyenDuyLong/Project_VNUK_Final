import React from 'react';
import './News.scss';

const News = () => {
    const newsArticles = [
        {
            title: "Thông Báo Tuyển Sinh Năm 2024",
            date: "15/11/2024",
            content: "Trường Đại học ABC thông báo tuyển sinh các chương trình đại học chính quy năm 2024. Xem chi tiết tại website của trường.",
            image: "https://vnuk.edu.vn/wp-content/uploads/2022/05/544A6437-copy-scaled.jpg",
        },
        {
            title: "Chúc Mừng Sinh Viên Đạt Giải Học Bổng",
            date: "10/11/2024",
            content: "Trường Đại học ABC xin chúc mừng các sinh viên xuất sắc nhận học bổng toàn phần năm học 2024.",
            image: "https://diendantuyensinh24h.com/uploads/photos/shares/Dai-hoc-mien-trung/vien-nghien-cuu-va-dao-tao-viet-anh-dai-hoc-da-nang.jpg",
        },
        {
            title: "Sự Kiện Kỷ Niệm 20 Năm Thành Lập Trường",
            date: "05/11/2024",
            content: "Chúng tôi vui mừng thông báo về sự kiện kỷ niệm 20 năm thành lập Trường Đại học ABC sẽ được tổ chức vào ngày 25 tháng 12.",
            image: "https://vnuk.edu.vn/wp-content/uploads/2024/11/HY_07668-min-scaled-800x533.jpg",
        }
    ];

    return (
        <div className="news-container">
            <h1 className="news-title">Tin Tức Mới Nhất</h1>
            <div className="news-list">
                {newsArticles.map((article, index) => (
                    <div key={index} className="news-item">
                        <img src={article.image} alt={article.title} className="news-item-image" />
                        <div className="news-item-content">
                            <h2 className="news-item-title">{article.title}</h2>
                            <p className="news-item-date">{article.date}</p>
                            <p className="news-item-description">{article.content}</p>
                            <a href="#more" className="btn-read-more">Đọc Thêm</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default News;
