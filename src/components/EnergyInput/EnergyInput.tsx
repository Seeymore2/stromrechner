url: https://raw.githubusercontent.com/Seeymore2/stromrechner/main/src/components/EnergyInput/EnergyInput.tsx

import React, { useState, useEffect } from 'react';

interface EnergyInputProps {
  value?: number;
  onChange?: (value: number) => void;
  label?: string;
  min?: number;
  max?: number;
}

const EnergyInput: React.FC<EnergyInputProps> = ({
  value = 0,
  onChange,
  label = 'Annual Consumption (kWh)',
  min = 0,
  max = 100000,
}) => {
  const [inputValue, setInputValue] = useState<string>(value.toString());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    setInputValue(rawValue);
    
    // Allow empty string for better UX
    if (rawValue === '') {
      setError(null);
      onChange?.(0);
      return;
    }

    // Replace comma with period for parsing
    const normalizedValue = rawValue.replace(',', '.');
    
    // Check if it is a valid number
    if (!/^-?\d*\.?\d*$/.test(normalizedValue)) {
      setError('Please enter a valid number');
      return;
    }

    const numValue = parseFloat(normalizedValue);
    
    // Validate range
    if (numValue < min) {
      setError(`Must be at least ${min}`);
      return;
    }
    
    if (numValue > max) {
      setError(`Must be at most ${max}`);
      return;
    }

    setError(null);
    onChange?.(numValue);
  };

  return (
    <div className="energy-input">
      <label htmlFor="energy-input">
        {label}
        <input
          id="energy-input"
          type="text"
          value={inputValue}
          onChange={handleChange}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? 'energy-error' : undefined}
        />
      </label>
      {error && (
        <span id="energy-error" className="error-message">
          {error}
        </span>
      )}
      <div className="hint">
        German format: 1.234,56 kWh
      </div>
  
  </div>
  );
};

export default EnergyInput;