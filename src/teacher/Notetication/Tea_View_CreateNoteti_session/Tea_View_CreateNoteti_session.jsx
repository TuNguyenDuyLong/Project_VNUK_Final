import React, { useState, useEffect } from 'react';
import './Tea_View_CreateNoteti_session.scss';
import { Link } from 'react-router-dom';
import config from '../../../config';

const Tea_View_CreateNoteti_session = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const [error, setError] = useState(null); // Lưu lỗi (nếu có)

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.error('Token không hợp lệ'); // Log nếu không có token
            setError('Token không hợp lệ');
            return;
        }

        fetch(`${config.API_BASE_URL}/api/Common/GetSemester`, {
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token trong header
            },
        })
            .then(response => response.json())
            .then(data => setSemesters(data))
            .catch(() => {
                setError('Không thể tải danh sách học kỳ');
                setSemesters([]); // Nếu lỗi, danh sách học kỳ sẽ để trống
            });
    }, []);

    // Xử lý khi nhấn nút Tra cứu
    const handleSemesterSearch = () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.error('Token không hợp lệ');
            setError('Token không hợp lệ');
            return;
        }

        // Kiểm tra xem đã chọn học kỳ chưa
        if (!selectedSemester) {
            setError('Vui lòng chọn học kỳ!');
            return;
        }

        // Gọi API lấy thông báo môn học cho học kỳ đã chọn
        const apiUrl = `${config.API_BASE_URL}/api/ClassNotification/TeacherGetClassNotification?semesterID=${selectedSemester}`;
        console.log(`API URL gọi: ${apiUrl}`);

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Dữ liệu trả về từ API: ', data); // Log dữ liệu trả về từ API

                // Kiểm tra xem dữ liệu có hợp lệ không
                if (data && Array.isArray(data) && data.length > 0) {
                    setNotifications(data); // Nếu có dữ liệu hợp lệ, set vào state
                    setError(null); // Reset lỗi nếu có
                } else {
                    setNotifications([]);
                    setError('Không có thông báo nào cho học kỳ này.');
                    console.warn('Không có thông báo môn học cho học kỳ này.');
                }
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                setNotifications([]); // Xóa dữ liệu trước khi xử lý lỗi
                setError(`Lỗi: ${error.message}`); // Hiển thị thông báo lỗi
            });
    };

    const deleteNotification = async (notificationID) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa thông báo này?');
        if (!isConfirmed) return;

        // Loại bỏ thông báo khỏi UI ngay lập tức
        setNotifications(prevNotifications =>
            prevNotifications.filter(notification => notification.notificationID !== notificationID)
        );

        try {
            // Gọi API để xóa thông báo
            const response = await fetch(`${config.API_BASE_URL}/api/ClassNotification/DeleteClassNotification?notificationId=${notificationID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                alert('Không thể xóa thông báo!');
                return;
            }

            const data = await response.json();
            console.log('Danh sách dữ liệu:', data);


            if (Array.isArray(data)) {
                const sortedNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setNotifications(sortedNotifications);
            } else {
                console.warn('Dữ liệu trả về không phải là mảng:', data);
            }

            alert('Thông báo đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
            alert('Không thể xóa thông báo!');
        }
    };
    return (
        <div className="Notetication">
            <div className="grid__column-2-3">
                <div className="View_Notetication">
                    <h1 className="Noteti_title">LỊCH SỬ ĐĂNG KÝ</h1>
                    <div className="filter-container">
                        <select
                            value={selectedSemester}
                            onChange={e => setSelectedSemester(e.target.value)}
                        >
                            <option value="" disabled>Chọn học kỳ</option>
                            {semesters.map(semester => (
                                <option key={semester.semestersID} value={semester.semestersID}>
                                    {semester.semestersName}
                                </option>
                            ))}
                        </select>
                        <button onClick={handleSemesterSearch}>Tra cứu</button>
                    </div>
                    <div className="Noteti_Content">
                        {error && <p className="error-message">{error}</p>}
                        {notifications.length > 0 ? (
                            <div className="notification-list">
                                {notifications.map((notification) => (
                                    <div key={notification.notificationID}>
                                        <div className="NotificationDetail-block">
                                            <div><strong>Ngày tạo:</strong> {new Date(notification.createdDate).toLocaleString()}</div>
                                            <div><h3>{notification.title}</h3></div>
                                            <div><strong>Môn học:</strong> {notification.subjectName}</div>
                                            <div><strong>Lớp:</strong> {notification.courseClassID}</div>
                                            <div><strong>Nội dung:</strong> {notification.content}</div>
                                            {/* Nút Xóa */}
                                            <button
                                                onClick={() => deleteNotification(notification.notificationID)}
                                                className="delete-button"
                                            >
                                                Xóa thông báo
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Chưa có thông báo nào được tạo !!!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid__column-1-3">
                <div className="Menu_Manage_Notetication">
                    <h1 className="Notetie_title_menu">QUẢN LÝ THÔNG BÁO GIẢNG VIÊN</h1>
                    <div className="menu_table">
                        <Link to="/tea_off_createnoteti">Đăng ký báo nghỉ</Link>
                        <Link to="/tea_on_createnoteti">Đăng ký báo bù</Link>
                        <Link to="/tea_createnoteti_session">Tạo thông báo môn học</Link>
                        <Link to="/tea_view_createnoteti">Xem thông tin đăng kí</Link>
                        <Link to="/tea_view_createnoteti_session">Xem thông báo môn học đã tạo</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tea_View_CreateNoteti_session;
