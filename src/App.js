import React, { useEffect, useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import ScrollToTop from './util/ScrollToTop';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Navbar from './pages/Navbar/Navbar';
import Tea_Navbar from './teacher/Tea_Navbar/Tea_Navbar';
import Admin_Navbar from './Admin/Admin_Navbar/Admin_Navbar';

// Các trang dành cho sinh viên
import Home from './pages/Home/Home';
import News from './pages/News/News';
import Introduce from './pages/Introduce/Introduce';
import Admissions from './pages/Admissions/Admissions';
import TimeTable from './pages/TimeTable/TimeTable';
import ExamSchedule from './pages/ExamSchedule/ExamSchedule';
import ViewNoteti from './pages/ViewNoteti/ViewNoteti';
import ViewNoteti_Course from './pages/ViewNoteti_Course/ViewNoteti_Course';
// Các trang dành cho giảng viên
import Tea_TimeTable from './teacher/Tea_TimeTable/Tea_TimeTable';
import Tea_ExamSchedule from './teacher/Tea_ExamSchedule/Tea_ExamSchedule';
import Tea_ViewNoteti from './teacher/Notetication/Tea_ViewNoteti/Tea_ViewNoteti';
import Tea_CreateNoteti from './teacher/Notetication/Tea_CreateNoteti/Tea_CreateNoteti';
import Tea_View_CreateNoteti from './teacher/Notetication/Tea_View_CreateNoteti/Tea_View_CreateNoteti';
import Tea_CreateNoteti_com from './teacher/Notetication/Tea_CreateNoteti_com/Tea_CreateNoteti_com';
import Tea_CreateNoteti_session from './teacher/Notetication/Tea_CreateNoteti_session/Tea_CreateNoteti_session';
import Tea_View_CreateNoteti_session from './teacher/Notetication/Tea_View_CreateNoteti_session/Tea_View_CreateNoteti_session';
// Các trang dành cho đào tạo
import Search_Teaching_time from './Admin/Search_Teaching_time/Search_Teaching_time';
import Register_Room from './Admin/Register_Room/Register_Room'

import Login from './components/Header/Login/Login';
import Change_Password from './components/Header/Change_Password/Change_Password';

const App = () => {
  const [user, setUser] = useState(null); // Tạo state để lưu thông tin người dùng
  const navigate = useNavigate();

  // Kiểm tra và cập nhật user từ localStorage khi component load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser); // Lưu thông tin người dùng vào state
      } catch (error) {
        console.error('Lỗi khi phân tích JSON:', error);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };
  useEffect(() => {
    const publicPaths = ['/', '/news', '/introduce', '/admissions'];
    if (!user && !publicPaths.includes(window.location.pathname)) {
      navigate('/');
    }
  }, [user, navigate]);


  return (
    <div className="app">
      <ScrollToTop />

      {/* Header */}
      <Header handleLogout={handleLogout} />

      {user?.role === 'Teacher' ? (<Tea_Navbar />) : user?.role === 'Student' ? (<Navbar />) : user?.role === 'Training' ? (<Admin_Navbar />) : null}

      {/* Route chính */}
      <Routes>
        {/* Route công khai */}
        <Route path="/" element={<Home />} />
        <Route path="/news" element={<News />} />
        <Route path="/introduce" element={<Introduce />} />
        <Route path="/admissions" element={<Admissions />} />

        {/* Route dành cho sinh viên */}
        {user?.role === 'Student' && (
          <>
            <Route path="/timetable" element={<TimeTable />} />
            <Route path="/examschedule" element={<ExamSchedule />} />
            <Route path="/viewnoteti" element={<ViewNoteti />} />
            <Route path="/viewNoteti_course" element={<ViewNoteti_Course />} />

          </>
        )}

        {/* Route dành cho giảng viên */}
        {user?.role === 'Teacher' && (
          <>
            <Route path="/tea_timetable" element={<Tea_TimeTable />} />
            <Route path="/tea_viewnoteti" element={<Tea_ViewNoteti />} />
            <Route path="/tea_off_createnoteti" element={<Tea_CreateNoteti />} />
            <Route path="/tea_on_createnoteti" element={<Tea_CreateNoteti_com />} />
            <Route path="/tea_createnoteti_session" element={<Tea_CreateNoteti_session />} />
            <Route path="/tea_view_createnoteti" element={<Tea_View_CreateNoteti />} />
            <Route path="/tea_examschedule" element={<Tea_ExamSchedule />} />
            <Route path="/tea_view_createnoteti_session" element={<Tea_View_CreateNoteti_session />} />

          </>
        )}
        {/* Route dành cho đào tạo */}
        {user?.role === 'Training' && (
          <>
            <Route path="/search_teaching_time" element={< Search_Teaching_time />} />
            <Route path="/registration_room" element={< Register_Room />} />
          </>
        )}

        {/* Route đăng nhập */}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/change_password" element={<Change_Password />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
