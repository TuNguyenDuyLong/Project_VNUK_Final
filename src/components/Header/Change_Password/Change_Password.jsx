import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../../config';
import './Change_Password.scss';

const Change_Password = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isChanged, setIsChanged] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const validateForm = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setError('Tất cả các trường đều là bắt buộc!');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError('Mật khẩu mới và xác nhận mật khẩu không khớp!');
            return false;
        }
        return true;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            console.log({ password: newPassword, confirmPassword });

            const response = await fetch(`${config.API_BASE_URL}/api/Account/ChangePassword`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    password: newPassword,
                    confirmPassword
                }),
            });

            if (response.ok) {
                setIsChanged(true);
            } else {
                const data = await response.json();
                console.log('API response:', data);
                setError(data.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error changing password:', error);
            setError('Đã xảy ra lỗi, vui lòng thử lại sau!');
        }
    };


    const handleClose = () => {
        navigate(-1);
    };

    return (
        <div className="change-password-form-overlay">
            <div className="change-password-form">
                {isChanged ? (
                    <div className="success-message">
                        <h2>Mật khẩu đã được thay đổi thành công!!!</h2>
                        <button onClick={handleClose}>Đóng</button>
                    </div>
                ) : (
                    <form onSubmit={handleChangePassword}>
                        <button type="button" className="close-button" onClick={handleClose}>
                            X
                        </button>
                        <div className="form-group">
                            <p className="old-password">Mật khẩu cũ:</p>
                            <input
                                type="password"
                                id="oldPassword"
                                name="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Mật khẩu cũ"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <p className="new-password">Mật khẩu mới:</p>
                            <input
                                type="password"
                                id="newPassword"
                                name="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Mật khẩu mới"
                                required
                                autoComplete="off"
                            />
                        </div>
                        <div className="form-group">
                            <p className="confirm-password">Xác nhận mật khẩu mới:</p>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Xác nhận mật khẩu mới"
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <div className="change-password-button">
                            <button type="submit">Đổi mật khẩu</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Change_Password;
