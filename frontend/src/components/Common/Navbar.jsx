import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = ({ onChangePassword }) => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <img
                        src="/navbar.jpg"
                        alt="Logo"
                        style={{
                            width: '190px',
                            height: '60px',
                            objectFit: 'contain',
                            borderRadius: '8px'
                        }}
                    />
                </div>

                <div className="navbar-menu">
                    <div className="navbar-user">
                        <div className="user-info">
                            <span className="user-id">{user?.userId}</span>
                            <span className="user-role badge badge-primary">{user?.role}</span>
                        </div>
                    </div>

                    {user?.role === 'salesManager' && (
                        <button
                            className="btn btn-outline btn-sm navbar-icon-btn"
                            onClick={onChangePassword}
                            title="Change Password"
                        >
                            <span className="btn-label">Change Password</span>
                            <span className="btn-icon-only">🔑</span>
                        </button>
                    )}

                    <button
                        className="btn btn-danger btn-sm navbar-icon-btn"
                        onClick={logout}
                        title="Logout"
                    >
                        <span className="btn-label">Logout</span>
                        <span className="btn-icon-only">⏻</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
