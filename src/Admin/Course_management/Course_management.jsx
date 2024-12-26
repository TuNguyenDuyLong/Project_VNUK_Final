import React, { useEffect, useState } from 'react';
import './Course_management.scss';

const CourseManagement = () => {
    const [semesters, setSemesters] = useState([]); // Danh sách học kỳ
    const [selectedSemester, setSelectedSemester] = useState(''); // Học kỳ đã chọn
    const [courses, setCourses] = useState([]); // Dữ liệu học phần
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
    const [error, setError] = useState(null); // Xử lý lỗi

    // Gọi API để lấy danh sách học phần
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://your-backend-api.com/api/courses'); // Thay bằng API thực tế
                if (!response.ok) {
                    throw new Error('Lỗi khi tải dữ liệu học phần');
                }
                const data = await response.json();
                setCourses(data); // Gán dữ liệu nhận được vào state
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Lọc danh sách theo từ khóa tìm kiếm
    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="course-management">
            <h1>Quản lý học phần</h1>

            {/* Tìm kiếm */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Tìm kiếm học phần..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Trạng thái tải dữ liệu hoặc lỗi */}
            {loading && <p>Đang tải dữ liệu...</p>}
            {error && <p className="error">{error}</p>}

            {/* Hiển thị danh sách học phần */}
            {!loading && !error && (
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>Mã học phần</th>
                            <th>Tên học phần</th>
                            <th>Số tín chỉ</th>
                            <th>Điều kiện tiên quyết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.id}</td>
                                <td>{course.name}</td>
                                <td>{course.credits}</td>
                                <td>{course.prerequisite || 'Không'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CourseManagement;
