import { useState, useEffect } from 'react';
import { healthInsuranceAPI, uploadAPI } from '../../services/api';
import { successMessage, errorMessage } from '../../utils/message';
import DateInput from '../Common/DateInput';

const HealthInsuranceForm = ({ onSuccess, editingPolicy, formMode = 'create' }) => {
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
    const [uploading, setUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

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
            if (editingPolicy.policyCopyLink) {
                setUploadedFileName('Previously uploaded file');
            }
        }
    }, [editingPolicy]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setUploadedFileName('');
        try {
            const response = await uploadAPI.uploadPolicyCopy(file);
            setFormData((prev) => ({ ...prev, policyCopyLink: response.data.url }));
            setUploadedFileName(file.name);
            successMessage('Policy copy uploaded to Google Drive successfully!');
        } catch (err) {
            errorMessage(err.response?.data?.message || 'File upload failed. Please try again.');
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            if (formMode === 'edit' && editingPolicy?._id) {
                await healthInsuranceAPI.update(editingPolicy._id, formData);
                successMessage('Health insurance policy updated successfully');
            } else {
                await healthInsuranceAPI.create(formData);
                successMessage('Health insurance policy created successfully');
            }
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
            setUploadedFileName('');
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
                    <DateInput
                        name="policyStartDate"
                        className="form-input"
                        value={formData.policyStartDate}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Policy End Date</label>
                    <DateInput
                        name="policyEndDate"
                        className="form-input"
                        value={formData.policyEndDate}
                        onChange={handleChange}
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
                    <DateInput
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
                    <DateInput
                        name="nomineeDOB"
                        className="form-input"
                        value={formData.nomineeDOB}
                        onChange={handleChange}
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
                    <label className="form-label">Policy Copy</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label
                            htmlFor="health-policy-copy-upload"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 16px',
                                background: uploading ? '#6c757d' : 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                                color: '#fff',
                                borderRadius: '8px',
                                cursor: uploading ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '14px',
                                width: 'fit-content',
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {uploading ? (
                                <>
                                    <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                                    Uploading to Drive...
                                </>
                            ) : (
                                <>
                                    📎 Upload Policy Copy
                                </>
                            )}
                        </label>
                        <input
                            id="health-policy-copy-upload"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                            onChange={handleFileUpload}
                            disabled={uploading}
                            style={{ display: 'none' }}
                        />
                        {uploadedFileName && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16a34a', fontWeight: '500' }}>
                                <span>✅</span>
                                <span>{uploadedFileName}</span>
                            </div>
                        )}
                        {formData.policyCopyLink && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                <a href={formData.policyCopyLink} target="_blank" rel="noopener noreferrer" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
                                    🔗 View uploaded file on Google Drive
                                </a>
                            </div>
                        )}
                        <input
                            type="url"
                            name="policyCopyLink"
                            className="form-input"
                            value={formData.policyCopyLink}
                            onChange={handleChange}
                            placeholder="Or paste a Google Drive / URL link manually"
                            style={{ fontSize: '13px' }}
                        />
                    </div>
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
                    {loading
                        ? 'Saving...'
                        : formMode === 'edit'
                            ? 'Update Policy'
                            : formMode === 'renew'
                                ? 'Create Renewed Policy'
                                : 'Create Policy'}
                </button>
            </form>
        </div>
    );
};

export default HealthInsuranceForm;
