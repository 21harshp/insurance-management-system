import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onChangePassword }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <h2>Insurance Management System</h2>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-id">{user?.userId}</span>
                            <span className="user-role badge badge-primary">{user?.role}</span>
                        </div>
                    </div>

                    {user?.role === 'salesManager' && (
                        <button className="btn btn-outline btn-sm" onClick={onChangePassword}>
                            Change Password
                        </button>
                    )}

                    <button className="btn btn-danger btn-sm" onClick={logout}>
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
