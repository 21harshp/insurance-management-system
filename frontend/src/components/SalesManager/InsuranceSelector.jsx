import './InsuranceSelector.css';

const InsuranceSelector = ({ selected, onChange }) => {
    return (
        <div className="insurance-selector">
            <button
                className={`selector-btn ${selected === 'health' ? 'active' : ''}`}
                onClick={() => onChange('health')}
            >
                <span className="selector-icon">🏥</span>
                Health Insurance
            </button>
            <button
                className={`selector-btn ${selected === 'motor' ? 'active' : ''}`}
                onClick={() => onChange('motor')}
            >
                <span className="selector-icon">🚗</span>
                Motor Insurance
            </button>
        </div>
    );
};

export default InsuranceSelector;
