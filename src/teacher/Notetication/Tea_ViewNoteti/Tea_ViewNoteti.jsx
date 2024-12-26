import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Tea_ViewNoteti.scss';

const Tea_ViewNoteti = () => {
    useEffect(() => {
        setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);
    }, []);
    const allNotifications = [
        {
            id: 1,
            title: "Hội thảo quốc tế về AI và tương lai công nghệ",
            date: "2024-11-25",
            time: "08:00",
            content: "Hội thảo quốc tế về trí tuệ nhân tạo sẽ diễn ra tại Hội trường lớn, mang đến cơ hội cho giảng viên và sinh viên nắm bắt xu hướng công nghệ mới.",
        },
        {
            id: 2,
            title: "Thông báo về học bổng tài năng dành cho sinh viên xuất sắc",
            date: "2024-11-22",
            time: "10:30",
            content: "Học bổng dành cho sinh viên xuất sắc năm học 2024. Hạn chót nộp hồ sơ: 2024-12-15. Liên hệ Phòng Đào tạo để biết thêm chi tiết.",
        },
        {
            id: 3,
            title: "Cập nhật chính sách giảng dạy mới cho giảng viên",
            date: "2024-11-20",
            time: "14:00",
            content: "Từ học kỳ tới, giảng viên phải nộp kế hoạch giảng dạy trước 2 tuần so với thời gian bắt đầu môn học. Thông tin chi tiết đã được gửi qua email trường.",
        },
        {
            id: 4,
            title: "Chính sách tuyển sinh năm học 2024-2025",
            date: "2024-11-18",
            time: "09:00",
            content: "Trường sẽ áp dụng chính sách tuyển sinh mới trong năm học 2024-2025. Vui lòng theo dõi thông báo trên trang chủ của trường để biết chi tiết.",
        },
        {
            id: 5,
            title: "Thông báo về việc tổ chức lễ kỷ niệm thành lập trường",
            date: "2024-11-15",
            time: "16:00",
            content: "Lễ kỷ niệm thành lập trường sẽ được tổ chức vào ngày 1 tháng 12 tại hội trường lớn. Mời tất cả cán bộ, giảng viên và sinh viên tham gia.",
        },
        {
            id: 6,
            title: "Thông báo về việc tổ chức lễ kỷ niệm thành lập trường",
            date: "2024-11-15",
            time: "16:00",
            content: "Lễ kỷ niệm thành lập trường sẽ được tổ chức vào ngày 1 tháng 12 tại hội trường lớn. Mời tất cả cán bộ, giảng viên và sinh viên tham gia.",
        },
        {
            id: 7,
            title: "Thông báo về việc tổ chức lễ kỷ niệm thành lập trường",
            date: "2024-11-15",
            time: "16:00",
            content: "Lễ kỷ niệm thành lập trường sẽ được tổ chức vào ngày 1 tháng 12 tại hội trường lớn. Mời tất cả cán bộ, giảng viên và sinh viên tham gia.",
        },
        {
            id: 8,
            title: "Thông báo về việc tổ chức lễ kỷ niệm thành lập trường",
            date: "2024-11-15",
            time: "16:00",
            content: "Lễ kỷ niệm thành lập trường sẽ được tổ chức vào ngày 1 tháng 12 tại hội trường lớn. Mời tất cả cán bộ, giảng viên và sinh viên tham gia.",
        },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Calculate current notifications to display based on page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentNotifications = allNotifications.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Calculate total pages
    const totalPages = Math.ceil(allNotifications.length / itemsPerPage);

    return (
        <div className="Notetication">
            {/* Cột thông báo chính */}
            <div className="grid__column-2-3">
                <div className="View_Note">
                    <h1 className="Noteti_title">THÔNG BÁO GIẢNG VIÊN</h1>
                    <div className="notification-list">
                        {currentNotifications.map((note) => (
                            <div key={note.id} className="notification_item">
                                <div className="date_time">
                                    <h4 className="date_now">{note.date}</h4>
                                    <h4 className="time_now">{note.time}</h4>
                                </div>
                                <div className="notification_content">
                                    <h2 className="note_title">{note.title}</h2>
                                    <p className="note_content">{note.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Phân trang */}
                    <div className="pagination">
                        <button
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="page-btn"
                        >
                            Prev
                        </button>
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => paginate(index + 1)}
                                className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="page-btn"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* Cột menu */}
            <div className="grid__column-1-3">
                <div className="Menu_Notetication">
                    <h1 className="Notetie_title_menu">THÔNG BÁO GIẢNG VIÊN</h1>
                    <div className="menu_table">
                        <a href="#">Hội thảo, tập huấn và buổi họp</a>
                        <a href="#">Nghiên cứu và học bổng</a>
                        <a href="#">Thủ tục hành chính</a>
                        <a href="#">Chính sách và quy định mới</a>
                        <a href="#">Biểu mẫu</a>
                        <a href="#">Lịch giảng dạy</a>
                        <a href="#">Lịch coi thi và chấm thi</a>
                    </div>
                </div>
                <div className="Menu_Manage_Notetication">
                    <h1 className="Notetie_title_menu">QUẢN LÝ THÔNG BÁO GIẢNG VIÊN</h1>
                    <div className="menu_table">
                        <Link to="/tea_off_createnoteti">Đăng ký báo nghỉ</Link>
                        <Link to="/tea_on_createnoteti">Đăng ký báo bù</Link>
                        <Link to="/tea_createnoteti_session">Tạo thông báo môn học</Link>
                        <Link to="/tea_view_createnoteti">Xem thông tin đăng kí</Link>
                        <Link to="/tea_view_createnoteti_session">Xem thông báo đã tạo</Link>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tea_ViewNoteti;
