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

    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="admin-header">
                    <h1>Admin Dashboard</h1>
                    <p className="text-muted">Manage Sales Managers</p>
                </div>

                {error && <div className="alert alert-error">{error}</div>}

                <div className="admin-content">
                    <div className="admin-section">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Create Sales Manager</h3>
                            </div>
                            <SalesManagerForm onSuccess={handleManagerCreated} />
                        </div>
                    </div>

                    <div className="admin-section">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">Sales Managers</h3>
                            </div>
                            {loading ? (
                                <div className="text-center">
                                    <div className="spinner"></div>
                                </div>
                            ) : (
                                <SalesManagerTable
                                    salesManagers={salesManagers}
                                    onPasswordReset={handlePasswordReset}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
