import { useState, useEffect } from 'react';

const DateInput = ({ name, value, onChange, required, className, label }) => {
    const [displayValue, setDisplayValue] = useState('');
    const [internalValue, setInternalValue] = useState('');

    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    useEffect(() => {
        if (value && value.includes('-')) {
            const [year, month, day] = value.split('-');
            setDisplayValue(`${day}/${month}/${year}`);
            setInternalValue(value);
        } else if (value) {
            setDisplayValue(value);
            setInternalValue(value);
        } else {
            setDisplayValue('');
            setInternalValue('');
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

        // Get the input element to set custom validity
        const inputElement = e.target;

        // Convert DD/MM/YYYY to YYYY-MM-DD for backend
        if (inputValue.length === 10) {
            const [day, month, year] = inputValue.split('/');
            if (day && month && year && year.length === 4) {
                // strict validation for day/month ranges
                const dayNum = parseInt(day, 10);
                const monthNum = parseInt(month, 10);
                const yearNum = parseInt(year, 10);

                const isoDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                const dateObj = new Date(isoDate);

                // Check if date is valid AND components match (handles 31/02/2022 -> invalid)
                const isValidDate = !isNaN(dateObj.getTime()) &&
                    dateObj.getDate() === dayNum &&
                    dateObj.getMonth() + 1 === monthNum &&
                    dateObj.getFullYear() === yearNum;

                if (isValidDate) {
                    setInternalValue(isoDate);
                    inputElement.setCustomValidity(''); // Valid
                    onChange({
                        target: {
                            name: name,
                            value: isoDate
                        }
                    });
                } else {
                    // Invalid date (logic error, e.g. month 13 or day 32)
                    inputElement.setCustomValidity('Invalid Date: Please enter a correct date.');
                    setInternalValue(''); // Clear internal value so parent knows it's invalid
                    onChange({
                        target: {
                            name: name,
                            value: ''
                        }
                    });
                }
            } else {
                inputElement.setCustomValidity('Invalid Date Format');
            }
        } else if (inputValue.length === 0) {
            // Empty
            setInternalValue('');
            inputElement.setCustomValidity(''); // Let 'required' attribute handle empty check
            onChange({
                target: {
                    name: name,
                    value: ''
                }
            });
        } else {
            // Incomplete date
            inputElement.setCustomValidity('Please enter full date (DD/MM/YYYY)');
            // Keep parent value empty or cleared while typing
            onChange({
                target: {
                    name: name,
                    value: ''
                }
            });
        }
    };

    const handleBlur = () => {
        // On blur, if we have an internal value but display is incomplete, restore the display
        if (internalValue && displayValue.length < 10) {
            const [year, month, day] = internalValue.split('-');
            setDisplayValue(`${day}/${month}/${year}`);
        }
    };

    return (
        <input
            type="text"
            name={name}
            className={className}
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            placeholder="DD/MM/YYYY"
            maxLength="10"
            required={required}
        />
    );
};

export default DateInput;
