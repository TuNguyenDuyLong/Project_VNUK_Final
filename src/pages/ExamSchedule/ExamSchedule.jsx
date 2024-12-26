import React, { useState, useEffect } from 'react';
import './ExamSchedule.scss';
import config from '../../config';

const ExamSchedule = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [examData, setExamData] = useState([]); // Dữ liệu lịch coi thi
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
    // Lọc dữ liệu theo học kỳ và giảng viên
    const handleFilterChange = () => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
            console.error('Token không hợp lệ'); // Log nếu không có token
            setError('Token không hợp lệ');
            return;
        }

        // Kiểm tra xem đã chọn học kỳ chưa
        if (!selectedSemester) {
            setError('Vui lòng chọn học kỳ!');
            return;
        }
        // Cập nhật URL để thêm ID học kỳ vào tham số
        const apiUrl = `${config.API_BASE_URL}/api/ExamSchedule/GetStudentExamSchedule?SemestersID=${selectedSemester}`;

        fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${token}`, // Gửi token trong header
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setExamData(data); // Lấy trực tiếp dữ liệu từ API mà không lọc
            })
            .catch(error => {
                setExamData([]);
                setError(`Lỗi: ${error.message}`);
            }); // Nếu lỗi, không hiển thị dữ liệu
    };

    // Định dạng ngày thi thành DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="exam-schedule-container">
            <h2 className="exam-schedule-title">TRA CỨU LỊCH THI</h2>

            <div className="filter-container">
                <select
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(e.target.value)}
                >
                    <option value="" disabled>Chọn học kỳ</option>
                    {semesters.map(semester => (
                        <option key={semester.semestersID} value={semester.semestersID}>
                            {semester.semestersName}
                        </option>
                    ))}
                </select>
                <button onClick={handleFilterChange}>Tra cứu</button>
            </div>

            {error && <p className="error-message">{error}</p>}

            {examData.length > 0 && (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>Hình thức thi</th>
                            <th>Phòng</th>
                            <th>Giờ thi</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>
                    <tbody>
                        {examData.map((row, index) => (
                            <tr key={index}>
                                <td>{formatDate(row.examDate)}</td>
                                <td>{row.subjectID}</td>
                                <td>{row.subjectname}</td>
                                <td>{row.examTypeName}</td>
                                <td>{row.roomName}</td>
                                <td>{row.startTime}</td>
                                <td>{row.duration}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {examData.length === 0 && !error && (
                <table className="result-table">
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>Hình thức thi</th>
                            <th>Phòng</th>
                            <th>Giờ thi</th>
                            <th>Thời gian</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr className="Null_value">
                            <td colSpan="8" style={{ textAlign: 'center' }}>
                                Không có dữ liệu nào được tìm thấy
                            </td>
                        </tr>
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExamSchedule;
