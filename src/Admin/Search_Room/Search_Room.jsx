import React, { useEffect, useState } from 'react';
import './Search_Room.scss';
import config from '../../config';

const Search_Room = () => {
    const [scheduleData, setScheduleData] = useState([]); // Lưu trữ lịch giảng
    const [roomData, setRoomData] = useState([]); // Lưu trữ dữ liệu phòng học
    const [selectedRoom, setSelectedRoom] = useState(''); // Phòng học đã chọn
    const [week, setWeek] = useState(''); // Tuần được chọn
    const [selectedWeek, setSelectedWeek] = useState([]); // Danh sách tuần
    const [error, setError] = useState(null); // Lưu lỗi (nếu có)

    // Lấy danh sách tuần khi component được mount
    useEffect(() => {
        const fetchWeekList = async () => {
            const token = localStorage.getItem('token');
            const apiUrl = `${config.API_BASE_URL}/api/Common/getWeek`;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Không thể tải danh sách tuần');

                const data = await response.json();
                setSelectedWeek(data);
                const currentWeek = data.find(weekObj => weekObj.currentWeek === true);
                if (currentWeek) {
                    setWeek(currentWeek.week); // Set tuần hiện tại nếu có
                }
            } catch (error) {
                setError(error.message);
            }
        };
        fetchWeekList();
    }, []);

    // Fetch room data sau khi chọn tuần
    useEffect(() => {
        if (week) {
            const token = localStorage.getItem('token');
            const apiUrl = `${config.API_BASE_URL}/api/RoomBooking/ListRoom?week=${week}`;

            fetch(apiUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Không thể tải danh sách phòng học');
                    }
                    return response.json();
                })
                .then((data) => {
                    setRoomData(data || []); // Set phòng học vào state
                    setError(null); // Reset lỗi nếu có
                })
                .catch((error) => {
                    setRoomData([]);
                    setError(`Lỗi: ${error.message}`);
                });
        }
    }, [week]); // Lấy dữ liệu phòng học khi tuần thay đổi

    // Lọc phòng theo phòng đã chọn
    const filteredRooms = selectedRoom
        ? roomData.filter(room => room.roomID === selectedRoom)
        : roomData;

    return (
        <div className="room-manager">
            <h2 className="exam-schedule-title">TRA CỨU PHÒNG HỌC</h2>
            <div className="filter-container">
                <label className="room_title_select">Chọn tuần: </label>
                <select
                    id="week"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)} // Cập nhật tuần
                    required
                >
                    <option value="" disabled>Chọn tuần</option>
                    {selectedWeek.map((weekObj) => (
                        <option key={weekObj.week} value={weekObj.week}>
                            Tuần {weekObj.week} ({weekObj.weekStart} - {weekObj.weekEnd})
                        </option>
                    ))}
                </select>
                <button onClick={() => setWeek(week)}>Tra cứu</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Dropdown chọn phòng */}
            <div className="room_selector">
                <label className="room_title_select">Chọn phòng: </label>
                <select
                    id="roomselect"
                    className="dropdown_room"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)} // Cập nhật phòng
                >
                    <option value="">Tất cả</option>
                    {roomData.map((room) => (
                        <option key={room.roomID} value={room.roomID}>
                            {room.roomID} {/* Hiển thị tên phòng */}
                        </option>
                    ))}
                </select>
            </div>

            <table className="result-table">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Phòng</th>
                        {scheduleData.map((day) => (
                            <th key={day.dayofWeeksID}>{day.dayofWeeksName}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredRooms.map((room, index) => (
                        <tr key={room.roomID}>
                            <td>{index + 1}</td>
                            <td>{room.roomID}</td>
                            {scheduleData.map((day) => {
                                const classesInRoom = day.classes?.filter((cls) => cls.roomID === room.roomID) || [];
                                return (
                                    <td key={`${room.roomID}-${day.dayofWeeksID}`}>
                                        {classesInRoom.map((cls, idx) => (
                                            <div key={idx}>
                                                {cls.teacher} ({cls.periods})
                                            </div>
                                        ))}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Search_Room;
