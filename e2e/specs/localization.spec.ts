import { test, expect } from '@playwright/test';

test.describe('Localization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays German number formatting for currency', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('3500');
    await page.getByLabel('Price per kWh (EUR)').fill('0.35');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    await expect(page.getByTestId('annual-cost')).toContainText('1.225,00');
    await expect(page.getByTestId('monthly-cost')).toContainText('102,08');
  });

  test('displays German number formatting for large numbers', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('100000');
    await page.getByLabel('Price per kWh (EUR)').fill('0.25');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    await expect(page.getByTestId('annual-cost')).toContainText('25.000,00');
  });

  test('accepts German number input format', async ({ page }) => {
    await page.getByLabel('Price per kWh (EUR)').fill('0,35');
    await page.getByLabel('Annual Consumption (kWh)').fill('3500');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    await expect(page.getByTestId('annual-cost')).toContainText('1.225,00');
  });

  test('displays CO2 values with German formatting', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('1000');
    await page.getByLabel('Price per kWh (EUR)').fill('0.35');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    await expect(page.getByTestId('co2-emissions')).toContainText('400,00');
  });

  test('error messages are visible', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('-100');
    
    await expect(page.getByText(/must be at least/i)).toBeVisible();
  });

  test('form labels are clear and descriptive', async ({ page }) => {
    await expect(page.getByLabel('Annual Consumption (kWh)')).toBeVisible();
    await expect(page.getByLabel('Price per kWh (EUR)')).toBeVisible();
    await expect(page.getByLabel('Contract Type')).toBeVisible();
  });
});