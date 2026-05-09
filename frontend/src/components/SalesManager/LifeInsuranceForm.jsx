import { useState, useEffect } from 'react';
import { lifeInsuranceAPI } from '../../services/api';
import { uploadAPI } from '../../services/api';
import { successMessage, errorMessage } from '../../utils/message';
import DateInput from '../Common/DateInput';

const LifeInsuranceForm = ({ onSuccess, editingPolicy, formMode = 'create' }) => {
    const [formData, setFormData] = useState({
        policyHolderName: '',
        policyHolderAddress: '',
        policyNumber: '',
        dateOfCommencement: '',
        planTermPPT: '',
        premiumAmount: '',
        firstUnpaidPremium: '',
        paymentMode: '',
        sumAssured: '',
        dateOfLastPremium: '',
        maturityAmount: '',
        mobileNumber: '',
        dateOfBirth: '',
        agentCode: '',
        nomineeName: '',
        nomineeRelation: '',
        nomineeDOB: '',
        document: '',
        proposalForm: '',
        policyCopyLink: '',
    });
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadedFileName, setUploadedFileName] = useState('');

    useEffect(() => {
        if (editingPolicy) {
            setFormData({
                policyHolderName: editingPolicy.policyHolderName || '',
                policyHolderAddress: editingPolicy.policyHolderAddress || '',
                policyNumber: editingPolicy.policyNumber || '',
                dateOfCommencement: editingPolicy.dateOfCommencement?.split('T')[0] || '',
                planTermPPT: editingPolicy.planTermPPT || '',
                premiumAmount: editingPolicy.premiumAmount || '',
                firstUnpaidPremium: editingPolicy.firstUnpaidPremium?.split('T')[0] || '',
                paymentMode: editingPolicy.paymentMode || '',
                sumAssured: editingPolicy.sumAssured || '',
                dateOfLastPremium: editingPolicy.dateOfLastPremium?.split('T')[0] || '',
                maturityAmount: editingPolicy.maturityAmount || '',
                mobileNumber: editingPolicy.mobileNumber || '',
                dateOfBirth: editingPolicy.dateOfBirth?.split('T')[0] || '',
                agentCode: editingPolicy.agentCode || '',
                nomineeName: editingPolicy.nomineeName || '',
                nomineeRelation: editingPolicy.nomineeRelation || '',
                nomineeDOB: editingPolicy.nomineeDOB?.split('T')[0] || '',
                document: editingPolicy.document || '',
                proposalForm: editingPolicy.proposalForm || '',
                policyCopyLink: editingPolicy.policyCopyLink || '',
            });
            if (editingPolicy.policyCopyLink) {
                setUploadedFileName('Previously uploaded file');
            }
        }
    }, [editingPolicy]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Special handling for Plan/Term/PPT field
        if (name === 'planTermPPT') {
            // Remove non-numeric and non-slash characters
            let cleaned = value.replace(/[^\d/]/g, '');

            // Auto-format as user types (nnn/nn/nn)
            if (cleaned.length > 0) {
                let parts = cleaned.split('/');
                if (parts[0] && parts[0].length > 3) {
                    parts[0] = parts[0].substring(0, 3);
                }
                if (parts[1] && parts[1].length > 2) {
                    parts[1] = parts[1].substring(0, 2);
                }
                if (parts[2] && parts[2].length > 2) {
                    parts[2] = parts[2].substring(0, 2);
                }
                cleaned = parts.join('/');
            }

            setFormData({
                ...formData,
                [name]: cleaned,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
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
            // Reset the file input
            e.target.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (formMode === 'edit' && editingPolicy?._id) {
                await lifeInsuranceAPI.update(editingPolicy._id, formData);
                successMessage('Life insurance policy updated successfully');
            } else {
                await lifeInsuranceAPI.create(formData);
                successMessage('Life insurance policy created successfully');
            }
            setFormData({
                policyHolderName: '',
                policyHolderAddress: '',
                policyNumber: '',
                dateOfCommencement: '',
                planTermPPT: '',
                premiumAmount: '',
                firstUnpaidPremium: '',
                paymentMode: '',
                sumAssured: '',
                dateOfLastPremium: '',
                maturityAmount: '',
                mobileNumber: '',
                dateOfBirth: '',
                agentCode: '',
                nomineeName: '',
                nomineeRelation: '',
                nomineeDOB: '',
                document: '',
                proposalForm: '',
                policyCopyLink: '',
            });
            setUploadedFileName('');
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
                    <label className="form-label required">Policy Holder Address</label>
                    <textarea
                        name="policyHolderAddress"
                        className="form-input"
                        value={formData.policyHolderAddress}
                        onChange={handleChange}
                        placeholder="Enter policy holder address"
                        rows="3"
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
                    <label className="form-label required">Date of Commencement (DOC)</label>
                    <DateInput
                        name="dateOfCommencement"
                        className="form-input"
                        value={formData.dateOfCommencement}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Plan / Term / PPT</label>
                    <input
                        type="text"
                        name="planTermPPT"
                        className="form-input"
                        value={formData.planTermPPT}
                        onChange={handleChange}
                        placeholder="Format: nnn/nn/nn (e.g., 100/20/15)"
                        pattern="^\d{1,3}/\d{1,2}/\d{1,2}$"
                        title="Please use format: nnn/nn/nn (e.g., 100/20/15)"
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
                    <label className="form-label required">First Unpaid Premium (FUP)</label>
                    <DateInput
                        name="firstUnpaidPremium"
                        className="form-input"
                        value={formData.firstUnpaidPremium}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Payment Mode</label>
                    <select
                        name="paymentMode"
                        className="form-input"
                        value={formData.paymentMode}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select payment mode</option>
                        <option value="Monthly ECS">Monthly ECS</option>
                        <option value="Quarterly">Quarterly</option>
                        <option value="Half-Yearly">Half-Yearly</option>
                        <option value="Yearly">Yearly</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="form-label required">Sum Assured</label>
                    <input
                        type="number"
                        name="sumAssured"
                        className="form-input"
                        value={formData.sumAssured}
                        onChange={handleChange}
                        placeholder="Enter sum assured"
                        min="0"
                        step="0.01"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Date of Last Premium</label>
                    <DateInput
                        name="dateOfLastPremium"
                        className="form-input"
                        value={formData.dateOfLastPremium}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Maturity Amount</label>
                    <input
                        type="number"
                        name="maturityAmount"
                        className="form-input"
                        value={formData.maturityAmount}
                        onChange={handleChange}
                        placeholder="Enter maturity amount"
                        min="0"
                        step="0.01"
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
                        pattern="[0-9]{10}"
                        title="Please enter a 10-digit mobile number"
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Date of Birth (DOB)</label>
                    <DateInput
                        name="dateOfBirth"
                        className="form-input"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label className="form-label required">Agent Code</label>
                    <input
                        type="text"
                        name="agentCode"
                        className="form-input"
                        value={formData.agentCode}
                        onChange={handleChange}
                        placeholder="Enter agent code"
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
                    <label className="form-label required">Nominee Relation</label>
                    <input
                        type="text"
                        name="nomineeRelation"
                        className="form-input"
                        value={formData.nomineeRelation}
                        onChange={handleChange}
                        placeholder="Enter nominee relation"
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
                    <label className="form-label">Document (Optional)</label>
                    <input
                        type="text"
                        name="document"
                        className="form-input"
                        value={formData.document}
                        onChange={handleChange}
                        placeholder="Enter document link (URL)"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Proposal Form (Optional)</label>
                    <input
                        type="text"
                        name="proposalForm"
                        className="form-input"
                        value={formData.proposalForm}
                        onChange={handleChange}
                        placeholder="Enter proposal form link (URL)"
                    />
                </div>

                <div className="form-group">
                    <label className="form-label">Policy Copy (Optional)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label
                            htmlFor="life-policy-copy-upload"
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
                            id="life-policy-copy-upload"
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

export default LifeInsuranceForm;
