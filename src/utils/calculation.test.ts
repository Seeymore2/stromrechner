import { calculateAnnualCost, formatGermanCurrency, formatGermanNumber } from './calculation';

describe('calculateAnnualCost', () => {
  it('calculates cost correctly with German energy prices', () => {
    const result = calculateAnnualCost({
      consumption: 3500,
      pricePerKwh: 0.35,
    });
    
    expect(result.annualCost).toBe(1225);
    expect(result.monthlyCost).toBeCloseTo(102.08);
    expect(result.dailyCost).toBeCloseTo(3.35);
  });

  it('handles edge case: zero consumption', () => {
    const result = calculateAnnualCost({
      consumption: 0,
      pricePerKwh: 0.35,
    });
    
    expect(result.annualCost).toBe(0);
    expect(result.monthlyCost).toBe(0);
    expect(result.dailyCost).toBe(0);
    expect(result.co2Emissions).toBe(0);
    expect(result.co2Savings).toBe(0);
  });

  it('handles edge case: maximum consumption', () => {
    const result = calculateAnnualCost({
      consumption: 100000,
      pricePerKwh: 0.25,
    });
    
    expect(result.annualCost).toBe(25000);
    expect(result.monthlyCost).toBeCloseTo(2083.33);
  });

  it('calculates CO2 emissions correctly for different contract types', () => {
    const standardResult = calculateAnnualCost({
      consumption: 1000,
      pricePerKwh: 0.35,
      contractType: 'Standard',
    });
    expect(standardResult.co2Emissions).toBe(400);
    expect(standardResult.co2Savings).toBe(0);
    
    const greenResult = calculateAnnualCost({
      consumption: 1000,
      pricePerKwh: 0.35,
      contractType: 'Green',
    });
    expect(greenResult.co2Emissions).toBe(50);
    expect(greenResult.co2Savings).toBe(350);
    
    const industrialResult = calculateAnnualCost({
      consumption: 1000,
      pricePerKwh: 0.25,
      contractType: 'Industrial',
    });
    expect(industrialResult.co2Emissions).toBe(300);
    expect(industrialResult.co2Savings).toBe(100);
  });

  it('rounds monetary values to 2 decimal places', () => {
    const result = calculateAnnualCost({
      consumption: 1000,
      pricePerKwh: 0.333,
    });
    
    expect(result.annualCost).toBe(333.0);
    expect(result.monthlyCost).toBeCloseTo(27.75);
  });
});

describe('formatGermanCurrency', () => {
  it('formats currency with German locale', () => {
    expect(formatGermanCurrency(1225)).toBe('1.225,00');
    expect(formatGermanCurrency(102.08)).toBe('102,08');
    expect(formatGermanCurrency(1234567.89)).toBe('1.234.567,89');
  });

  it('handles zero correctly', () => {
    expect(formatGermanCurrency(0)).toBe('0,00');
  });
});

describe('formatGermanNumber', () => {
  it('formats numbers with German locale', () => {
    expect(formatGermanNumber(1225)).toBe('1.225');
    expect(formatGermanNumber(102.08)).toBe('102,08');
    expect(formatGermanNumber(1234567.89)).toBe('1.234.567,89');
  });

  it('handles integers correctly', () => {
    expect(formatGermanNumber(3500)).toBe('3.500');
  });
});