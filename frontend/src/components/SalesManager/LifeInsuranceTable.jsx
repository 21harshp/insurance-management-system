import { useState, useEffect } from 'react';
import { lifeInsuranceAPI } from '../../services/api';
import { errorMessage, successMessage } from '../../utils/message';

const LifeInsuranceTable = ({ refreshTrigger }) => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchName, setSearchName] = useState('');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [expandedRow, setExpandedRow] = useState(null);

    const fetchPolicies = async () => {
        try {
            setLoading(true);
            const params = {};

            // Parse month-year picker value (format: YYYY-MM)
            if (selectedMonthYear) {
                const [year, month] = selectedMonthYear.split('-');
                params.year = year;
                params.month = parseInt(month) - 1; // Convert to 0-indexed month
            }

            if (searchName) params.search = searchName;

            const response = await lifeInsuranceAPI.getAll(params);
            setPolicies(response.data);
        } catch (err) {
            console.error('Failed to fetch policies:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPolicies();
    }, [refreshTrigger, selectedMonthYear, searchName]);

    const handleDelete = async (insurance) => {
        try {
            const response = await lifeInsuranceAPI.delete(insurance._id);
            if (response.status === 200) {
                successMessage(response?.data?.message || 'Insurance deleted successfully');
                fetchPolicies();
            }
        } catch (err) {
            console.error('Failed to delete insurance:', err);
            errorMessage(err?.response?.data?.message || 'Failed to delete insurance');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const toggleRowExpansion = (policyId) => {
        setExpandedRow(expandedRow === policyId ? null : policyId);
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
                                onClick={() => setSelectedMonthYear('')}
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
                                <th>Policy Number</th>
                                <th>Policy Holder</th>
                                <th>Mobile</th>
                                <th>Plan/Term/PPT</th>
                                <th>Premium</th>
                                <th>Sum Assured</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {policies.map((policy) => (
                                <>
                                    <tr key={policy._id}>
                                        <td>
                                            <span className="badge badge-primary">
                                                {policy.policyNumber}
                                            </span>
                                        </td>
                                        <td>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{policy.policyHolderName}</div>
                                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    DOB: {formatDate(policy.dateOfBirth)}
                                                </div>
                                            </div>
                                        </td>
                                        <td>{policy.mobileNumber}</td>
                                        <td>
                                            <span className="badge badge-info">
                                                {policy.planTermPPT}
                                            </span>
                                        </td>
                                        <td>{formatCurrency(policy.premiumAmount)}</td>
                                        <td>{formatCurrency(policy.sumAssured)}</td>
                                        <td>
                                            <div className="flex gap-1">
                                                <button
                                                    className="btn btn-sm btn-outline"
                                                    onClick={() => toggleRowExpansion(policy._id)}
                                                >
                                                    {expandedRow === policy._id ? 'Hide' : 'Details'}
                                                </button>
                                                {policy.document && (
                                                    <a
                                                        href={policy.document}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline"
                                                    >
                                                        Doc
                                                    </a>
                                                )}
                                                {policy.proposalForm && (
                                                    <a
                                                        href={policy.proposalForm}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-outline"
                                                    >
                                                        Proposal
                                                    </a>
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
                                            <td colSpan="7" style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.5rem' }}>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                                                    <div>
                                                        <strong>Address:</strong>
                                                        <div>{policy.policyHolderAddress}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Date of Commencement:</strong>
                                                        <div>{formatDate(policy.dateOfCommencement)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Payment Mode:</strong>
                                                        <div>{policy.paymentMode}</div>
                                                    </div>
                                                    <div>
                                                        <strong>First Unpaid Premium:</strong>
                                                        <div>{formatDate(policy.firstUnpaidPremium)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Date of Last Premium:</strong>
                                                        <div>{formatDate(policy.dateOfLastPremium)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Maturity Amount:</strong>
                                                        <div>{formatCurrency(policy.maturityAmount)}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Agent Code:</strong>
                                                        <div>{policy.agentCode}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Nominee Name:</strong>
                                                        <div>{policy.nomineeName}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Nominee Relation:</strong>
                                                        <div>{policy.nomineeRelation}</div>
                                                    </div>
                                                    <div>
                                                        <strong>Nominee DOB:</strong>
                                                        <div>{formatDate(policy.nomineeDOB)}</div>
                                                    </div>
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

export default LifeInsuranceTable;
