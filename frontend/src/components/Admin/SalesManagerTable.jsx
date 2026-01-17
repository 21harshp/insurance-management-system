import { useState } from 'react';

const SalesManagerTable = ({ salesManagers, onPasswordReset }) => {
    const [resetId, setResetId] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState({});

    const handleReset = (id) => {
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }
        onPasswordReset(id, newPassword);
        setResetId('');
        setNewPassword('');
    };

    const togglePasswordVisibility = (id) => {
        setShowPasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (salesManagers.length === 0) {
        return (
            <div className="text-center text-muted" style={{ padding: '2rem' }}>
                No sales managers created yet
            </div>
        );
    }

    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Password</th>
                        <th>Created At</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {salesManagers.map((manager) => (
                        <tr key={manager._id}>
                            <td>
                                <span className="badge badge-primary">{manager.userId}</span>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <span style={{ fontFamily: 'monospace' }}>
                                        {showPasswords[manager._id] ? manager.password : '••••••••'}
                                    </span>
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => togglePasswordVisibility(manager._id)}
                                    >
                                        {showPasswords[manager._id] ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </td>
                            <td>{new Date(manager.createdAt).toLocaleDateString()}</td>
                            <td>
                                {resetId === manager._id ? (
                                    <div className="flex gap-1">
                                        <input
                                            type="password"
                                            className="form-input"
                                            style={{ width: '150px', padding: '0.375rem 0.75rem' }}
                                            placeholder="New password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                        />
                                        <button
                                            className="btn btn-sm btn-accent"
                                            onClick={() => handleReset(manager._id)}
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline"
                                            onClick={() => {
                                                setResetId('');
                                                setNewPassword('');
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        className="btn btn-sm btn-secondary"
                                        onClick={() => setResetId(manager._id)}
                                    >
                                        Reset Password
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SalesManagerTable;
