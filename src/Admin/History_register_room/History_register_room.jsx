import React, { useState, useEffect } from 'react';
import './History_register_room.scss';
import { Link } from 'react-router-dom';
import config from '../../config';

const History_register_room = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('Token không hợp lệ');
            setError('Token không hợp lệ');
            return;
        }

        fetch(`${config.API_BASE_URL}/api/Common/GetSemester`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => response.json())
            .then(data => setSemesters(data))
            .catch(() => {
                setError('Không thể tải danh sách học kỳ');
                setSemesters([]);
            });
    }, []);


    const handleSemesterSearch = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.error('Token không hợp lệ');
            setError('Token không hợp lệ');
            return;
        }


        if (!selectedSemester) {
            setError('Vui lòng chọn học kỳ!');
            return;
        }


        const apiUrl = `${config.API_BASE_URL}/api/RoomBooking/GetRoomBooking?semesterId=${selectedSemester}`;
        console.log(`API URL gọi: ${apiUrl}`);

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log('Dữ liệu trả về từ API: ', data);


                if (data && Array.isArray(data) && data.length > 0) {
                    setNotifications(data);
                    setError(null);
                } else {
                    setNotifications([]);
                    setError('Chưa đăng kí phòng !!!');
                }
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                setNotifications([]);
                setError('Chọn sai học kỳ, vui lòng chọn lại !!!');
            });
    };

    const deleteNotification = async (bookingID) => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn xóa đăng ký phòng này?');
        if (!isConfirmed) return;

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/RoomBooking/DeleteBooking?bookingId=${bookingID}`, {
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

            setNotifications(prevNotifications => {
                const idsToDelete = new Set(bookingID.split(',')); // Chuyển thành tập hợp để so sánh nhanh
                return prevNotifications.filter(notification => {
                    const bookingIDs = notification.bookingID.split(','); // Chia bookingID của thông báo thành mảng
                    return !bookingIDs.some(id => idsToDelete.has(id)); // Giữ lại thông báo không trùng ID đã xóa
                });
            });

            alert('Đăng ký phòng đã được xóa thành công!');
        } catch (error) {
            console.error('Lỗi khi xóa đăng ký phòng:', error);
            alert(`Không thể xóa đăng ký phòng: ${error.message}`);
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
                                    <div key={notification.bookingID}>
                                        <div className="NotificationDetail-block">
                                            <div><strong>Ngày đăng ký: </strong> {new Date(notification.createdDate).toLocaleString()}</div>
                                            <div><h3>Phòng: {notification.roomName}</h3></div>
                                            <div><strong>Tuần đăng ký: </strong> {notification.weekBooking}</div>
                                            <div><strong>Thứ đăng ký: </strong> {notification.dayofWeekname}</div>
                                            <div><strong>Tiết đăng ký: </strong> {notification.classPeriodName}</div>
                                            <div><strong>Mục đích: </strong> {notification.purpose}</div>
                                            <div><strong>Bộ phận đăng ký: </strong> {notification.bookedBy}</div>
                                            <button
                                                onClick={() => deleteNotification(notification.bookingID)}
                                                className="delete-button"
                                            >
                                                Xóa đăng ký
                                            </button>
                                        </div>
                                    </div>

                                ))}
                            </div>
                        ) : (
                            <p>Chưa có đăng ký nào được tạo !!!</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid__column-1-3">
                <div className="Menu_Manage_Notetication">
                    <h1 className="Notetie_title_menu">QUẢN LÝ ĐĂNG KÝ PHÒNG</h1>
                    <div className="menu_table">
                        <Link to="/registration_room">Đăng ký phòng</Link>
                        <Link to="/history_register_room">Lịch sử đăng ký phòng</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default History_register_room;
