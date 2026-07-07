import React, { useState } from 'react';
import EnergyInput from '../EnergyInput/EnergyInput';
import { calculateAnnualCost, formatGermanCurrency } from '../../utils/calculation';

const Calculator: React.FC = () => {
  const [consumption, setConsumption] = useState<number>(3500);
  const [pricePerKwh, setPricePerKwh] = useState<number>(0.35);
  const [contractType, setContractType] = useState<'Standard' | 'Green' | 'Industrial'>('Standard');
  const [results, setResults] = useState<ReturnType<typeof calculateAnnualCost> | null>(null);

  const handleCalculate = () => {
    const result = calculateAnnualCost({
      consumption,
      pricePerKwh,
      contractType,
    });
    setResults(result);
  };

  return (
    <div className="calculator">
      <h1>Stromrechner</h1>
      
      <div className="inputs">
        <EnergyInput
          value={consumption}
          onChange={setConsumption}
          label="Annual Consumption (kWh)"
          min={0}
          max={100000}
        />
        
        <div className="price-input">
          <label htmlFor="price-input">
            Price per kWh (EUR)
            <input
              id="price-input"
              type="number"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(parseFloat(e.target.value) || 0)}
              min={0}
              step={0.01}
            />
          </label>
        </div>
        
        <div className="contract-type">
          <label htmlFor="contract-type">
            Contract Type
            <select
              id="contract-type"
              value={contractType}
              onChange={(e) => setContractType(e.target.value as 'Standard' | 'Green' | 'Industrial')}
            >
              <option value="Standard">Standard</option>
              <option value="Green">Green</option>
              <option value="Industrial">Industrial</option>
            </select>
          </label>
        </div>
        
        <button onClick={handleCalculate} disabled={consumption <= 0 || pricePerKwh <= 0}>
          Calculate
        </button>
      </div>
      
      {results && (
        <div className="results" data-testid="results">
          <h2>Results</h2>
          <div data-testid="annual-cost">
            Annual Cost: {formatGermanCurrency(results.annualCost)} EUR
          </div>
          <div data-testid="monthly-cost">
            Monthly Cost: {formatGermanCurrency(results.monthlyCost)} EUR
          </div>
          <div data-testid="daily-cost">
            Daily Cost: {formatGermanCurrency(results.dailyCost)} EUR
          </div>
          <div data-testid="co2-emissions">
            CO2 Emissions: {formatGermanCurrency(results.co2Emissions)} kg
          </div>
          <div data-testid="co2-savings">
            CO2 Savings: {formatGermanCurrency(results.co2Savings)} kg
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;