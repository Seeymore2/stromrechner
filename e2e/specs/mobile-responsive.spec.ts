import { test, expect, devices } from '@playwright/test';

test.use(devices['Pixel 5']);

test.describe('Mobile Responsiveness - Pixel 5', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all inputs are visible on mobile', async ({ page }) => {
    await expect(page.getByLabel('Annual Consumption (kWh)')).toBeVisible();
    await expect(page.getByLabel('Price per kWh (EUR)')).toBeVisible();
    await expect(page.getByLabel('Contract Type')).toBeVisible();
    await expect(page.getByRole('button', { name: /calculate/i })).toBeVisible();
  });

  test('calculator buttons are large enough for touch', async ({ page }) => {
    const calculateButton = page.getByRole('button', { name: /calculate/i });
    
    const box = await calculateButton.boundingBox();
    expect(box?.width).toBeGreaterThan(44);
    expect(box?.height).toBeGreaterThan(44);
  });

  test('form inputs are usable on touch devices', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('3500');
    await page.getByLabel('Price per kWh (EUR)').fill('0.35');
    
    expect(await page.getByLabel('Annual Consumption (kWh)').inputValue()).toBe('3500');
    expect(await page.getByLabel('Price per kWh (EUR)').inputValue()).toBe('0.35');
  });

  test('results are readable without zooming', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('3500');
    await page.getByLabel('Price per kWh (EUR)').fill('0.35');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    const results = page.getByTestId('results');
    await expect(results).toBeVisible();
    
    const annualCost = page.getByTestId('annual-cost');
    await expect(annualCost).toBeVisible();
    
    const fontSize = await annualCost.evaluate((el) => {
      return parseFloat(window.getComputedStyle(el).fontSize);
    });
    expect(fontSize).toBeGreaterThanOrEqual(14);
  });

  test('contract type dropdown is usable on mobile', async ({ page }) => {
    await page.getByLabel('Contract Type').click();
    
    await expect(page.getByRole('option', { name: 'Standard' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Green' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Industrial' })).toBeVisible();
    
    await page.getByRole('option', { name: 'Green' }).click();
    
    expect(await page.getByLabel('Contract Type').inputValue()).toBe('Green');
  });
});

test.use(devices['iPhone 12']);

test.describe('Mobile Responsiveness - iPhone 12', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('all inputs are visible on iPhone', async ({ page }) => {
    await expect(page.getByLabel('Annual Consumption (kWh)')).toBeVisible();
    await expect(page.getByLabel('Price per kWh (EUR)')).toBeVisible();
    await expect(page.getByLabel('Contract Type')).toBeVisible();
    await expect(page.getByRole('button', { name: /calculate/i })).toBeVisible();
  });

  test('complete calculation flow on iPhone', async ({ page }) => {
    await page.getByLabel('Annual Consumption (kWh)').fill('3500');
    await page.getByLabel('Price per kWh (EUR)').fill('0.35');
    await page.getByRole('button', { name: /calculate/i }).click();
    
    await expect(page.getByTestId('results')).toBeVisible();
    await expect(page.getByTestId('annual-cost')).toContainText('1.225,00');
  });
});