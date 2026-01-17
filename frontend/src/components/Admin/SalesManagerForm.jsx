import { useState } from 'react';
import { userAPI } from '../../services/api';

const SalesManagerForm = ({ onSuccess }) => {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await userAPI.createSalesManager({ password });
            setSuccess(`Sales Manager created successfully! User ID: ${response.data.userId}`);
            setPassword('');
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create sales manager');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label required">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password for new sales manager"
                        required
                    />
                    <small className="text-muted">User ID will be auto-generated</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Creating...' : 'Create Sales Manager'}
                </button>
            </form>
        </div>
    );
};

export default SalesManagerForm;
