import React, { useState, useEffect } from 'react';
import './Tea_CreateNoteti.scss';
import { Link } from 'react-router-dom';
import config from '../../../config';

const Tea_CreateNoteti = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [courses, setCourses] = useState([]); // Danh sách môn học
    const [selectedCourse, setSelectedCourse] = useState(''); // Môn học đã chọn
    const [classes, setClasses] = useState([]); // Danh sách lớp học
    const [selectedClass, setSelectedClass] = useState(''); // Lớp học đã chọn
    const [room, setRoom] = useState('');
    const [week, setWeek] = useState(0);
    const [dayOfWeek, setDayOfWeek] = useState('');
    const [classPeriod, setClassPeriod] = useState('');
    const [reason, setReason] = useState('');
    const [notifications, setNotifications] = useState([]); // Danh sách thông báo
    const [error, setError] = useState(null); // Lưu lỗi (nếu có)

    // Lấy danh sách học kỳ từ API
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
            .then(response => {
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách học kỳ');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setSemesters(data);
            })
            .catch(error => {
                console.error('Lỗi:', error);
                setError(error.message);
                setSemesters([]);
            });
    }, []);

    // Lấy danh sách môn học khi học kỳ thay đổi
    useEffect(() => {
        const fetchCourses = async () => {
            if (!selectedSemester) return;

            const token = localStorage.getItem('token');
            const apiUrl = `${config.API_BASE_URL}/api/TakeInfoSubjectClass/GetListSubject?SemestersID=${selectedSemester}`;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể tải danh sách môn học');
                }

                const data = await response.json();
                console.log('Danh sách môn học:', data);
                setCourses(data);
                setSelectedCourse(''); // Reset môn học đã chọn
                setClasses([]); // Reset danh sách lớp
            } catch (error) {
                console.error('Lỗi khi lấy danh sách môn học:', error);
                setError(error.message);
            }
        };

        fetchCourses();
    }, [selectedSemester]);

    // Lấy danh sách lớp học khi môn học thay đổi
    useEffect(() => {
        const fetchClasses = async () => {
            if (!selectedCourse || !selectedSemester) return;

            const token = localStorage.getItem('token');
            const apiUrl = `${config.API_BASE_URL}/api/TakeInfoSubjectClass/GetListCourseClass?subjectID=${selectedCourse}&semesterId=${selectedSemester}`;

            try {
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) throw new Error('Không thể tải danh sách lớp học');

                const data = await response.json();
                console.log('Danh sách lớp học:', data);

                // Lưu dữ liệu lớp học
                setClasses(data);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách lớp học:', error);
                setError(error.message);
            }
        };

        fetchClasses();
    }, [selectedCourse, selectedSemester]);


    const handleSemesterChange = (e) => {
        const semesterID = e.target.value;
        setSelectedSemester(semesterID); // Cập nhật học kỳ được chọn

        // Reset các giá trị khi thay đổi học kỳ
        setSelectedCourse('');
        setSelectedClass('');
        setRoom('');
        setDayOfWeek('');
        setClassPeriod('');
        setWeek('');
        setReason('');
    };


    const handleCourseChange = (e) => {
        const courseID = e.target.value;
        setSelectedCourse(courseID); // Cập nhật môn học được chọn

        // Reset các giá trị khi thay đổi môn học
        setSelectedClass('');
        setRoom('');
        setDayOfWeek('');
        setClassPeriod('');
        setWeek('');
        setReason('');
    };


    const handleClassChange = (e) => {
        const selectedClassID = e.target.value;
        setSelectedClass(selectedClassID); // Cập nhật lớp được chọn

        // Tìm lớp học đã chọn trong danh sách lớp
        const selectedClassDetail = classes.find(
            (cls) => cls.courseClassID === selectedClassID
        );

        if (selectedClassDetail) {
            // Nếu tìm thấy lớp, cập nhật các ô dữ liệu
            setRoom(selectedClassDetail.roomName || ''); // Phòng học
            setDayOfWeek(selectedClassDetail.dayofWeekName || ''); // Thứ
            setClassPeriod(selectedClassDetail.classPeriodName || ''); // Tiết học
        } else {
            // Nếu không tìm thấy lớp, đặt các giá trị về trống
            setRoom('');
            setDayOfWeek('');
            setClassPeriod('');
        }

        // Reset các trường khác nếu cần
        setWeek('');
        setReason('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedSemester || !selectedCourse || !selectedClass || !week || !reason) {
            alert('Vui lòng điền đầy đủ các thông tin!');
            return;
        }

        const selectedCourseName = courses.find(course => course.subjectsID === selectedCourse)?.subjectsName;
        const parsedWeek = parseInt(week, 10);

        if (isNaN(parsedWeek) || parsedWeek <= 0) {
            alert('Tuần phải là một số hợp lệ và lớn hơn 0.');
            return;
        }

        const newNotification = {
            courseID: selectedCourseName,
            courseClassID: selectedClass,
            weekOff: `${parsedWeek}`,
            dayOfWeek,
            classPeriod,
            reason,
            createdAt: new Date().toISOString(),
        };

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/NoticeOfLeaves/CreateNoticeOfLeave`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify(newNotification),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi từ server: ${errorText}`);
            }

            const data = await response.json();
            setNotifications(prevNotifications => [...prevNotifications, data]);

            alert('Thông báo đã được tạo thành công!');
            // Reset form
            setSelectedSemester('');
            setSelectedCourse('');
            setSelectedClass('');
            setRoom('');
            setWeek('');
            setDayOfWeek('');
            setClassPeriod('');
            setReason('');
        } catch (error) {
            console.error('Lỗi khi tạo thông báo:', error);
            alert('Có lỗi xảy ra khi tạo thông báo. Vui lòng thử lại!');
            setError(error.message);
        }
    };

    return (
        <div className="CreateNotification">
            <div className="grid__column-2-3">
                <div className="View_Created_Notetication">
                    <p className="CreateNotification_title">ĐĂNG KÝ NGHỈ</p>
                    <form onSubmit={handleSubmit}>
                        <div className="Dropdownlist">
                            <div className="form-group">
                                <label htmlFor="semester">Học kỳ:</label>
                                <select
                                    id="semester"
                                    value={selectedSemester}
                                    onChange={handleSemesterChange}
                                    required
                                >
                                    <option value="" disabled>Chọn học kỳ</option>
                                    {semesters.map(semester => (
                                        <option key={semester.semestersID} value={semester.semestersID}>
                                            {semester.semestersName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="course">Môn học phần:</label>
                                <select
                                    id="course"
                                    value={selectedCourse}
                                    onChange={handleCourseChange}
                                    required
                                    disabled={!selectedSemester || courses.length === 0}
                                >
                                    <option value="" disabled>Chọn môn học phần</option>
                                    {courses.map(course => (
                                        <option key={course.subjectsID} value={course.subjectsID}>
                                            {course.subjectsName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="class">Lớp dạy:</label>
                                <select
                                    id="class"
                                    value={selectedClass}
                                    onChange={handleClassChange}
                                    required
                                    disabled={!selectedCourse || classes.length === 0}
                                >
                                    <option value="" disabled>Chọn lớp dạy</option>
                                    {classes.length > 0 ? (
                                        classes.map(classItem => (
                                            <option key={classItem.courseClassID} value={classItem.courseClassID}>
                                                {classItem.courseClassName}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Không có lớp học</option>
                                    )}
                                </select>
                            </div>
                        </div>
                        <div className="dayOfweek_Period_Room">
                            <div className="form-group">
                                <label htmlFor="dayOfWeek">Thứ:</label>
                                <input
                                    disabled
                                    type="text"
                                    id="dayOfWeek"
                                    value={dayOfWeek}
                                    onChange={(e) => setDayOfWeek(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="classPeriod">Tiết học:</label>
                                <input
                                    disabled
                                    type="text"
                                    id="classPeriod"
                                    value={classPeriod}
                                    onChange={(e) => setClassPeriod(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="room">Phòng:</label>
                                <input
                                    disabled
                                    type="text"
                                    id="room"
                                    value={room}
                                    onChange={(e) => setRoom(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="week">Tuần:</label>
                                <input
                                    type="text"
                                    id="week"
                                    value={week}
                                    onChange={(e) => setWeek(Number(e.target.value))}
                                    required
                                    placeholder="Nhập tuần"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="note">Ghi chú:</label>
                            <textarea
                                id="note"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                required
                                placeholder="Lý do"
                            />
                        </div>

                        <button className="btn_submit" type="submit">ĐĂNG KÝ</button>
                    </form>
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

export default Tea_CreateNoteti;
