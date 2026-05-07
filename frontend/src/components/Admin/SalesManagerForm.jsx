import { useState } from 'react';
import { userAPI } from '../../services/api';

const SalesManagerForm = ({ onSuccess }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [packageStartDate, setPackageStartDate] = useState('');
    const [packageEndDate, setPackageEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!name.trim()) {
            setError('Name is required');
            return;
        }
        if (!email.trim()) {
            setError('Email is required');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            const response = await userAPI.createSalesManager({
                name: name.trim(),
                email: email.trim(),
                password,
                packageStartDate: packageStartDate || null,
                packageEndDate: packageEndDate || null,
            });
            setSuccess(`Sales Manager created! User ID: ${response.data.userId}`);
            setName('');
            setEmail('');
            setPassword('');
            setPackageStartDate('');
            setPackageEndDate('');
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
                    <label className="form-label required">Name</label>
                    <input
                        type="text"
                        className="form-input"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full name of the sales manager"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Email ID</label>
                    <input
                        type="email"
                        className="form-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password (min 6 characters)"
                        required
                    />
                    <small className="text-muted">User ID will be auto-generated</small>
                </div>

                <div className="form-group">
                    <label className="form-label">Package Start Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={packageStartDate}
                        onChange={(e) => setPackageStartDate(e.target.value)}
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Package End Date</label>
                    <input
                        type="date"
                        className="form-input"
                        value={packageEndDate}
                        onChange={(e) => setPackageEndDate(e.target.value)}
                    />
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
