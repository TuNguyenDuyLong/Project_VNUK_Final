import React from 'react'
import './Navbar.scss'
import { NavLink } from 'react-router-dom';
const Navbar = () => {
    return (
        <div className="navbar">
            <NavLink to="/timetable" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>TRA CỨU TKB</NavLink>
            <NavLink to="/examschedule" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>LỊCH THI</NavLink>
            <NavLink to="/viewnoteti" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>THÔNG BÁO</NavLink>
        </div>
    )
}

export default Navbar