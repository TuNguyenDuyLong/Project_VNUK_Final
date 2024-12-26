import React, { useState, useEffect } from 'react';
import './ViewNoteti.scss';
import { Link } from 'react-router-dom';
import config from '../../config';

const ViewNoteti = () => {
    const [notifications, setNotifications] = useState([]); // Thông báo nghỉ
    const [makeupNotifications, setMakeupNotifications] = useState([]); // Thông báo bù
    const [selectedNotificationType, setSelectedNotificationType] = useState('nghỉ'); // Loại thông báo được chọn

    // Lấy thông báo nghỉ và bù
    useEffect(() => {
        // Lấy thông báo nghỉ
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/NoticeOfLeaves/GetStudentNoticeOfLeave`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json();

                const sortedNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setNotifications(sortedNotifications);
                console.log('Thông báo nghỉ đã lưu:', sortedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Lấy thông báo bù
        const fetchMakeupNotifications = async () => {
            try {
                const response = await fetch(`${config.API_BASE_URL}/api/NoticeOffset/GetStudentNoticeOffset`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.statusText}`);
                }

                const data = await response.json();

                const sortedMakeupNotifications = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                setMakeupNotifications(sortedMakeupNotifications);
                console.log('Thông báo bù đã lưu:', sortedMakeupNotifications);
            } catch (error) {
                console.error('Error fetching makeup notifications:', error);
            }
        };

        fetchNotifications();
        fetchMakeupNotifications();
    }, []);  // Chạy chỉ khi component mount

    return (
        <div className="ViewNoteti">
            {/* Left Section: Danh sách thông báo */}
            <div className="grid__column-2-3">
                <div className="notification">

                    <h1>THÔNG BÁO TỪ GIẢNG VIÊN BỘ MÔN</h1>

                    {/* Tiêu đề chọn loại thông báo */}
                    <div className="notification-types">
                        <h2
                            className={`section-title ${selectedNotificationType === 'nghỉ' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('nghỉ')}
                        >
                            THÔNG BÁO NGHỈ
                        </h2>
                        <h2
                            className={`section-title ${selectedNotificationType === 'bù' ? 'active' : ''}`}
                            onClick={() => setSelectedNotificationType('bù')}
                        >
                            THÔNG BÁO BÙ
                        </h2>
                    </div>

                    {/* Hiển thị thông báo dựa trên loại được chọn */}
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

            {/* Right Section: Menu thông báo khác */}
            <div className="grid__column-1-3">
                <div className="Menu_Manage_Notetication_student">
                    <h1 className="Notetie_title_menu">THÔNG BÁO SINH VIÊN</h1>
                    <div className="menu_table">
                        <Link to="/viewnoteti">Tra cứu thông báo nghỉ - thông báo bù</Link>
                        <Link to="/viewNoteti_course">Tra cứu thông báo môn học</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewNoteti;
