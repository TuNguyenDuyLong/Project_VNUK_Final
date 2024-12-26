import React, { useState, useEffect } from 'react';
import './Register_Room.scss';
import { Link } from 'react-router-dom';
import config from '../../config';

const Register_Room = () => {
    const [semesters, setSemesters] = useState([]);
    const [selectedSemester, setSelectedSemester] = useState('');
    const [week, setWeek] = useState('');
    const [weekBooking, setWeekBooking] = useState('');
    const [selectedDayOfWeek, setSelectedDayOfWeek] = useState('');
    const [classPeriods, setClassPeriods] = useState([]);
    const [classRoom, setClassRoom] = useState('');
    const [classRooms, setClassRooms] = useState([]);
    const [periodDayOfWeek, setPeriodDayOfWeek] = useState([]);
    const [error, setError] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState([]);
    const [purpose, setPurpose] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Token không hợp lệ');
            return;
        }

        fetch(`${config.API_BASE_URL}/api/Common/GetSemester`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => response.ok ? response.json() : Promise.reject('Không thể tải danh sách học kỳ'))
            .then(data => setSemesters(data))
            .catch(error => setError(error));
    }, []);

    useEffect(() => {
        const fetchDaysOfWeek = async () => {
            const token = localStorage.getItem('token');
            const apiUrl = `${config.API_BASE_URL}/api/RoomBooking/GetDayofWeeks`;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Không thể tải danh sách thứ');

                const data = await response.json();
                setDaysOfWeek(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchDaysOfWeek();
    }, []);

    useEffect(() => {
        if (!selectedDayOfWeek) return;

        const token = localStorage.getItem('token');
        fetch(`${config.API_BASE_URL}/api/RoomBooking/GetClassPeriod?dayofWeekID=${selectedDayOfWeek}`, {
            headers: { 'Authorization': `Bearer ${token}` },
        })
            .then(response => response.ok ? response.json() : Promise.reject('Không thể tải tiết học'))
            .then(data => {
                const sortedPeriods = data.sort((a, b) => a.classPeriodID - b.classPeriodID);
                setPeriodDayOfWeek(sortedPeriods);
            })
            .catch(error => setError(error));
    }, [selectedDayOfWeek]);

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
                setWeekBooking(data);
                const currentWeek = data.find(weekObj => weekObj.currentWeek === true);
                if (currentWeek) {
                    setWeek(currentWeek.week);
                }
            } catch (error) {
                setError(error.message);
            }
        };

        fetchWeekList();
    }, []);

    const handleFindRoomClick = async () => {
        // Lấy thông tin các phòng học trống từ API và xử lý
        try {
            const availableRooms = await getAvailableRooms({
                selectedSemester,
                classPeriods,
                week,
                selectedDayOfWeek
            });

            setClassRooms(availableRooms);
        } catch (error) {
            setError('Lỗi khi tìm phòng học trống: ' + error.message);
        }
    };
    const handleCheckboxChange = (e, periodID) => {
        if (e.target.checked && classPeriods.length < 10) {
            setClassPeriods([...classPeriods, periodID]);
        } else if (!e.target.checked) {
            setClassPeriods(classPeriods.filter(id => id !== periodID));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra xem các trường bắt buộc có giá trị hợp lệ không
        if (!selectedSemester || !classRoom || !week || !selectedDayOfWeek || classPeriods.length === 0) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        const parsedWeek = parseInt(week, 10);

        if (isNaN(parsedWeek) || parsedWeek <= 0) {
            alert('Tuần học bắt đầu từ tuần 4 và kết thúc là tuần 18 !!!.');
            return;
        }

        // Tạo thông báo với trường Purpose và SemesterID
        const noticeOffsetInputDto = {
            semesterID: selectedSemester,
            roomID: classRoom,
            classPeriodIDs: classPeriods,
            purpose: purpose,
        };
        console.log("selectedSemester:", selectedSemester);
        console.log("RoomID:", classRoom);
        console.log("classPeriods:", classPeriods);
        console.log("purpose:", purpose);

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/RoomBooking/CreateBookingRoom`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(noticeOffsetInputDto),
            });

            const responseText = await response.text(); // Đọc phản hồi dưới dạng văn bản thô

            if (!response.ok) {
                // Nếu mã trạng thái không phải 2xx, tức là có lỗi
                throw new Error(`Lỗi từ server: ${responseText}`);
            }

            // Kiểm tra nếu phản hồi là JSON
            try {
                const data = JSON.parse(responseText); // Thử phân tích cú pháp JSON
                console.log("Dữ liệu trả về từ server:", data);

                // Thêm thông báo vào danh sách
                alert('Thông báo đã được tạo thành công!');
                resetForm();
            } catch (jsonError) {
                console.error("Lỗi phân tích JSON:", jsonError);
                console.log("Phản hồi không phải là JSON hợp lệ:", responseText);
                alert(responseText || 'Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!');
                resetForm();
            }
        } catch (error) {
            console.error('Lỗi khi tạo thông báo:', error);
            alert(`Có lỗi xảy ra khi tạo thông báo: ${error.message}`);
            setError(error.message);
            resetForm();
        }
    };

    // Hàm reset form
    const resetForm = () => {
        setSelectedSemester('');
        setWeek('');
        setSelectedDayOfWeek('');
        setClassPeriods([]);
        setClassRoom('');
        setPurpose('');
    };

    const getAvailableRooms = async ({ selectedSemester, classPeriods, week }) => {
        const token = localStorage.getItem('token');
        const apiUrl = `${config.API_BASE_URL}/api/RoomBooking/GetAvailableRoom`;
        const requestBody = {
            semesterID: selectedSemester,
            classPeriodIDs: classPeriods,
            weekBooking: week,
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!response.ok) {
                throw new Error('Không thể lấy phòng trống');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Lỗi khi lấy phòng trống:', error);
            throw new Error(error.message);
        }
    };

    return (
        <div className="CreateNotification_com">
            <div className="grid__column-2-3">
                <div className="View_Created_Notetication_com">
                    <p className="CreateNotification_com_title">ĐĂNG KÝ PHÒNG</p>
                    <form onSubmit={handleSubmit}>
                        <div className="Dropdownlist">
                            <div className="form-group">
                                <label htmlFor="semester">Học kỳ:</label>
                                <select id="semester" value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)} required>
                                    <option value="" disabled>Chọn học kỳ</option>
                                    {semesters.map(semester => (
                                        <option key={semester.semestersID} value={semester.semestersID}>
                                            {semester.semestersName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label htmlFor="dayOfWeek">Thứ:</label>
                                <select
                                    id="dayOfWeek"
                                    value={selectedDayOfWeek}
                                    onChange={(e) => setSelectedDayOfWeek(e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Chọn thứ</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day.dayofWeeksID} value={day.dayofWeeksID}>
                                            {day.dayofWeeksName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tiết học:</label>
                            <div className="checkbox-group-scrollable">
                                {periodDayOfWeek.length > 0 ? (
                                    periodDayOfWeek.map(period => (
                                        <div key={period.classPeriodID} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                id={`period-${period.classPeriodID}`}
                                                value={period.classPeriodID}
                                                onChange={(e) => handleCheckboxChange(e, period.classPeriodID)}
                                                checked={classPeriods.includes(period.classPeriodID)}
                                            />
                                            <label htmlFor={`period-${period.classPeriodID}`}>{period.classPeriodName}</label>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có tiết học cho ngày này</p>  // Thông báo nếu không có tiết học
                                )}
                            </div>

                        </div>

                        <div className="form-group">
                            <button type="button" onClick={handleFindRoomClick} className="btn_search_roomroom">
                                Tìm phòng học
                            </button>
                        </div>

                        <div className="form-group">
                            <label>Phòng học:</label>
                            <div className="room-list">
                                {classRooms.length > 0 ? (
                                    classRooms.map(room => (
                                        <div key={room.roomID} className="room-item">
                                            <input
                                                type="radio"
                                                id={`room-${room.roomID}`}
                                                name="room"
                                                value={room.roomID}
                                                onChange={(e) => setClassRoom(e.target.value)}
                                                checked={classRoom === room.roomID}
                                            />
                                            <label htmlFor={`room-${room.roomID}`}>
                                                {room.roomName} ({room.numberOfSeat} chỗ, {room.roomType})
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p>Không có phòng học khả dụng.</p>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="week">Tuần:</label>
                            <select
                                id="week"
                                value={week}
                                onChange={(e) => setWeek(e.target.value)}
                                required
                            >
                                <option value="" disabled>Chọn tuần</option>
                                {Array.isArray(weekBooking) && weekBooking.map((weekObj) => (
                                    <option key={weekObj.week} value={weekObj.week}>
                                        Tuần {weekObj.week} ({weekObj.weekStart} - {weekObj.weekEnd})
                                    </option>
                                ))}

                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="note">Mục đích:</label>
                            <textarea
                                id="purpose"
                                value={purpose}
                                onChange={(e) => setPurpose(e.target.value)}
                                placeholder='Mục đích'
                            />
                        </div>

                        <div className="form-group">
                            <button className="btn_submit" type="submit">Đăng ký</button>
                        </div>

                        {error && <div className="error">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register_Room;
