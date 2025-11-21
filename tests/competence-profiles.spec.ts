import { test, expect } from '@playwright/test';
import { environment } from '../src/environments/environment';

/**
 * ========================================================
 * E2E - Competence Profile View
 * ========================================================
 * Purpose:
 * These tests verify that the competence profile pages for
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
const MODULE_COMPETENCE_PROFILES_ENDPOINT = environment.endpoints.contentProfiles.getModuleCompetenciesProfiles;
const PROGRAM_COMPETENCE_PROFILES_ENDPOINT = environment.endpoints.contentProfiles.getProgramContentCompetenciesProfiles;
const DEPARTMENT_COMPETENCE_PROFILES_ENDPOINT = environment.endpoints.contentProfiles.getDepartmentContentCompetenciesProfiles;
const BASE_URL = environment.baseUrl;

test.beforeEach(async ({ page }) => {
  await Promise.all([
    // Wait until content profile data has been fetched before starting.
    page.waitForResponse(r => r.url().includes(`${API_URL}${MODULE_COMPETENCE_PROFILES_ENDPOINT}`) && r.ok()),
    page.waitForResponse(r => r.url().includes(`${API_URL}${PROGRAM_COMPETENCE_PROFILES_ENDPOINT}`) && r.ok()),
    page.waitForResponse(r => r.url().includes(`${API_URL}${DEPARTMENT_COMPETENCE_PROFILES_ENDPOINT}`) && r.ok()),
    page.goto(`${BASE_URL}/#/home`),
  ]);
});

/**
 * Test Case 1 - Modul Competence Profile Render
 * ----------------------------------------------
 * Objective:
 * Verify that the competence profile page for the module
 * "Programming 1 with Java" opens correctly and renders a chart.
 *
 * Steps:
 * 1. Select the module node "Programming 1 with Java".
 * 2. Click “Kompetenzprofil anzeigen”.
 * 3. Verify correct navigation URL.
 * 4. Verify that module title text is visible.
 * 5. Verify that the pie chart is rendered (10th SVG path visible).
 * 6. Click “zurück” and verify return to Home.
 */

test('Modul competence profile', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Programming 1 with Java' }).click();
  await page.getByRole('button', { name: 'Kompetenzprofil anzeigen' }).click();
  await expect(page).toHaveURL(BASE_URL + '/#/competence-profile/BTI1001');
  await expect(page.getByText('Programming 1 with Java')).toBeVisible();
  await expect(page.locator('path:nth-child(10)')).toBeVisible();
  await page.getByRole('button', { name: 'zurück', exact: true  }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/home`);
});

/**
 * Test Case 2 - Department Competence Profile Render
 * --------------------------------------------------
 * Objective:
 * Verify that the competence profile page for the Department
 * "Technik und Informatik" opens correctly and renders a chart.
 *
 * Steps:
 * 1. Click the Department category in the legend.
 * 2. Select a department node "Technik und Informatik".
 * 3. Click "Kompetenzprofil anzeigen".
 * 4. Confirm that the pie chart is rendered (10th SVG path visible).
 * 5. Click "zurück" and confirm return to Home.
 */
test('Department competence profile', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Department'}).click();
  await page.locator('svg text', { hasText: 'Technik und Informatik'}).click();
  await page.getByRole('button', { name: 'Kompetenzprofil anzeigen' }).click();
  await expect(page).toHaveURL(BASE_URL + '/#/competence-profile/Technik%20und%20Informatik');
  await expect(page.getByText('Technik und Informatik')).toBeVisible();
  await expect(page.locator('path:nth-child(10)')).toBeVisible();
  await page.getByRole('button', { name: 'zurück', exact: true }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/home`);
});

/**
 * Test Case 3 - Program Competence Profile with Filter
 * ----------------------------------------------------
 * Objective:
 * Verify that the competence profile page for the module
 * "BSc Informatik" opens correctly, renders a chart
 * and that the Modultyp filter functions
 * correctly, including reset behavior.
 *
 * Steps:
 *  1. Click the Program category in the legend.
 *  2. Select a program node "BSc Informatik".
 *  3. Click "Kompetenzprofil anzeigen".
 *  4. Confirm that the pie chart is rendered (10th SVG path visible).
 *  5. Open the Modultyp dropdown.
 *  6. Verify all three options are listed
 *  7. Select "Pflichtmodul" and confirm the page updates.
 *  8. Click "zurücksetzen" to reset filters.
 *  9. Verify the main title is visible again
 *  10. Click "zurück" and confirm return to Home.
 *
 */
test('Program competence profile', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Studiengang'}).click();
  await page.locator('svg text', { hasText: 'BSc Informatik'}).click();
  await page.getByRole('button', { name: 'Kompetenzprofil anzeigen' }).click();
  await expect(page).toHaveURL(BASE_URL + '/#/competence-profile/BSc%20Informatik');
  await expect(page.getByText('BSc Informatik')).toBeVisible();
  await expect(page.locator('path:nth-child(10)')).toBeVisible();
  await page.getByRole('combobox', { name: 'Modultyp' }).click();
  await expect(page.getByRole('option')).toHaveCount(3);
  await expect(page.getByRole('option', { name: 'Wahlmodul (anrechenbar)', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Pflichtmodul', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Wahlpflichtmodul', exact: true })).toBeVisible();
  await page.getByRole('option', { name: 'Pflichtmodul', exact: true }).click();
  await expect(page.getByText('BSc Informatik')).toBeVisible();
  await expect(page.locator('path:nth-child(10)')).toBeVisible();
  await page.getByRole('button', { name: 'zurücksetzen' }).click();
  await expect(page.getByText('BSc Informatik')).toBeVisible();
  await page.getByRole('button', { name: 'zurück', exact: true  }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/home`);
});
