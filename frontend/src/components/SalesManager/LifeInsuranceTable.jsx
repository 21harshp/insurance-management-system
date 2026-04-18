import { useState, useEffect } from 'react';
import { lifeInsuranceAPI } from '../../services/api';
import { errorMessage, successMessage } from '../../utils/message';
import { exportToExcel } from '../../utils/exportExcel';

const LifeInsuranceTable = ({ refreshTrigger }) => {
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

    const handleExport = () => {
        const rows = policies.map((p) => ({
            'Policy Number': p.policyNumber || '',
            'Policy Holder Name': p.policyHolderName || '',
            'Date of Birth': formatDate(p.dateOfBirth),
            'Mobile Number': p.mobileNumber || '',
            'Address': p.policyHolderAddress || '',
            'Plan / Term / PPT': p.planTermPPT || '',
            'Date of Commencement': formatDate(p.dateOfCommencement),
            'Payment Mode': p.paymentMode || '',
            'Premium Amount': p.premiumAmount || '',
            'Sum Assured': p.sumAssured || '',
            'Maturity Amount': p.maturityAmount || '',
            'First Unpaid Premium': formatDate(p.firstUnpaidPremium),
            'Date of Last Premium': formatDate(p.dateOfLastPremium),
            'Agent Code': p.agentCode || '',
            'Nominee Name': p.nomineeName || '',
            'Nominee Relation': p.nomineeRelation || '',
            'Nominee DOB': formatDate(p.nomineeDOB),
            'Document Link': p.document || '',
            'Proposal Form Link': p.proposalForm || '',
        }));
        const label = selectedMonthYear ? `Life_${selectedMonthYear}` : 'Life_Insurance';
        exportToExcel(rows, label);
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
