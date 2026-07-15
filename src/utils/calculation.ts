export interface CalculationInput {
  consumption: number; // kWh
  pricePerKwh: number; // EUR/kWh
  contractType?: 'Standard' | 'Green' | 'Industrial';
}

export interface CalculationResult {
  annualCost: number; // EUR
  monthlyCost: number; // EUR
  dailyCost: number; // EUR
  co2Emissions: number; // kg CO2
  co2Savings: number; // kg CO2 (vs German grid average)
}

// CO2 emission factors for Germany 2026 (kg CO2/kWh)
const CO2_FACTORS = {
  Standard: 0.4,    // German grid average
  Green: 0.05,      // Renewable energy
  Industrial: 0.3,  // Industrial rate
};

// German grid average for comparison
const GRID_AVERAGE_CO2 = 0.4;

export function calculateAnnualCost(input: CalculationInput): CalculationResult {
  const { consumption, pricePerKwh, contractType = 'Standard' } = input;
  
  // Calculate costs
  const annualCost = consumption * pricePerKwh;
  const monthlyCost = annualCost / 12;
  const dailyCost = annualCost / 365;
  
  // Calculate CO2 emissions based on contract type
  const co2Factor = CO2_FACTORS[contractType] || CO2_FACTORS.Standard;
  const co2Emissions = consumption * co2Factor;
  
  // Calculate CO2 savings compared to German grid average
  const co2Savings = consumption * (GRID_AVERAGE_CO2 - co2Factor);
  
  return {
    annualCost: Math.round(annualCost * 100) / 100, // Round to 2 decimal places
    monthlyCost: Math.round(monthlyCost * 100) / 100,
    dailyCost: Math.round(dailyCost * 100) / 100,
    co2Emissions: Math.round(co2Emissions * 100) / 100,
    co2Savings: Math.round(co2Savings * 100) / 100,
  };
}

export function formatGermanCurrency(amount: number): string {
  return amount.toLocaleString('de-DE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatGermanNumber(num: number): string {
  return num.toLocaleString('de-DE');
}