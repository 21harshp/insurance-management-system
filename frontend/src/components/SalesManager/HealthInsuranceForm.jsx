import { useState, useEffect } from 'react';
import { healthInsuranceAPI } from '../../services/api';
import { successMessage } from '../../utils/message';

const HealthInsuranceForm = ({ onSuccess, editingPolicy }) => {
    const [formData, setFormData] = useState({
        policyStartDate: '',
        policyEndDate: '',
        mobileNumber: '',
        policyHolderName: '',
        policyHolderDOB: '',
        nomineeName: '',
        nomineeDOB: '',
        companyName: '',
        tpaName: '',
        premiumAmount: '',
        policyCopyLink: '',
        agentName: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editingPolicy) {
            setFormData({
                policyStartDate: editingPolicy.policyStartDate?.split('T')[0] || '',
                policyEndDate: editingPolicy.policyEndDate?.split('T')[0] || '',
                mobileNumber: editingPolicy.mobileNumber || '',
                policyHolderName: editingPolicy.policyHolderName || '',
                policyHolderDOB: editingPolicy.policyHolderDOB?.split('T')[0] || '',
                nomineeName: editingPolicy.nomineeName || '',
                nomineeDOB: editingPolicy.nomineeDOB?.split('T')[0] || '',
                companyName: editingPolicy.companyName || '',
                tpaName: editingPolicy.tpaName || '',
                premiumAmount: editingPolicy.premiumAmount || '',
                policyCopyLink: editingPolicy.policyCopyLink || '',
                agentName: editingPolicy.agentName || '',
            });
        }
    }, [editingPolicy]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            await healthInsuranceAPI.create(formData);
            successMessage('Health insurance policy created successfully');
            setFormData({
                policyStartDate: '',
                policyEndDate: '',
                mobileNumber: '',
                policyHolderName: '',
                policyHolderDOB: '',
                nomineeName: '',
                nomineeDOB: '',
                companyName: '',
                tpaName: '',
                premiumAmount: '',
                policyCopyLink: '',
                agentName: '',
            });
            setTimeout(() => {
                setSuccess('');
                onSuccess();
            }, 2000);
        } catch (err) {
            errorMessage(err.response?.data?.message || 'Failed to create policy');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label required">Policy Start Date</label>
                    <input
                        type="date"
                        name="policyStartDate"
                        className="form-input"
                        value={formData.policyStartDate}
                        onChange={handleChange}
                        placeholder="dd/mm/yyyy"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy End Date</label>
                    <input
                        type="date"
                        name="policyEndDate"
                        className="form-input"
                        value={formData.policyEndDate}
                        onChange={handleChange}
                        placeholder="dd/mm/yyyy"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Mobile Number</label>
                    <input
                        type="tel"
                        name="mobileNumber"
                        className="form-input"
                        value={formData.mobileNumber}
                        onChange={handleChange}
                        placeholder="Enter mobile number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy Holder Name</label>
                    <input
                        type="text"
                        name="policyHolderName"
                        className="form-input"
                        value={formData.policyHolderName}
                        onChange={handleChange}
                        placeholder="Enter policy holder name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy Holder DOB</label>
                    <input
                        type="date"
                        name="policyHolderDOB"
                        className="form-input"
                        value={formData.policyHolderDOB}
                        onChange={handleChange}
                        placeholder="dd/mm/yyyy"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Nominee Name</label>
                    <input
                        type="text"
                        name="nomineeName"
                        className="form-input"
                        value={formData.nomineeName}
                        onChange={handleChange}
                        placeholder="Enter nominee name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Nominee DOB</label>
                    <input
                        type="date"
                        name="nomineeDOB"
                        className="form-input"
                        value={formData.nomineeDOB}
                        onChange={handleChange}
                        placeholder="dd/mm/yyyy"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        className="form-input"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="Enter insurance company name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">TPA Name</label>
                    <input
                        type="text"
                        name="tpaName"
                        className="form-input"
                        value={formData.tpaName}
                        onChange={handleChange}
                        placeholder="Enter TPA name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Premium Amount</label>
                    <input
                        type="number"
                        name="premiumAmount"
                        className="form-input"
                        value={formData.premiumAmount}
                        onChange={handleChange}
                        placeholder="Enter premium amount"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy Copy Link</label>
                    <input
                        type="url"
                        name="policyCopyLink"
                        className="form-input"
                        value={formData.policyCopyLink}
                        onChange={handleChange}
                        placeholder="Enter policy copy link"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Agent Name (Optional)</label>
                    <input
                        type="text"
                        name="agentName"
                        className="form-input"
                        value={formData.agentName}
                        onChange={handleChange}
                        placeholder="Enter agent name"
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-primary w-full"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : editingPolicy ? 'Create Renewed Policy' : 'Create Policy'}
                </button>
            </form>
        </div>
    );
};

export default HealthInsuranceForm;
