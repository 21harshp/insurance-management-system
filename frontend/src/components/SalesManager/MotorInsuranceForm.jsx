import { useState, useEffect } from 'react';
import { motorInsuranceAPI } from '../../services/api';
import { errorMessage, successMessage } from '../../utils/message';

const MotorInsuranceForm = ({ onSuccess, editingPolicy }) => {
    const [formData, setFormData] = useState({
        registrationNumber: '',
        policyStartDate: '',
        policyEndDate: '',
        policyNumber: '',
        insuranceCompanyName: '',
        mobileNumber: '',
        policyHolderName: '',
        policyHolderDOB: '',
        nomineeName: '',
        nomineeDOB: '',
        agentName: '',
        serviceProviderCompanyName: '',
        premiumAmount: '',
        policyCopyLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (editingPolicy) {
            setFormData({
                registrationNumber: editingPolicy.registrationNumber || '',
                policyStartDate: editingPolicy.policyStartDate?.split('T')[0] || '',
                policyEndDate: editingPolicy.policyEndDate?.split('T')[0] || '',
                policyNumber: editingPolicy.policyNumber || '',
                insuranceCompanyName: editingPolicy.insuranceCompanyName || '',
                mobileNumber: editingPolicy.mobileNumber || '',
                policyHolderName: editingPolicy.policyHolderName || '',
                policyHolderDOB: editingPolicy.policyHolderDOB?.split('T')[0] || '',
                nomineeName: editingPolicy.nomineeName || '',
                nomineeDOB: editingPolicy.nomineeDOB?.split('T')[0] || '',
                agentName: editingPolicy.agentName || '',
                serviceProviderCompanyName: editingPolicy.serviceProviderCompanyName || '',
                premiumAmount: editingPolicy.premiumAmount || '',
                policyCopyLink: editingPolicy.policyCopyLink || '',
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
        setLoading(true);

        try {
            await motorInsuranceAPI.create(formData);
            successMessage('Motor insurance policy created successfully');
            setFormData({
                registrationNumber: '',
                policyStartDate: '',
                policyEndDate: '',
                policyNumber: '',
                insuranceCompanyName: '',
                mobileNumber: '',
                policyHolderName: '',
                policyHolderDOB: '',
                nomineeName: '',
                nomineeDOB: '',
                agentName: '',
                serviceProviderCompanyName: '',
                premiumAmount: '',
                policyCopyLink: '',
            });
            setTimeout(() => {
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
                    <label className="form-label required">Car/Bike Registration Number</label>
                    <input
                        type="text"
                        name="registrationNumber"
                        className="form-input"
                        value={formData.registrationNumber}
                        onChange={handleChange}
                        placeholder="Enter registration number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy Start Date</label>
                    <input
                        type="date"
                        name="policyStartDate"
                        className="form-input"
                        value={formData.policyStartDate}
                        onChange={handleChange}
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy Number</label>
                    <input
                        type="text"
                        name="policyNumber"
                        className="form-input"
                        value={formData.policyNumber}
                        onChange={handleChange}
                        placeholder="Enter policy number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Insurance Company Name</label>
                    <input
                        type="text"
                        name="insuranceCompanyName"
                        className="form-input"
                        value={formData.insuranceCompanyName}
                        onChange={handleChange}
                        placeholder="Enter insurance company name"
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
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Agent Name</label>
                    <input
                        type="text"
                        name="agentName"
                        className="form-input"
                        value={formData.agentName}
                        onChange={handleChange}
                        placeholder="Enter agent name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Service Provider Company Name</label>
                    <input
                        type="text"
                        name="serviceProviderCompanyName"
                        className="form-input"
                        value={formData.serviceProviderCompanyName}
                        onChange={handleChange}
                        placeholder="Enter service provider company name"
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

export default MotorInsuranceForm;
