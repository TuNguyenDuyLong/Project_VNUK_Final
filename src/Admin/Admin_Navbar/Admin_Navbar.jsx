import React from 'react'
import './Admin_Navbar.scss'
import { NavLink } from 'react-router-dom';

const Admin_Navbar = () => {
    return (
        <div className="navbar">
            <NavLink to="/search_teaching_time" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>TRA CỨU GIỜ GIẢNG</NavLink>
            <NavLink to="/registration_room" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>ĐĂNG KÝ PHÒNG HỌC</NavLink>
        </div>
    )
}

export default Admin_Navbar;
