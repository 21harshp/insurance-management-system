import { useState, useEffect } from 'react';
import { motorInsuranceAPI } from '../../services/api';
import { errorMessage, successMessage } from '../../utils/message';
import { exportToExcel } from '../../utils/exportExcel';

const MotorInsuranceTable = ({ refreshTrigger, onRenew }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [appliedSearch, setAppliedSearch] = useState('');
    const [appliedMonthYear, setAppliedMonthYear] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);



    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const params = {};

            // Parse month-year picker value (format: YYYY-MM)
            if (appliedMonthYear) {
                const [year, month] = appliedMonthYear.split('-');
                params.year = year;
                params.month = parseInt(month) - 1;
            }

            if (appliedSearch) params.search = appliedSearch;

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
    }, [refreshTrigger, appliedSearch, appliedMonthYear]);

    const handleSearch = () => {
        setAppliedSearch(searchName);
        setAppliedMonthYear(selectedMonthYear);
    };

    const handleClearMonth = () => {
        setSelectedMonthYear('');
        setAppliedMonthYear('');
    };

    const handleReset = () => {
        setSearchName('');
        setSelectedMonthYear('');
        setAppliedSearch('');
        setAppliedMonthYear('');
    };

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

    const toggleRowExpansion = (policyId) => {
        setExpandedRow(expandedRow === policyId ? null : policyId);
    };

    const handleExport = () => {
        const rows = policies.map((p) => ({
            'Registration Number': p.registrationNumber || '',
            'Policy Number': p.policyNumber || '',
            'Policy Holder Name': p.policyHolderName || '',
            'Policy Holder DOB': formatDate(p.policyHolderDOB),
            'Mobile Number': p.mobileNumber || '',
            'Insurance Company': p.insuranceCompanyName || '',
            'Service Provider': p.serviceProviderCompanyName || '',
            'Policy Start Date': formatDate(p.policyStartDate),
            'Policy End Date': formatDate(p.policyEndDate),
            'Premium Amount': p.premiumAmount || '',
            'Nominee Name': p.nomineeName || '',
            'Nominee DOB': formatDate(p.nomineeDOB),
            'Agent Name': p.agentName || '',
            'Policy Copy Link': p.policyCopyLink || '',
        }));
        const label = selectedMonthYear ? `Motor_${selectedMonthYear}` : 'Motor_Insurance';
        exportToExcel(rows, label);
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
            <div className="flex gap-3 mb-4" style={{ marginBottom: '1.5rem', alignItems: 'center' }}>
                <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search by policy holder name..."
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <div className="form-group" style={{ marginBottom: 0, minWidth: '220px', position: 'relative' }}>
                    <div style={{ position: 'relative' }}>
                        <input
                            type="month"
                            className="form-input"
                            value={selectedMonthYear}
                            onChange={(e) => setSelectedMonthYear(e.target.value)}
                            title="Click to select month and year"
                            style={{ paddingRight: selectedMonthYear ? '2.5rem' : '1rem', cursor: 'pointer' }}
                            onKeyDown={(e) => e.preventDefault()}
                        />
                        {selectedMonthYear && (
                            <button
                                onClick={handleClearMonth}
                                className="btn btn-sm"
                                style={{
                                    position: 'absolute',
                                    right: '0.5rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    padding: '0.25rem 0.5rem',
                                    fontSize: '0.75rem',
                                    background: 'var(--bg-tertiary)',
                                    border: 'none',
                                    color: 'var(--text-muted)',
                                    cursor: 'pointer',
                                    borderRadius: 'var(--radius-sm)'
                                }}
                                title="Clear filter"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSearch}
                    style={{ whiteSpace: 'nowrap' }}
                >
                    Search
                </button>
                <button
                    className="btn btn-sm"
                    onClick={handleReset}
                    style={{ whiteSpace: 'nowrap', border: '1px solid #fecaca', color: '#ef4444', background: 'var(--bg-tertiary)' }}
                >
                    Reset
                </button>
                <button
                    onClick={handleExport}
                    disabled={policies.length === 0}
                    title="Download filtered data as Excel"
                    style={{
                        background: 'none',
                        border: 'none',
                        cursor: policies.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: policies.length === 0 ? 0.4 : 1,
                        padding: '0.25rem',
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <img src="/excel_icon.png" alt="Download Excel" style={{ width: '36px', height: '36px' }} />
                </button>
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
                                <>
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
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => toggleRowExpansion(policy._id)}
                                                >
                                                    {expandedRow === policy._id ? 'Hide' : 'Details'}
                                                </button>
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
                                    {expandedRow === policy._id && (
                                        <tr>
                                            <td colSpan="8" style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                    <div>
                                                        <strong>Registration Number:</strong>
                                                        <div>{policy.registrationNumber}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Policy Number:</strong>
                                                        <div>{policy.policyNumber}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Policy Holder Name:</strong>
                                                        <div>{policy.policyHolderName}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Policy Holder DOB:</strong>
                                                        <div>{formatDate(policy.policyHolderDOB)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Mobile Number:</strong>
                                                        <div>{policy.mobileNumber}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Insurance Company:</strong>
                                                        <div>{policy.insuranceCompanyName}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Service Provider:</strong>
                                                        <div>{policy.serviceProviderCompanyName}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Policy Start Date:</strong>
                                                        <div>{formatDate(policy.policyStartDate)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Policy End Date:</strong>
                                                        <div>{formatDate(policy.policyEndDate)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Premium Amount:</strong>
                                                        <div>₹{policy.premiumAmount.toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Nominee Name:</strong>
                                                        <div>{policy.nomineeName}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Nominee DOB:</strong>
                                                        <div>{formatDate(policy.nomineeDOB)}</div>
                                                    </div>
                                                    {policy.agentName && (
                                                        <div>
                                                            <strong>Agent Name:</strong>
                                                            <div>{policy.agentName}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MotorInsuranceTable;
