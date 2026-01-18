import { useState, useEffect } from 'react';
import { motorInsuranceAPI } from '../../services/api';
import { errorMessage, successMessage } from '../../utils/message';

const MotorInsuranceTable = ({ refreshTrigger, onRenew }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');

    const months = [
        { value: '', label: 'All Months' },
        { value: '0', label: 'January' },
        { value: '1', label: 'February' },
        { value: '2', label: 'March' },
        { value: '3', label: 'April' },
        { value: '4', label: 'May' },
        { value: '5', label: 'June' },
        { value: '6', label: 'July' },
        { value: '7', label: 'August' },
        { value: '8', label: 'September' },
        { value: '9', label: 'October' },
        { value: '10', label: 'November' },
        { value: '11', label: 'December' },
    ];

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const params = {};
            if (selectedMonth !== '') params.month = selectedMonth;
            if (searchName) params.search = searchName;

            const response = await motorInsuranceAPI.getAll(params);
            setPolicies(response.data);
        } catch (err) {
            console.error('Failed to fetch policies:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [refreshTrigger, selectedMonth, searchName]);

    const handleDelete = async (insurance) => {
        try {
            const response = await motorInsuranceAPI.delete(insurance._id)
            console.log(response)
            if (response.status === 200) {
                successMessage(response?.data?.data?.message || 'Insurance deleted successfully')
                fetchPolicies()
            }
        } catch (err) {
            console.error('Failed to delete insurance:', err);
            errorMessage(err?.response?.data?.message || 'Failed to delete insurance')
        }
    }

    const shouldShowRenewButton = (policyEndDate) => {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const endDate = new Date(policyEndDate);
        const endMonth = endDate.getMonth();
        const endYear = endDate.getFullYear();

        // Show if current month equals end month OR current month equals end month + 1
        const sameMonthYear = currentMonth === endMonth && currentYear === endYear;
        const nextMonth = (currentMonth === (endMonth + 1) % 12) &&
            (endMonth === 11 ? currentYear === endYear + 1 : currentYear === endYear);

        return sameMonthYear || nextMonth;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="text-center" style={{ padding: '2rem' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex gap-3 mb-4" style={{ marginBottom: '1.5rem' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by policy holder name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0, minWidth: '200px' }}>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {policies.length === 0 ? (
                <div className="text-center text-muted" style={{ padding: '2rem' }}>
                    No policies found
                </div>
            ) : (
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Registration No.</th>
                                <th>Policy Holder</th>
                                <th>Mobile</th>
                                <th>Company</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Premium</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <tr key={policy._id}>
                                    <td>
                                        <span className="badge badge-primary">
                                            {policy.registrationNumber}
                                        </span>
                                    </td>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500 }}>{policy.policyHolderName}</div>
                                            <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                DOB: {formatDate(policy.policyHolderDOB)}
                                            </div>
                                        </div>
                                    </td>
                                    <td>{policy.mobileNumber}</td>
                                    <td>{policy.insuranceCompanyName}</td>
                                    <td>{formatDate(policy.policyStartDate)}</td>
                                    <td>
                                        <span className={
                                            new Date(policy.policyEndDate) < new Date()
                                                ? 'badge badge-danger'
                                                : 'badge badge-success'
                                        }>
                                            {formatDate(policy.policyEndDate)}
                                        </span>
                                    </td>
                                    <td>₹{policy.premiumAmount.toLocaleString()}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <a
                                                href={policy.policyCopyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="btn btn-sm btn-outline"
                                            >
                                                View
                                            </a>
                                            {shouldShowRenewButton(policy.policyEndDate) && (
                                                <button
                                                    className="btn btn-sm btn-accent"
                                                    onClick={() => onRenew(policy)}
                                                >
                                                    Renew
                                                </button>
                                            )}
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(policy)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MotorInsuranceTable;
