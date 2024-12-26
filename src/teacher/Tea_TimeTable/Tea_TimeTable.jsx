import React, { useState, useEffect } from 'react';
import './Tea_TimeTable.scss';
import config from '../../config';

const TimeTable = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [week, setWeek] = useState(''); // Tuần hiện tại (người dùng chọn)
    const [selectedWeek, setSelectedWeek] = useState([]); // Danh sách tuần
    const [tableData, setTableData] = useState([]); // Dữ liệu thời khóa biểu
    const [error, setError] = useState(null); // Lưu lỗi (nếu có)
    const [currentWeekName, setCurrentWeekName] = useState(''); // Tên tuần hiện tại

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

    // Lấy danh sách tuần
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
                console.log('Dữ liệu tuần đã lấy:', data);
                setSelectedWeek(data);

                // Nếu không chọn tuần mặc định, hãy để người dùng chọn tuần
                const currentWeek = data.find(weekObj => weekObj.currentWeek === true);
                if (currentWeek) {
                    setCurrentWeekName(`Tuần ${currentWeek.week} (${currentWeek.weekStart} - ${currentWeek.weekEnd})`);
                }
            } catch (error) {
                setError(error.message);
            }
        };
        fetchWeekList();
    }, []);

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

        // Log giá trị của selectedSemester để kiểm tra
        console.log('Selected Semester:', selectedSemester);

        // Gọi API lấy thời khóa biểu của học kỳ
        const apiUrl = `${config.API_BASE_URL}/api/TimeTable/getTeacherTimeTable?semestersID=${selectedSemester}`;
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
                    setTableData(data); // Nếu có dữ liệu hợp lệ, set vào state
                } else {
                    setTableData([]);
                    console.warn('Không có dữ liệu thời khóa biểu cho học kỳ này.');
                }
                setError(null); // Reset lỗi nếu có
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                setTableData([]); // Xóa dữ liệu trước khi xử lý lỗi
                setError(`Lỗi: ${error.message}`); // Hiển thị thông báo lỗi
            });
    };


    const handleWeekSearch = () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.error('Token không hợp lệ');
            setError('Token không hợp lệ');
            return;
        }

        // Kiểm tra xem đã chọn tuần chưa
        if (!week) {
            setError('Vui lòng chọn tuần!');
            return;
        }

        // Gọi API lấy thời khóa biểu cho tuần
        const apiUrl = `${config.API_BASE_URL}/api/TimeTable/GetTeacherTimeTableFoWeek?week=${week}&semesterId=${selectedSemester}`;
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
                    setTableData(data); // Nếu có dữ liệu hợp lệ, set vào state
                } else {
                    setTableData([]);
                    console.warn('Không có dữ liệu thời khóa biểu cho tuần này.');
                }
                setError(null); // Reset lỗi nếu có
            })
            .catch(error => {
                console.error('Lỗi khi gọi API:', error);
                setTableData([]); // Xóa dữ liệu trước khi xử lý lỗi
                setError(`Lỗi: ${error.message}`); // Hiển thị thông báo lỗi
            });
    };

    return (
        <div className="timetable-container">
            <h2 className="timetable-title">TRA CỨU LỊCH DẠY</h2>

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
            </div>

            <div className="filter-container">
                <select
                    id="week"
                    value={week}
                    onChange={(e) => setWeek(e.target.value)}
                    required
                >
                    <option value="" disabled>Chọn tuần</option>
                    {Array.isArray(selectedWeek) && selectedWeek.map((weekObj) => (
                        <option key={weekObj.week} value={weekObj.week}>
                            Tuần {weekObj.week} ({weekObj.weekStart} - {weekObj.weekEnd})
                        </option>
                    ))}
                </select>
            </div>

            <div className="button-container">
                <button className="button_search_smt" onClick={handleSemesterSearch}>Tra cứu theo học kỳ</button>
                <button className="button_search_week" onClick={handleWeekSearch}>Tra cứu theo tuần</button>

            </div>

            {error && <div className="error-message">{error}</div>}

            {currentWeekName && <h2 className="current-week">{currentWeekName}</h2>}

            {tableData.length > 0 ? (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Tên học phần</th>
                            <th>Tín chỉ</th>
                            <th>Lớp tín chỉ</th>
                            <th>Thứ 2</th>
                            <th>Thứ 3</th>
                            <th>Thứ 4</th>
                            <th>Thứ 5</th>
                            <th>Thứ 6</th>
                            <th>Thứ 7</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row, index) => (
                            <tr key={index}>
                                <td>{row.subjectsName}</td>
                                <td>{row.numberOfCredits}</td>
                                <td>{row.courseClassID}</td>
                                {[2, 3, 4, 5, 6, 7].map(day => (
                                    <td key={day}>
                                        {row.dayOfWeekName === `Thứ ${day}`
                                            ? `${row.classPeriodName} (${row.roomName})`
                                            : ''}
                                    </td>
                                ))}
                                <td>{row.note}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Tên học phần</th>
                            <th>Tín chỉ</th>
                            <th>Lớp tín chỉ</th>
                            <th>Thứ 2</th>
                            <th>Thứ 3</th>
                            <th>Thứ 4</th>
                            <th>Thứ 5</th>
                            <th>Thứ 6</th>
                            <th>Thứ 7</th>
                            <th>Ghi chú</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="Null_value">
                            <td colSpan="11" style={{ textAlign: 'center' }}>
                                Không có dữ liệu nào được tìm thấy
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}

            {/* Các tiết học */}
            <h3 className="period-time-table-title">THỜI GIAN CÁC TIẾT HỌC</h3>
            <table className="period-time-table">
                <thead>
                    <tr>
                        <th>Tiết</th>
                        <th>Thời gian</th>
                    </tr>
                </thead>
                <tbody>
                    {[
                        '7:00 AM - 7:45 AM',
                        '7:45 AM - 8:30 AM',
                        '8:30 AM - 9:15 AM',
                        '9:15 AM - 10:00 AM',
                        '10:00 AM - 10:45 AM',
                        '10:45 AM - 11:30 AM',
                        '11:30 AM - 12:15 PM',
                        '12:15 PM - 1:00 PM',
                        '1:00 PM - 1:45 PM',
                        '1:45 PM - 2:30 PM',
                        '2:30 PM - 3:15 PM',
                        '3:15 PM - 4:00 PM',
                        '4:00 PM - 4:45 PM',
                        '4:45 PM - 5:30 PM',
                        '5:30 PM - 6:15 PM',
                    ].map((time, index) => (
                        <tr key={index}>
                            <td>Tiết {index + 1}</td>
                            <td>{time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TimeTable;
