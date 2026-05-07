import { useState, useEffect } from 'react';
import Navbar from '../Common/Navbar';
import SalesManagerForm from './SalesManagerForm';
import SalesManagerTable from './SalesManagerTable';
import { userAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [salesManagers, setSalesManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showModal, setShowModal] = useState(false);

    const fetchSalesManagers = async () => {
        try {
            setLoading(true);
            const response = await userAPI.getSalesManagers();
            setSalesManagers(response.data);
            setError('');
        } catch (err) {
            setError('Failed to fetch sales managers');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSalesManagers();
    }, []);

    const handleManagerCreated = () => {
        fetchSalesManagers();
        setShowModal(false);
    };

    const handlePasswordReset = async (id, newPassword) => {
        try {
            await userAPI.resetPassword(id, { newPassword });
            alert('Password reset successfully');
            fetchSalesManagers();
        } catch (err) {
            alert('Failed to reset password');
            console.error(err);
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            await userAPI.toggleStatus(id);
            fetchSalesManagers();
        } catch (err) {
            alert('Failed to update status');
            console.error(err);
        }
    };

    const handleUpdateNotes = async (id, notes) => {
        try {
            await userAPI.updateNotes(id, notes);
        } catch (err) {
            console.error(err);
            throw err;
        }
    };

    const handleUpdateProfile = async (id, data) => {
        try {
            await userAPI.updateProfile(id, data);
            fetchSalesManagers();
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to update profile';
            alert(msg);
            console.error(err);
            throw err;
        }
    };

    // Close modal on backdrop click
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) setShowModal(false);
    };

    return (
        <div>
            <Navbar />

            <div className="container">
                {/* ── Page Header ── */}
                <div className="admin-header">
                    <div className="admin-header__left">
                        <h1>Admin Dashboard</h1>
                        <p className="text-muted">Manage Sales Managers</p>
                    </div>
                    <button
                        className="btn btn-primary admin-create-btn"
                        onClick={() => setShowModal(true)}
                    >
                        + Create Sales Manager
                    </button>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                {/* ── Table Card ── */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Sales Managers</h3>
                        <span className="admin-count-badge">{salesManagers.length} total</span>
                    </div>
                    {loading ? (
                        <div className="text-center" style={{ padding: '2rem' }}>
                            <div className="spinner"></div>
                        </div>
                    ) : (
                        <SalesManagerTable
                            salesManagers={salesManagers}
                            onPasswordReset={handlePasswordReset}
                            onToggleStatus={handleToggleStatus}
                            onUpdateNotes={handleUpdateNotes}
                            onUpdateProfile={handleUpdateProfile}
                        />
                    )}
                </div>
            </div>

            {/* ── Create Modal ── */}
            {showModal && (
                <div className="modal-backdrop" onClick={handleBackdropClick}>
                    <div className="modal-box">
                        <div className="modal-header">
                            <h3 className="modal-title">Create Sales Manager</h3>
                            <button
                                className="modal-close"
                                onClick={() => setShowModal(false)}
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="modal-body">
                            <SalesManagerForm onSuccess={handleManagerCreated} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
