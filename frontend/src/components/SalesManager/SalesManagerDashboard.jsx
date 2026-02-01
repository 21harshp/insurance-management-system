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
    const [editingPolicy, setEditingPolicy] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handlePolicyCreated = () => {
        setEditingPolicy(null);
        setRefreshTrigger(prev => prev + 1);
    };

    const handleRenew = (policy) => {
        setEditingPolicy(policy);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };


    return (
        <div>
            <Navbar onChangePassword={() => setShowChangePassword(true)} />

            <div className="container">
                <div className="dashboard-header">
                    <h1>Sales Manager Dashboard</h1>
                    <InsuranceSelector
                        selected={insuranceType}
                        onChange={setInsuranceType}
                    />
                </div>

                <div className="dashboard-content">
                    <div className="dashboard-form">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    {editingPolicy ? 'Renew Policy' : 'Create New Policy'}
                                </h3>
                                {editingPolicy && (
                                    <button
                                        className="btn btn-sm btn-outline"
                                        onClick={() => setEditingPolicy(null)}
                                    >
                                        Cancel
                                    </button>
                                )}
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

                    <div className="dashboard-table">
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title">
                                    {insuranceType === 'health' ? 'Health' : insuranceType === 'motor' ? 'Motor' : 'Life'} Insurance Policies
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
            </div>

            <ChangePassword
                isOpen={showChangePassword}
                onClose={() => setShowChangePassword(false)}
            />
        </div>
    );
};

export default SalesManagerDashboard;
