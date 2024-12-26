import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

import config from '../../../config';
import './Login.scss';

const Login = ({ setUser }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${config.API_BASE_URL}/api/Account/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const token = await response.text();
                localStorage.setItem('token', token);

                const decodedToken = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);
                if (decodedToken.exp < currentTime) {
                    alert('Token đã hết hạn, vui lòng đăng nhập lại!');
                    localStorage.removeItem('token');
                    return;
                }

                const user = {
                    username: decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                    role: decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                };

                localStorage.setItem('user', JSON.stringify(user));
                setUser(user);

                if (user.role === 'Teacher') {
                    navigate('/tea_viewnoteti');
                } else if (user.role === 'Student') {
                    navigate('/viewnoteti');
                } else if (user.role === 'Training') {
                    navigate('/admin_viewnoteti');
                } else {
                    alert('Vai trò không hợp lệ!');
                }

                setUsername('');
                setPassword('');
            } else {
                alert('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!');
            }
        } catch (error) {
            console.error('Lỗi trong quá trình đăng nhập:', error);
            alert('Đã xảy ra lỗi. Vui lòng thử lại sau!');
        }
    };

    return (
        <div className="login-form-overlay">
            <div className="login-form">
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <p className="username">Nhập tên đăng nhập:</p>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Tên đăng nhập"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="form-group">
                        <p className="password">Mật khẩu:</p>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mật khẩu"
                            required
                            autoComplete="off"
                        />
                    </div>
                    <div className="Btn_login">
                        <button type="submit" className="login-button">Đăng nhập</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
