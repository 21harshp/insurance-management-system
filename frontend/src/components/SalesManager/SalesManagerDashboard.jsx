import { useState } from 'react';
import Navbar from '../Common/Navbar';
import { useAuth } from '../../context/AuthContext';
import ChangePassword from '../Auth/ChangePassword';
import InsuranceSelector from './InsuranceSelector';
import HealthInsuranceForm from './HealthInsuranceForm';
import HealthInsuranceTable from './HealthInsuranceTable';
import MotorInsuranceForm from './MotorInsuranceForm';
import MotorInsuranceTable from './MotorInsuranceTable';
import LifeInsuranceForm from './LifeInsuranceForm';
import LifeInsuranceTable from './LifeInsuranceTable';
import './SalesManagerDashboard.css';

const SalesManagerDashboard = () => {
    const { user } = useAuth();
    const [insuranceType, setInsuranceType] = useState('health');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [formMode, setFormMode] = useState('create');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handlePolicyCreated = () => {
        setEditingPolicy(null);
        setShowFormModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleRenew = (policy) => {
        setEditingPolicy(policy);
        setFormMode('renew');
        setShowFormModal(true);
    };

    const handleEdit = (policy) => {
        setEditingPolicy(policy);
        setFormMode('edit');
        setShowFormModal(true);
    };

    const handleCloseModal = () => {
        setShowFormModal(false);
        setEditingPolicy(null);
        setFormMode('create');
    };

    const insuranceLabel = insuranceType === 'health' ? 'Health' : insuranceType === 'motor' ? 'Motor' : 'Life';

    return (
        <div>
            <Navbar onChangePassword={() => setShowChangePassword(true)} />

            <div className="container">
                {user?.planWarning && (
                    <div className="sm-plan-warning-banner">
                        Your plan ends in {user.planWarning.daysLeft} day{user.planWarning.daysLeft === 1 ? '' : 's'}. Contact your administrator.
                    </div>
                )}
                <div className="dashboard-header">
                    <h1>Sales Manager Dashboard</h1>
                    <div className="dashboard-header-actions">
                        <InsuranceSelector
                            selected={insuranceType}
                            onChange={setInsuranceType}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditingPolicy(null); setFormMode('create'); setShowFormModal(true); }}
                        >
                            + Create New Policy
                        </button>
                    </div>
                </div>

                <div className="dashboard-table-full">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">
                                {insuranceLabel} Insurance Policies
                            </h3>
                        </div>

                        {insuranceType === 'health' ? (
                            <HealthInsuranceTable
                                refreshTrigger={refreshTrigger}
                                onRenew={handleRenew}
                                onEdit={handleEdit}
                            />
                        ) : insuranceType === 'motor' ? (
                            <MotorInsuranceTable
                                refreshTrigger={refreshTrigger}
                                onRenew={handleRenew}
                                onEdit={handleEdit}
                            />
                        ) : (
                            <LifeInsuranceTable
                                refreshTrigger={refreshTrigger}
                                onEdit={handleEdit}
                            />
                        )}
                    </div>
                </div>
            </div>

            {/* Create / Renew Policy Modal */}
            {showFormModal && (
                <div className="modal-overlay" onClick={handleCloseModal}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">
                                {formMode === 'edit'
                                    ? `Edit ${insuranceLabel} Policy`
                                    : formMode === 'renew'
                                        ? `Renew ${insuranceLabel} Policy`
                                        : `Create New ${insuranceLabel} Policy`}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        {insuranceType === 'health' ? (
                            <HealthInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
                                formMode={formMode}
                            />
                        ) : insuranceType === 'motor' ? (
                            <MotorInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
                                formMode={formMode}
                            />
                        ) : (
                            <LifeInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
                                formMode={formMode}
                            />
                        )}
                    </div>
                </div>
            )}

            <ChangePassword
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </div>
    );
};

export default SalesManagerDashboard;
