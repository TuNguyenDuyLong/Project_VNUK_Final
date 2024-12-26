import React, { useState, useEffect } from 'react';
import './Tea_View_CreateNoteti.scss';
import { Link } from 'react-router-dom';
import config from '../../../config';

const Tea_View_CreateNoteti = () => {
    const [notifications, setNotifications] = useState([]);
    const [makeupNotifications, setMakeupNotifications] = useState([]);
    const [selectedNotificationType, setSelectedNotificationType] = useState('nghỉ');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/NoticeOfLeaves/GetTeacherNoticeOfLeave`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Lỗi từ API: ${response.statusText}`);
                }

                const data = await response.json();
                const sortedNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setNotifications(sortedNotifications);
                console.log('Thông báo nghỉ đã lưu:', data);
            } catch (error) {
                console.error('Lỗi khi lấy thông báo:', error);
            }
        };

        const fetchMakeupNotifications = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/NoticeOffset/GetTeacherNoticeOffset`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`Lỗi từ API: ${response.statusText}`);
                }

                const data = await response.json();
                const sortedMakeupNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setMakeupNotifications(sortedMakeupNotifications);
                console.log('Thông báo bù đã lưu:', data);
            } catch (error) {
                console.error('Lỗi khi lấy thông báo bù:', error);
            }
        };

        fetchNotifications();
        fetchMakeupNotifications();
    }, []);

    const deleteNotification = async (adjustmentID) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa thông báo này?');
        if (!isConfirmed) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/NoticeOfLeaves/DeleteNoticeOfLeave?adjustmentID=${adjustmentID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Lỗi từ API: ${response.statusText}`);
            }

            const data = await response.json();
            const sortedNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setNotifications(sortedNotifications);
            console.log('Thông báo nghỉ đã lưu:', sortedNotifications);
            setNotifications(prevNotifications => prevNotifications.filter(notification => notification.adjustmentID !== adjustmentID));
            alert('Thông báo đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error);
            alert('Không thể xóa thông báo!');
        }
    };

    const deleteMakeupNotification = async (noticeOffsetID) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa thông báo bù này?');
        if (!isConfirmed) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/NoticeOffset/DeleteNoticeOffset?noticeOffset=${noticeOffsetID}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorDetails = await response.json();
                throw new Error(`Lỗi từ API: ${errorDetails.message || 'Lỗi không xác định'}`);
            }

            const data = await response.json();
            const sortedMakeupNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
            setMakeupNotifications(sortedMakeupNotifications);
            console.log('Thông báo bù đã lưu:', sortedMakeupNotifications);

            // Xoá thông báo khỏi state  
            setMakeupNotifications(prevNotifications => {
                const idsToDelete = new Set(noticeOffsetID.split(','));
                return prevNotifications.filter(notification => {
                    const notificationIDs = notification.noticeOffsetID.split(',');
                    return !notificationIDs.some(id => idsToDelete.has(id));
                });
            });

            alert('Thông báo bù đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa thông báo bù:', error);
            alert(`Không thể xóa thông báo bù: ${error.message}`);
        }
    };

    const exportToCalendar = async (noticeOffsetID) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xuất thông báo này?');
        if (!isConfirmed) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/Calendar/Create-event?noticeID=${noticeOffsetID}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            // Kiểm tra phản hồi từ API
            if (response.status === 204) {
                alert('Đã xuất thông báo thành công vào lịch!');

                // Điều hướng sang trang lịch
                window.location.href = "https://calendar.google.com/calendar/u/0/r";
                return;
            }

            if (!response.ok) {
                let errorDetails = {};
                try {
                    errorDetails = await response.json();
                } catch (e) {
                    console.error('Không thể đọc phản hồi JSON:', e);
                }
                throw new Error(`Lỗi từ API: ${errorDetails.message || 'Lỗi không xác định'}`);
            }

            alert('Đã xuất thông báo thành công vào lịch!');
        } catch (error) {
            console.error('Lỗi khi xuất thông báo vào lịch:', error);
            alert(`Không thể xuất: ${error.message}`);
        }
    };



    return (
        <div className="Notetication">
            <div className="grid__column-2-3">
                <div className="View_Notetication">
                    <h1 className="Noteti_title">LỊCH SỬ ĐĂNG KÝ</h1>

                    {/* Chọn loại thông báo (nghỉ, bù) */}
                    <div className="notification-types">
                        <h2
                            className={`section-title ${selectedNotificationType === 'nghỉ' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('nghỉ')}
                        >
                            ĐĂNG KÝ BÁO NGHỈ
                        </h2>
                        <h2
                            className={`section-title ${selectedNotificationType === 'bù' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('bù')}
                        >
                            ĐĂNG KÝ BÁO BÙ
                        </h2>
                    </div>
                    <div className="Noteti_Content">
                        {selectedNotificationType === 'nghỉ' ? (
                            notifications.length > 0 ? (
                                <div className="notification-list">
                                    {notifications.map((notification) => (
                                        <div key={notification.adjustmentID}>
                                            <div className="NotificationDetail-block">
                                                <div><strong>Ngày tạo:</strong> {new Date(notification.createdDate).toLocaleString()}</div>
                                                <div><h3>{notification.subjectName} - {notification.courseClassID}</h3></div>
                                                <div><strong>Môn học nghỉ:</strong> {notification.subjectName}</div>
                                                <div><strong>Lớp nghỉ:</strong> {notification.courseClassID}</div>
                                                <div><strong>Tuần nghỉ:</strong> {notification.weekOff || "Chưa có tuần nghỉ"}</div>
                                                <div><strong>Thứ nghỉ:</strong> {notification.dayofWeekName}</div>
                                                <div>
                                                    <strong>Tiết nghỉ:</strong>{" "}
                                                    {notification.classPeriodName
                                                        ? notification.classPeriodName.split(',').join(", ")
                                                        : "Không có tiết học"}
                                                </div>
                                                <div><strong>Lý do nghỉ:</strong> {notification.reason || "Chưa có lý do"}</div>

                                                {/* Nút Xóa */}
                                                <button
                                                    onClick={() => deleteNotification(notification.adjustmentID)}
                                                    className="delete-button"
                                                >
                                                    Xóa thông báo
                                                </button>


                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Chưa có đăng ký báo nghỉ nào.</p>
                            )
                        ) : selectedNotificationType === 'bù' ? (
                            makeupNotifications.length > 0 ? (
                                <div className="notification-list">
                                    {makeupNotifications.map((makeupNotification) => (
                                        <div key={makeupNotification.noticeOffsetID}>
                                            <div className="NotificationDetail-block">
                                                <div><strong>Ngày tạo:</strong> {new Date(makeupNotification.createdDate).toLocaleString()}</div>
                                                <div><h3>{makeupNotification.subjectName} - {makeupNotification.courseClassID}</h3></div>
                                                <div><strong>Môn học:</strong> {makeupNotification.subjectName}</div>
                                                <div><strong>Lớp:</strong> {makeupNotification.courseClassID}</div>
                                                <div><strong>Phòng học:</strong> {makeupNotification.roomName || "Chưa có phòng học"}</div>
                                                <div><strong>Tuần học:</strong> {makeupNotification.weekOffset || "Chưa có tuần bù"}</div>
                                                <div><strong>Thứ:</strong> {makeupNotification.dayofWeekName}</div>
                                                <div>
                                                    <strong>Tiết học:</strong>
                                                    {makeupNotification.classPeriodname
                                                        ? makeupNotification.classPeriodname.split(',').join(", ")
                                                        : "Không có tiết học"}
                                                </div>
                                                <div><strong>Thông báo:</strong> {makeupNotification.note || "Chưa có thông báo"}</div>

                                                {/* Nút Xóa */}
                                                <button
                                                    onClick={() => deleteMakeupNotification(makeupNotification.noticeOffsetID)}
                                                    className="delete-button"
                                                >
                                                    Xóa thông báo
                                                </button>

                                                <button
                                                    onClick={() => exportToCalendar(makeupNotification.noticeOffsetID)}
                                                    className="export-button"
                                                >
                                                    Tạo google calendar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>Chưa có đăng ký báo bù nào.</p>
                            )
                        ) : null}
                    </div>
                </div>
            </div>

            <div className="grid__column-1-3">
                <div className="Menu_Notetication">
                    <h1 className="Notetie_title_menu">THÔNG BÁO DÀNH CHO GIẢNG VIÊN</h1>
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

export default Tea_View_CreateNoteti;