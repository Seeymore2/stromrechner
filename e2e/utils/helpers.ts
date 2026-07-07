import { Page, expect } from '@playwright/test';

export async function fillCalculatorForm(page: Page, consumption: number, pricePerKwh: number) {
  await page.getByLabel('Annual Consumption (kWh)').fill(consumption.toString());
  await page.getByLabel('Price per kWh (EUR)').fill(pricePerKwh.toString());
}

export async function selectContractType(page: Page, contractType: string) {
  await page.getByLabel('Contract Type').selectOption(contractType);
}

export async function clickCalculate(page: Page) {
  await page.getByRole('button', { name: /calculate/i }).click();
}

export async function verifyResultsVisible(page: Page) {
  await expect(page.getByTestId('results')).toBeVisible();
  await expect(page.getByTestId('annual-cost')).toBeVisible();
  await expect(page.getByTestId('monthly-cost')).toBeVisible();
  await expect(page.getByTestId('co2-emissions')).toBeVisible();
  await expect(page.getByTestId('co2-savings')).toBeVisible();
}

export async function verifyErrorMessage(page: Page, errorText: string) {
  await expect(page.getByText(errorText)).toBeVisible();
}

export async function verifyCalculateButtonDisabled(page: Page) {
  await expect(page.getByRole('button', { name: /calculate/i })).toBeDisabled();
}

export async function verifyCalculateButtonEnabled(page: Page) {
  await expect(page.getByRole('button', { name: /calculate/i })).toBeEnabled();
}

// Format number as German currency for comparison
export function formatGermanCurrency(amount: number): string {
  return amount.toFixed(2).replace('.', ',').replace(/(d)(?=(d{3})+(,d+)?$)/g, '$1.');
}