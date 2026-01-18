import { useState, useEffect } from 'react';

const DateInput = ({ name, value, onChange, required, className, label }) => {
    const [displayValue, setDisplayValue] = useState('');

    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    useEffect(() => {
        if (value && value.includes('-')) {
            const [year, month, day] = value.split('-');
            setDisplayValue(`${day}/${month}/${year}`);
        } else {
            setDisplayValue(value);
        }
    }, [value]);

    const handleInputChange = (e) => {
        let inputValue = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

        // Auto-format as user types
        if (inputValue.length >= 2) {
            inputValue = inputValue.slice(0, 2) + '/' + inputValue.slice(2);
        }
        if (inputValue.length >= 5) {
            inputValue = inputValue.slice(0, 5) + '/' + inputValue.slice(5, 9);
        }

        setDisplayValue(inputValue);

        // Convert DD/MM/YYYY to YYYY-MM-DD for backend
        if (inputValue.length === 10) {
            const [day, month, year] = inputValue.split('/');
            if (day && month && year && year.length === 4) {
                const isoDate = `${year}-${month}-${day}`;
                // Validate date
                const dateObj = new Date(isoDate);
                if (!isNaN(dateObj.getTime())) {
                    onChange({
                        target: {
                            name: name,
                            value: isoDate
                        }
                    });
                }
            }
        } else {
            // Clear the value if incomplete
            onChange({
                target: {
                    name: name,
                    value: ''
                }
            });
        }
    };

    return (
        <input
            type="text"
            name={name}
            className={className}
            value={displayValue}
            onChange={handleInputChange}
            placeholder="DD/MM/YYYY"
            maxLength="10"
            required={required}
        />
    );
};

export default DateInput;
