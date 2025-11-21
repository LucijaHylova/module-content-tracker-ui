import { test, expect } from '@playwright/test';
import { environment } from '../src/environments/environment';
const PASSED = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][stroke="#1af604"]';
const FAILED = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][stroke="#D50000"]';
const RETAKE_IN_PROGRESS = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][stroke="#188dca"]';
const IN_PROGRESS = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][stroke="#243ecf"]';

/**
 * ======================================================
 * E2E — Study Progress Management
 * ======================================================
 * Purpose:
 *   Validate the Study Progress Management feature, including:
 *   - module node selection
 *   - semester selection
 *   - module status changes
 *   - disabled/active UI states
 *   - accumulation of ECTS and user profile synchronization
 * Notes:
 * - In production, charts are rendered by ECharts using <canvas>.
 * - During testing, ECharts switches to SVG rendering to allow DOM-based element inspection.
 *
 * Scope:
 * - Frontend rendering only.
 * - Backend logic is tested separately.
 *
 */

const API_URL = environment.apiUrl;
const MODULES_ENDPOINT = environment.endpoints.modules.getAll;
const BASE_URL = environment.baseUrl;

test.beforeEach(async ({ page }) => {
  await Promise.all([
      await page.request.post(`${API_URL}/test/reset`),
      page.waitForResponse(r =>
        r.url().includes(`${API_URL}${ MODULES_ENDPOINT}`) && r.ok()
      ),
    page.goto(`${BASE_URL}/#/home`),
    await page.getByRole('button', { name: 'Einloggen' }).click(),
    await page.getByRole('textbox', { name: 'Username' }).fill('user1'),
    await page.getByText('Password').click(),
    await page.getByRole('textbox', { name: 'Password' }).fill('useruser'),
    await page.getByRole('button', { name: 'Einlogen' }).click(),
    await page.getByRole('button').filter({ hasText: /^$/ }).click(),
    await page.getByRole('menuitem', { name: 'Studienverlauf' }).click()
  ]);
});

/**
 * Test Case 1 — Initial Module Detail State
 * ------------------------------------------------------
 * Objective:
 *   Ensure a module detail view loads correctly:
 *   - Heading is shown
 *   - Semester selector is visible
 *   - Status selector is visible
 *
 * Steps:
 *   1) Click module "DevOps"
 *   2) Expect module heading
 *   3) Expect semester combobox
 *   4) Expect module status combobox
 */

test('Initial module detail state', async ({ page }) => {
  await page.getByText('DevOps', { exact: true  }).click({force: true});
  await expect(page.getByRole('heading', { name: 'DevOps' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Semester' })).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Modulstatus' })).toBeVisible();
});

/**
 * Test Case 2 — Status update & ECTS accumulation
 * ------------------------------------------------------
 * Objective:
 *   Validate updating a module status and ensure:
 *   - node state updates (progress, passed)
 *   - user profile updates accumulated passed ECTS
 *
 * Steps:
 *   1) Select DevOps module node and change semester to 5 and module status to "In Bearbeitung"
 *   2) Expect exactly one in progress node
 *   3) Select DevOps module node and change module status to "Bestanden"
 *   4) Select Databases module node and change module status to "Bestanden"
 *   5) Expect 2 passed modules
 *   6) Open user profile
 *   7) Expect 6 ECTS
 */
test('Status update and ECTS accumulation', async ({ page }) => {
  await expect(page.locator(IN_PROGRESS)).toHaveCount(0);

  await page.getByText('DevOps', { exact: true }).click({force: true});
  await expect(page.getByText('Semesters: 3,')).toBeVisible();

  await page.getByRole('combobox', { name: 'Semester', exact: true }).click({force: true});
  await page.getByRole('option', { name: '5' , exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus', exact: true }).click({force: true});
  await page.getByRole('option', { name: 'In Bearbeitung', exact: true }).click({force: true});
  await page.getByRole('button', { name: 'ändern' , exact: true }).click({force: true});
  await page.locator('.cdk-overlay-backdrop').click();

  await expect(page.locator(IN_PROGRESS)).toHaveCount(1);
  await expect(page.locator(PASSED)).toHaveCount(0);

  // await page.getByRole('button').filter({ hasText: /^$/ }).click({force: true});
  await expect(page.locator('app-menu button[aria-haspopup="menu"]')).toHaveCount(0);

  await page.getByRole('menuitem', { name: 'Benutzerprofil' }).click({force: true});
  await expect(page.getByText('Insgesamt bestandene ECTS: 0')).toBeVisible();

  await page.getByRole('button', { name: 'zurück', exact: true }).click({force: true});
  await page.getByText('DevOps', { exact: true  }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus', exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Bestanden', exact: true }).click({force: true});
  await page.getByRole('button', { name: 'ändern', exact: true }).click({force: true});
  await page.getByText('Databases', { exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus', exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Bestanden', exact: true }).click({force: true});
  await page.getByRole('button', { name: 'ändern', exact: true }).click({force: true});
  await expect(page.locator(PASSED)).toHaveCount(2);

  await page.getByRole('button').filter({ hasText: /^$/ }).click({force: true});
  await page.getByRole('menuitem', { name: 'Benutzerprofil', exact: true }).click({force: true});
  await expect(page.getByText('Insgesamt bestandene ECTS: 6')).toBeVisible();
});

/**
 * Test Case 3 — Retake / Failed flow
 * ------------------------------------------------------
 * Objective:
 *   Verify the flow for "Nicht bestanden" (failed) and retake:
 *   - Warning text appears after selecting failed
 *   - Choosing a retake semester sets status to "In Wiederholung"
 *   - User profile ECTS updates accordingly
 *   - Choosing "Modul nicht wiederholen" marks the module as permanently failed
 *
 * Steps:
 *   1) Select DevOps, set status to "Nicht bestanden" and confirm
 *   2) Expect warning text
 *   3) Select retake semester (e.g., 7) and expect retake indicator
 *   4) Check user profile ECTS
 *   5) Set "Nicht bestanden" again and confirm "Modul nicht wiederholen"
 *   6) Expect final failed indicator
 */
test('Retake / Failed flow', async ({ page }) => {
  await expect(page.locator(RETAKE_IN_PROGRESS)).toHaveCount(0);

  await page.getByText('DevOps', { exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus', exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Nicht bestanden', exact: true }).click({force: true});
  await page.getByRole('button', { name: 'ändern', exact: true }).click({force: true});
  await expect(page.getByText('Wenn Sie dieses Modul')).toBeVisible();

  await page.getByRole('combobox', { name: 'Semester' , exact: true }).click({force: true});
  await page.getByRole('option', { name: '7' , exact: true }).click({force: true});
  await expect(page.locator(RETAKE_IN_PROGRESS)).toHaveCount(1);

  await page.getByRole('button').filter({ hasText: /^$/ }).click({force: true});
  await page.getByRole('menuitem', { name: 'Benutzerprofil' }).click()
  await expect(page.getByText('Insgesamt bestandene ECTS: 4')).toBeVisible();
  await expect(page.locator(FAILED)).toHaveCount(0);

  await page.getByText('DevOps', { exact: true}).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus' , exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Nicht bestanden' , exact: true }).click({force: true});
  await page.getByRole('button', { name: 'ändern' , exact: true }).click({force: true});
  await page.getByRole('button', { name: 'Modul nicht wiederholen' , exact: true }).click({force: true});
  await expect(page.locator(FAILED)).toHaveCount(1);
  await expect(page.locator(RETAKE_IN_PROGRESS)).toHaveCount(0);
});

/**
 * Test Case 4 — Selector options logic disabled/enabled
 * ------------------------------------------------------
 * Objective:
 *   Validate that the semester selector is disabled or enabled according to
 *   the frontend rules for module state and available semesters.
 *
 * Rules (Frontend Behaviour):
 * - Semester must be disabled if:
 *        - the module has no semesters OR
 *        - the selected module status is one of: "Nicht bestanden", "In Wiederholung","Bestanden"
 */
test('Selector options logic', async ({ page }) => {

  await page.getByText('CFD mit OpenFoam', { exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus' , exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Nicht bestanden' , exact: true }).click({force: true});
  // await expect(page.locator('mat-form-field[class=disabled]')).toBeVisible();
  await expect(page.getByRole('combobox', { name: 'Semester' })).toBeHidden()


  await page.getByRole('combobox', { name: 'Modulstatus' }).fill('');
  await page.getByRole('combobox', { name: 'Modulstatus' , exact: true }).click({force: true});
  await page.getByRole('option', { name: 'Nicht bestanden' , exact: true }).click({force: true});
  await expect(page.getByRole('combobox', { name: 'Semester' })).toBeHidden()
  // await expect(page.locator('mat-form-field[class=disabled]')).toBeVisible();

  await page.getByRole('combobox', { name: 'Modulstatus' }).fill('');
  await page.getByRole('combobox', { name: 'Modulstatus' , exact: true }).click({force: true});
  await page.getByRole('option', { name: 'In Bearbeitung' , exact: true }).click({force: true});
  await expect(page.getByRole('combobox', { name: 'Semester' })).toBeVisible();
});

/**
 * Test Case 5 — Status option filtering logic
 * ------------------------------------------------------
 * Objective:
 *   Validate filtering rules for allowed module statuses based on the
 *   current userModule.status.
 *
 * Rules (Frontend):
 *   - Current status is always excluded from dropdown.
 *   - "In Wiederholung" excludes "In Bearbeitung"
 *   - "In Bearbeitung" excludes "In Wiederholung"
 */
test('Module status option filtering rules', async ({ page }) => {

  // First Module Status: "In Wiederholung"
  await page.getByText('DevOps', { exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Semester' , exact: true }).click({force: true});
  await page.getByRole('option', { name: '5' , exact: true }).click({force: true});
  await page.getByRole('button', { name: 'Modul nicht wiederholen' , exact: true }).click({force: true});
  await page.getByText('DevOps', { exact: true }).click({force: true});
  await page.getByRole('combobox', { name: 'Modulstatus' , exact: true }).click({force: true});
  await expect(page.getByText('In Wiederholung')).toBeHidden();
  await expect(page.getByText('In Bearbeitung')).toBeHidden();
  await expect(page.getByRole('option')).toHaveCount(3);

  // First Module Status: "Geplant"
  await page.locator('.cdk-overlay-backdrop').click();
  await page.getByText('IT-Controlling', { exact: true }).click({force: true});
  await expect(page.getByText('In Wiederholung')).toBeHidden();
  await expect(page.getByText('Geplant')).toBeHidden();
  await expect(page.getByRole('option')).toHaveCount(3);

});
