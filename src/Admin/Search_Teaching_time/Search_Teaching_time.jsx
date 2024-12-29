import React, { useState, useEffect } from "react";
import "./Search_Teaching_time.scss";
import config from "../../config";

const Search_Teaching_time = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(""); // Học kỳ đã chọn
    const [departments, setDepartments] = useState([]); // Danh sách khoa
    const [selectedDepartment, setSelectedDepartment] = useState(""); // Khoa đã chọn
    const [teachers, setTeachers] = useState([]); // Danh sách giảng viên
    const [selectedTeacher, setSelectedTeacher] = useState(""); // Giảng viên đã chọn
    const [teachingTime, setTeachingTime] = useState([]); // Thời khóa biểu

    // Lấy danh sách học kỳ từ API
    useEffect(() => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage

        if (!token) {
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
                setSemesters([]);
            });
    }, []);

    // Lấy danh sách khoa khi học kỳ được chọn
    useEffect(() => {
        if (selectedSemester) {
            fetch(`${config.API_BASE_URL}/api/Training/getListDepartment`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Unauthorized");
                    }
                    return response.json();
                })
                .then((data) => {
                    setDepartments(data); // Set danh sách khoa
                })
                .catch((error) => console.error("Error fetching departments:", error));
        }
    }, [selectedSemester]);

    useEffect(() => {
        if (selectedDepartment) {
            const token = localStorage.getItem('token');
            fetch(`${config.API_BASE_URL}/api/Training/getAllTeacher`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    // Lọc giảng viên theo departmentName
                    const filteredTeachers = data.filter((teacher) => teacher.departmentName === selectedDepartment);
                    setTeachers(filteredTeachers); // Set danh sách giảng viên lọc được
                    setSelectedTeacher(""); // Reset giảng viên đã chọn
                })
                .catch((error) => console.error("Error fetching teachers:", error));
        } else {
            setTeachers([]); // Nếu không chọn khoa, làm rỗng danh sách giảng viên
            setSelectedTeacher(""); // Reset giảng viên đã chọn
        }
    }, [selectedDepartment]);


    // Tra cứu thời khóa biểu
    const fetchTimeTable = () => {
        console.log("Calling API with teacherId:", selectedTeacher, "semesterId:", selectedSemester);
        if (selectedTeacher && selectedSemester) {
            fetch(`${config.API_BASE_URL}/api/Training/getTimeTableTeacher?teacherId=${selectedTeacher}&semesterId=${selectedSemester}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then(response => {
                    console.log("Response status:", response.status); // Kiểm tra mã trạng thái HTTP
                    if (!response.ok) {
                        throw new Error("API Error: " + response.statusText);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Dữ liệu thời khóa biểu:", data); // Xem kết quả trả về
                    setTeachingTime(Array.isArray(data) ? data : []); // Cập nhật thời khóa biểu
                })
                .catch(error => {
                    console.error("Error fetching timetable:", error);
                    alert("Có lỗi khi tra cứu thời khóa biểu: " + error.message);
                });

        }
    };


    return (
        <div className="teaching-time-management-container">
            <h2 className="teaching-time-management_title">TRA CỨU GIỜ GIẢNG CỦA GIẢNG VIÊN</h2>

            <div className="filter-container">
                {/* Bộ lọc học kỳ */}
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
                {/* Bộ lọc khoa */}
                <select
                    className="dropdown"
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    disabled={!selectedSemester}
                >
                    <option value="" disabled >Chọn khoa</option>
                    {departments.map((department) => (
                        <option key={department.departmentID} value={department.departmentName}>
                            {department.departmentName}
                        </option>
                    ))}
                </select>

                {/* Bộ lọc giảng viên */}
                <select
                    className="dropdown"
                    value={selectedTeacher}
                    onChange={(e) => setSelectedTeacher(e.target.value)}
                    disabled={!selectedSemester || !selectedDepartment}
                >
                    <option value="" disabled >Chọn giảng viên</option>
                    {teachers.map((teacher) => (
                        <option key={teacher.teacherID} value={teacher.teacherID}>
                            {teacher.teacherName}
                        </option>
                    ))}
                </select>



                <button onClick={fetchTimeTable} disabled={!selectedTeacher || !selectedSemester}>Tra cứu</button>
            </div>

            {/* Hiển thị bảng thời khóa biểu */}
            <div className="teacher-table">
                {teachingTime.length > 0 ? (
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
                            {teachingTime.map((row, index) => (
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
                            '7:00 AM - 7:50 AM',   // Tiết 1
                            '8:00 AM - 8:50 AM',   // Tiết 2
                            '9:00 AM - 9:50 AM',   // Tiết 3
                            '10:00 AM - 10:50 AM', // Tiết 4
                            '11:00 AM - 11:50 AM', // Tiết 5
                            '12:00 PM - 12:50 PM', // Tiết 6
                            '1:00 PM - 1:50 PM',   // Tiết 7
                            '2:00 PM - 2:50 PM',   // Tiết 8
                            '3:00 PM - 3:50 PM',   // Tiết 9
                            '4:00 PM - 4:50 PM',   // Tiết 10
                        ].map((time, index) => (
                            <tr key={index}>
                                <td>Tiết {index + 1}</td>
                                <td>{time}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Search_Teaching_time;
