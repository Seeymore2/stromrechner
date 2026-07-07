import { test, expect } from '@playwright/test';
import { germanHousehold, co2Factors } from '../fixtures/test-data';
import { 
  fillCalculatorForm, 
  selectContractType, 
  clickCalculate, 
  verifyResultsVisible,
  verifyErrorMessage,
  verifyCalculateButtonDisabled,
  formatGermanCurrency
} from '../utils/helpers';

test.describe('Calculation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('complete calculation journey with single person household', async ({ page }) => {
    const { consumption, pricePerKwh, expectedAnnualCost } = germanHousehold.singlePerson;
    
    await fillCalculatorForm(page, consumption, pricePerKwh);
    await clickCalculate(page);
    
    await verifyResultsVisible(page);
    
    const expectedAnnualCostFormatted = formatGermanCurrency(expectedAnnualCost);
    await expect(page.getByTestId('annual-cost')).toContainText(expectedAnnualCostFormatted);
    
    const expectedMonthlyCost = expectedAnnualCost / 12;
    const expectedMonthlyCostFormatted = formatGermanCurrency(expectedMonthlyCost);
    await expect(page.getByTestId('monthly-cost')).toContainText(expectedMonthlyCostFormatted);
  });

  test('complete calculation journey with family of 4', async ({ page }) => {
    const { consumption, pricePerKwh, expectedAnnualCost } = germanHousehold.familyOf4;
    
    await fillCalculatorForm(page, consumption, pricePerKwh);
    await clickCalculate(page);
    
    await verifyResultsVisible(page);
    
    const expectedAnnualCostFormatted = formatGermanCurrency(expectedAnnualCost);
    await expect(page.getByTestId('annual-cost')).toContainText(expectedAnnualCostFormatted);
  });

  test('handles invalid input gracefully - negative consumption', async ({ page }) => {
    await fillCalculatorForm(page, -100, 0.35);
    
    await verifyErrorMessage(page, /must be at least/i);
    await verifyCalculateButtonDisabled(page);
  });

  test('handles invalid input gracefully - zero consumption', async ({ page }) => {
    await fillCalculatorForm(page, 0, 0.35);
    
    await verifyCalculateButtonDisabled(page);
  });

  test('handles invalid input gracefully - zero price', async ({ page }) => {
    await fillCalculatorForm(page, 3500, 0);
    
    await verifyCalculateButtonDisabled(page);
  });

  test('calculates CO2 savings for green energy contract', async ({ page }) => {
    const consumption = 1000;
    const pricePerKwh = 0.35;
    
    await fillCalculatorForm(page, consumption, pricePerKwh);
    await selectContractType(page, 'Green');
    await clickCalculate(page);
    
    await verifyResultsVisible(page);
    
    const expectedCo2Savings = consumption * (co2Factors.gridMix - co2Factors.greenEnergy);
    const expectedCo2SavingsFormatted = formatGermanCurrency(expectedCo2Savings);
    
    await expect(page.getByTestId('co2-savings')).toContainText(expectedCo2SavingsFormatted);
  });

  test('calculates CO2 emissions for standard contract', async ({ page }) => {
    const consumption = 1000;
    const pricePerKwh = 0.35;
    
    await fillCalculatorForm(page, consumption, pricePerKwh);
    await selectContractType(page, 'Standard');
    await clickCalculate(page);
    
    await verifyResultsVisible(page);
    
    const expectedCo2Emissions = consumption * co2Factors.gridMix;
    const expectedCo2EmissionsFormatted = formatGermanCurrency(expectedCo2Emissions);
    
    await expect(page.getByTestId('co2-emissions')).toContainText(expectedCo2EmissionsFormatted);
  });

  test('handles maximum consumption values', async ({ page }) => {
    const { consumption, pricePerKwh, expectedAnnualCost } = germanHousehold.maxConsumption;
    
    await fillCalculatorForm(page, consumption, pricePerKwh);
    await clickCalculate(page);
    
    await verifyResultsVisible(page);
    
    const expectedAnnualCostFormatted = formatGermanCurrency(expectedAnnualCost);
    await expect(page.getByTestId('annual-cost')).toContainText(expectedAnnualCostFormatted);
  });

  test('contract type selection works correctly', async ({ page }) => {
    await fillCalculatorForm(page, 1000, 0.35);
    
    const contractTypes = ['Standard', 'Green', 'Industrial'];
    
    for (const contractType of contractTypes) {
      await selectContractType(page, contractType);
      await clickCalculate(page);
      await verifyResultsVisible(page);
      await page.reload();
    }
  });
});