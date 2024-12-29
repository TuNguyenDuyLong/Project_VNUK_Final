import React, { useEffect, useState } from 'react';
import './Header.scss';
import Logo from '../../assest/images/logo.png';
import User from '../../assest/images/user.png';
import { NavLink, useNavigate } from 'react-router-dom';
import Login from './Login/Login';

const Header = () => {
    const [showLogin, setShowLogin] = useState(false);
    const [user, setUser] = useState(null); // Lưu trữ thông tin người dùng
    const navigate = useNavigate();

    // Lấy thông tin người dùng từ localStorage khi component được mount
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser); // Nếu có thông tin người dùng trong localStorage, đặt vào state
            // Set thời gian hết hạn phiên đăng nhập
            const timeout = setTimeout(() => {
                alert('Phiên đăng nhập của bạn đã hết hạn.');
                handleLogout(); // Đăng xuất người dùng khi hết hạn phiên
            }, 30 * 60 * 1000); // 30 phút (30 * 60 * 1000 milliseconds)

            // Dọn dẹp setTimeout khi component unmount hoặc người dùng đăng xuất
            return () => clearTimeout(timeout);
        }
    }, []); // useEffect chạy một lần khi component mount

    const handleLogin = () => {
        setShowLogin(prevState => !prevState);
    };

    const handleLogout = () => {
        localStorage.removeItem('user'); // Xóa thông tin người dùng trong localStorage
        setUser(null); // Cập nhật state về null
        navigate('/'); // Chuyển hướng về trang chủ
    };

    // Hiển thị form đổi mật khẩu khi nhấn vào avatar
    const handleChangePassword = () => {
        navigate('/change_password'); // Điều hướng tới trang thay đổi mật khẩu
    };

    return (
        <nav className="header">
            <div className="header_top">
                <div className="header_logo-container">
                    <img src={Logo} alt="Logo" className="header_logo" />
                    <div className="header_name">
                        <h1 className="university-name">ĐẠI HỌC ĐÀ NẴNG</h1>
                        <h1 className="institute-name">VIỆN NGHIÊN CỨU ĐÀO TẠO VIỆT - ANH</h1>
                    </div>
                </div>
                <div className="header_user">
                    <div className="header_user-avatar" onClick={user ? handleChangePassword : null}>
                        <img src={User} alt="User Avatar" className="avatar" />
                    </div>
                    <div className="username">
                        {user && <div className="display_username">{user.username}</div>}
                    </div>
                    <button onClick={user ? handleLogout : handleLogin} className="header_login">
                        {user ? 'ĐĂNG XUẤT' : 'ĐĂNG NHẬP'}
                    </button>
                </div>
            </div>
            <div className="header_bottom">
                <div className="header_menu">
                    <NavLink to="/" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TRANG CHỦ
                    </NavLink>
                    <NavLink to="/introduce" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        GIỚI THIỆU
                    </NavLink>
                    <NavLink to="/news" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TIN TỨC
                    </NavLink>
                    <NavLink to="/admissions" className={({ isActive }) => (isActive ? "header-link active" : "header-link")}>
                        TUYỂN SINH
                    </NavLink>
                </div>
            </div>

            {showLogin && <Login setUser={setUser} onClose={() => setShowLogin(false)} />}
        </nav>
    );
};

export default Header;
