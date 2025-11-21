import { test, expect } from '@playwright/test';
import { environment } from '../src/environments/environment';

/**
 * ======================================================
 * E2E - Modul Content Profile View
 * ======================================================
 * Purpose:
 * These tests verify that the content profile pages for
 * Moduls, Departments, and Programs correctly render their
 * visual pie chart components.
 *
 * Notes:
 * - In production, charts are rendered by ECharts using <canvas>.
 * - During testing, ECharts switches to SVG rendering to allow DOM-based element inspection.
 * - Rendering is confirmed by checking the presence of the 10th
 *   <path> element in the generated SVG.
 *
 * Scope:
 * - Frontend rendering only.
 * - No validation of AI-generated data (non-deterministic).
 * - Backend logic is tested separately.
 *
 */

const API_URL = environment.apiUrl;
const MODULE_CONTENT_PROFILES_ENDPOINT = environment.endpoints.contentProfiles.getModuleContentProfiles;
const BASE_URL = environment.baseUrl;

test.beforeEach(async ({ page }) => {
  await Promise.all([
    // Wait until content profile data has been fetched before starting.
    page.waitForResponse(r =>
      r.url().includes(`${API_URL}${MODULE_CONTENT_PROFILES_ENDPOINT}`) && r.ok()
    ),
    page.goto(`${BASE_URL}/#/home`),
  ]);
});

/**
 * Test Case 1 - Modul Content Profile Render
 * ----------------------------------------------
 * Objective:
 * Verify that the content profile page for the module
 * "Advanced C++" opens correctly and renders a chart.
 *
 * Steps:
 * 1. Select the module node "Advanced C++".
 * 2. Click “Inhaltsprofil anzeigen”.
 * 3. Verify correct navigation URL.
 * 4. Verify that module title text is visible.
 * 5. Verify that the pie chart is rendered (10th SVG path visible).
 * 6. Click "zurück" and verify return to Home.
 */

test('Modul content profile', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Advanced C++' }).click();
  await page.getByRole('button', { name: 'Inhaltsprofil anzeigen' }).click();
  await expect(page).toHaveURL(BASE_URL + '/#/content-profile/BTI2022');
  await expect(page.getByText('Advanced C++')).toBeVisible();
  await expect(page.locator('path:nth-child(10)')).toBeVisible();
  await page.getByRole('button', { name: 'zurück' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/home`);
});
