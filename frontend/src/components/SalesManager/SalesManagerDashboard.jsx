import { useState } from 'react';
import Navbar from '../Common/Navbar';
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
    const [insuranceType, setInsuranceType] = useState('health');
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handlePolicyCreated = () => {
        setEditingPolicy(null);
        setShowFormModal(false);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleRenew = (policy) => {
        setEditingPolicy(policy);
        setShowFormModal(true);
    };

    const handleCloseModal = () => {
        setShowFormModal(false);
        setEditingPolicy(null);
    };

    const insuranceLabel = insuranceType === 'health' ? 'Health' : insuranceType === 'motor' ? 'Motor' : 'Life';

    return (
        <div>
            <Navbar onChangePassword={() => setShowChangePassword(true)} />

            <div className="container">
                <div className="dashboard-header">
                    <h1>Sales Manager Dashboard</h1>
                    <div className="dashboard-header-actions">
                        <InsuranceSelector
                            selected={insuranceType}
                            onChange={setInsuranceType}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={() => { setEditingPolicy(null); setShowFormModal(true); }}
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
                            />
                        ) : insuranceType === 'motor' ? (
                            <MotorInsuranceTable
                                refreshTrigger={refreshTrigger}
                                onRenew={handleRenew}
                            />
                        ) : (
                            <LifeInsuranceTable
                                refreshTrigger={refreshTrigger}
                                onRenew={handleRenew}
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
                                {editingPolicy ? `Renew ${insuranceLabel} Policy` : `Create New ${insuranceLabel} Policy`}
                            </h3>
                            <button className="modal-close" onClick={handleCloseModal}>×</button>
                        </div>

                        {insuranceType === 'health' ? (
                            <HealthInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
                            />
                        ) : insuranceType === 'motor' ? (
                            <MotorInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
                            />
                        ) : (
                            <LifeInsuranceForm
                                onSuccess={handlePolicyCreated}
                                editingPolicy={editingPolicy}
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
