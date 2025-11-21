import { test, expect } from '@playwright/test';
import { environment } from '../src/environments/environment';

const MODULE_NODE = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][fill="#5470C6"]';
const PROGRAM_NODE = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][fill="#265943"]';
const DEPARTMENT_NODE = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][fill="#1c2740"]';
const RESPONSIBILITY_NODE = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][fill="#c63a3a"]';
const MODULE_TYPE_NODE = 'svg g path[d="M1 0A1 1 0 1 1 1 -0.0001"][fill="#bcb62f"]';

/**
 * ======================================================
 * E2E - Dashboard Filtering and Node Rendering
 * ======================================================
 * Purpose:
 * - Verify initial node counts, autocomplete, hierarchical selector behavior,
 *   legend toggles, and info panels for Modul, Program and Department.
 * - Verify interaction between legend toggles and selector filters in rendering graph nodes.
 * - Verify that that reset restores the dashboard to its initial state.
 *
 * Notes:
 * - In production, charts are rendered by ECharts using <canvas>.
 * - During testing, ECharts switches to SVG rendering to allow DOM-based element inspection.
 * - Node presence/counts are validated via SVG <path> elements.
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
    // Wait until module data has been fetched before starting.
    page.waitForResponse(r =>
      r.url().includes(`${API_URL}${ MODULES_ENDPOINT}`) && r.ok()
    ),
    page.goto(`${BASE_URL}/#/home`),
  ]);
});

/**
 * Test Case 1 - Dashboard initial state
 * ------------------------------------
 * Objective:
 * Ensure all module nodes render and the Modul selector lists all options.
 *
 * Steps:
 * 1) Expect 286 module nodes in the graph.
 * 2) Open Modul combobox and expect 286 options.
 */
  test('Dashboard initial state', async ({ page }) => {
    await expect(page.locator(MODULE_NODE)).toHaveCount(286);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(286);
  });

/**
 * Test Case 2 - Autocomplete filtering and module selection
 * -----------------------------------------------------
 * Objective:
 * Verify that the autocomplete function correctly filters and that selecting a module updates the graph diagram correctly.
 *
 * Steps:
 * 1) Type "web" in the Modul selector. Expect exactly 4 options with correct names.
 * 3) Select "Web and Distributed Systems Security" from these options.
 * 4) Verify that exactly this module node is rendered in the graph diagram.
 */
  test('Autocomplete', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Modul', exact: true }).fill('web');
    await expect(page.getByRole('option')).toHaveCount(4);
    await expect(page.getByRole('option', { name: 'Modern Web Technologies with .NET', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Web', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Web Programming', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Web and Distributed Systems Security', exact: true })).toBeVisible();
    await page.getByRole('option', { name: 'Web and Distributed Systems Security', exact: true }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(1);
    await expect(page.locator('svg text', { hasText: 'Web and Distributed Systems Security' })).toBeVisible();
  });

/**
 * Test Case 3 - Program filtering
 * --------------------------------
 * Objective:
 * Verify that selecting different programs filters the module nodes and selector options accordingly.
 *
 * Steps:
 * 1) Select "Wirtschaftsinformatik" program and expect 10 module nodes and Modul options.
 * 2) Switch to "Digital Business" program and expect 2 module nodes and Modul options with correct names.
 */

  test('Program filtering', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( {force: true});
    await page.getByRole('combobox', { name: 'Studiengang', exact: true  }).fill('Wirtschafts');
    await page.getByRole('option', { name: 'Wirtschaftsinformatik' }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(10);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(10);
    await page.getByRole('combobox', { name: 'Studiengang' }).click();
    await page.getByRole('combobox', { name: 'Studiengang' }).fill('busine');
    await page.getByRole('option', { name: 'Digital Business' }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(2);
    await expect(page.locator('svg text', { hasText: 'Geschäftsmodelle der'})).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Einführung in Digital Business'})).toBeVisible();
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Geschäftsmodelle der' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Einführung in Digital Business' })).toBeVisible();
  });

/**
 * Test Case 4 - Selector hierarchy behavior
 * ---------------------------------------
 * Objective:
 * Verify that selecting values across hierarchy levels (Department -> Program -> Modultyp -> Modul)
 * dynamically updates dependent selectors according to hierarchy levels.
 *
 * Steps:
 * 1) Select "Wahlpflichtmodul" in Modultyp. Expect all possible Departments, all possible Programs,
 *    and all Moduls that are of type "Wahlpflichtmodul".
 * 2) Select "Digital Business" Program. Expect all possible Departments
 *    and all Modultyps and Moduls belonging to the selected program.
 * 3) Select "Wirtschaft und Management" Department. Expect all Programs, Modultyps,
 *    and Moduls belonging to the selected department.
 * 4) Select "Wirtschaftsinformatik" Program. Expect all Moduls belonging to
 *    "Wirtschaft und Management" Department and to the selected program.
*/
  test('Selector hierarchy behavior', async ({ page }) => {
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await page.getByRole('option', { name: 'Wahlpflichtmodul', exact: true }).click();
    await page.getByRole('combobox', { name: 'Department', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( {force: true});
    await expect(page.getByRole('option')).toHaveCount(3);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(98);

    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( {force: true});
    await page.getByRole('option', { name: 'Digital Business' }).click();
    await page.getByRole('combobox', { name: 'Department' }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.getByRole('option', { name: 'Pflichtmodul' })).toBeVisible();
    await page.getByRole('combobox', { name: 'Modul' , exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Geschäftsmodelle der' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Einführung in Digital Business' })).toBeVisible();

    await page.getByRole('combobox', { name: 'Department', exact: true }).click();
    await page.getByRole('option', { name: 'Wirtschaft und Management ', exact: true }).click();
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( { force: true});
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Digital Business', exact: true  })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Wirtschaftsinformatik', exact: true  })).toBeVisible();
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(12);

    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( { force: true});
    await page.getByRole('option', { name: 'Wirtschaftsinformatik', exact: true }).click();
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(10);
  });

/**
 * Test Case 5 - Legend, selectors, and reset interplay
 * ------------------------------------------------------
 * Objective:
 * Verify that the interaction between legend toggles and selector filters in rendering graph nodes:
 * - Legend toggles ONLY control visibility of node types according to the current selector filters state.
 * - Selector filters ONLY control which module nodes are rendered (when the Modul legend is active) and dynamically update dependent selectors.
 * - The Modul legend is active by default and after navigating back or resetting filters.
 * Verify that that reset restores the dashboard to its initial state.
 *
 * Steps:
 * 1) Select Program "Digital Business".
 * 2) Toggle Department legend. Verify that all Department nodes belong to the selected Program,
 *     while all possible Department options remain in the selector (count and names verified).
 * 3) Toggle Program legend. Verify that the rendered Program node matches the selected Program (count and names verified).
 * 4) Toggle Modultyp legend. Verify that all Modultyp nodes and Modultyp options belong to the selected Program (count and names verified).
 * 5) Toggle Responsibility legend. Verify that all Responsibility nodes belong to the selected Program (count and names verified).
 * 6) Toggle Modul legend (initially active). Verify that no Modul nodes are rendered and all Modul options
 *    belong to the selected Program (count and names verified).
 * 7) Select Program "BSc Informatik". Verify that all Modul nodes and Modul options belong the selected Program (count verified).
 * 8) Toggle Department legend. Verify that all Department nodes belong to the selected Program,
 *    while all possible Departments options remain in the selector (count and names verified).
 * 9) Toggle Modultyp legend. Verify that all Modultyp nodes and Modultyp options belong to the selected Program.
 *    Select Modultyp "Pflichtmodul".
 *    Verify that all Modul nodes and Modul options match the selected Modultyp and belong to the selected Program (count and partial names verified).
 * 10) Select Department "Technik und Informatik". Verify that all Modul nodes and Modul options belong to the selected Department (count verified).
 * 11) Toggle Program legend. Verify that all Program nodes and Program options belong to the selected Department.
 *     Select Program "BSc Informatik".
 *     Verify that all Modul nodes and Modul options belong to the selected Department and Program (count and partial names verified).
 * 12) Toggle Modultyp legend. Verify that all Modultyp nodes and Modultyp options belong to the selected Department and Program (count and names verified).
 * 13) Select Modultyp "Wahlpflichtmodul". Verify that all Modul nodes and Modul options belong to the selected Department, Program and Modultyp. (count verified)
 * 14) Toggle Responsibility, Department, and Program legends. Verify that each type of nodes belong to
 *     the selected Department, Program and Modultyp. (count and partial names verified)
 * 15) Click "zurücksetzen". Verify that selectors and nodes are restored to the dashboard’s initial state. (count verified)
 */
  test('Legend, selectors, and reset interplay', async ({ page }) => {
    // Step 1
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click({force: true});
    await page.getByRole('option', { name: 'Digital Business' }).click();

    //Step 2
    await page.locator('svg text', { hasText: 'Department'}).click();
    await expect(page.locator(DEPARTMENT_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: 'Wirtschaft und Management'})).toBeVisible();
    await page.getByRole('combobox', { name: 'Department' }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Wirtschaft und Man' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Technik und Infor' })).toBeVisible();

    // Step 3
    await page.locator('svg text', { hasText: 'Studiengang' }).click({ force: true});
    await expect(page.locator(PROGRAM_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: /^Digital Business$/, },)).toBeVisible();

    // Step 4
    await page.locator('svg text', { hasText: 'Modultyp'}).click();
    await expect(page.locator(MODULE_TYPE_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: 'Pflichtmodul'})).toBeVisible();
    await page.getByRole('combobox', { name: 'Modultyp', exact: true }).click( {force: true});
    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.getByRole('option', { name: 'Pflichtmodul' })).toBeVisible();

    // Step 5
    await page.locator('svg text', { hasText: 'Verantwortung'}).click();
    await expect(page.locator(RESPONSIBILITY_NODE)).toHaveCount(2);
    await expect(page.locator('svg text', { hasText: 'Lucia'})).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Marek'})).toBeVisible();

    // Step 6
    await page.locator('svg text', { hasText: 'Modul' }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(0)
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Einführung in Digital' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Geschäftsmodelle der' })).toBeVisible();

    // Step 7
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( { force: true});
    await page.getByRole('combobox', { name: 'Studiengang' }).fill('');
    await page.getByRole('option', { name: 'BSc Informatik' }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(274);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(274);

    // Step 8
    await page.locator('svg text', { hasText: 'Department' }).click();
    await expect(page.locator(DEPARTMENT_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: 'Technik und Informatik'})).toBeVisible();
    await page.getByRole('combobox', { name: 'Department', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await expect(page.getByRole('option', { name: 'Technik und Informatik' })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Wirtschaft und Management' })).toBeVisible();

    // Step 9
    await page.locator('svg text', { hasText: 'Modultyp'}).click();
    await expect(page.locator(MODULE_TYPE_NODE)).toHaveCount(3)
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await expect(page.getByRole('option')).toHaveCount(3);
    await page.getByRole('option', { name: 'Pflichtmodul', exact: true }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(65);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(65);
    await expect(page.getByRole('option', { name: 'Advanced C++' })).toBeHidden();
    await expect(page.getByRole('option', { name: 'Navigation Systems' })).toBeHidden();
    await expect(page.getByRole('option', { name: 'JavaScript Frameworks' })).toBeHidden();
    await expect(page.getByRole('option', { name: 'Spezialfragen Gestaltung: Photographie' })).toBeHidden();
    await expect(page.getByRole('option', { name: 'Vektoranalysis' })).toBeHidden();

    // Step 10
    await page.getByRole('combobox', { name: 'Department', exact: true }).click();
    await page.getByRole('combobox', { name: 'Department', exact: true  }).fill('tech');
    await page.getByRole('option', { name: 'Technik und Informatik', exact: true }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(274);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(274);

    // Step 11
    await page.locator('svg text', { hasText: 'Studiengang' }).click();
    await expect(page.locator(PROGRAM_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: 'BSc Informatik'})).toBeVisible();
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( { force: true});
    await expect(page.getByRole('option')).toHaveCount(1);
    await expect(page.getByRole('option', { name: 'BSc Informatik' })).toBeVisible();
    await page.getByRole('option', { name: 'BSc Informatik', exact: true }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(274);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(274);

    // Step 12
    await page.locator('svg text', { hasText: 'Modul' }).click();
    await page.locator('svg text', { hasText: 'Modultyp' }).click();
    await expect(page.locator(MODULE_TYPE_NODE)).toHaveCount(3)
    await expect(page.locator('svg text', { hasText: 'Wahlmodul (anrechenbar)'})).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Pflichtmodul' })).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Wahlpflichtmodul' })).toBeVisible();
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await expect(page.getByRole('option')).toHaveCount(3);
    await expect(page.getByRole('option', { name: 'Wahlmodul (anrechenbar)', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Pflichtmodul', exact: true })).toBeVisible();
    await expect(page.getByRole('option', { name: 'Wahlpflichtmodul', exact: true })).toBeVisible();

    // Step 13
    await page.getByRole('option', { name: 'Wahlpflichtmodul', exact: true }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(94);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(94);

    // Step 14
    await page.locator('svg text', { hasText: 'Verantwortung' }).click();
    await expect(page.locator(RESPONSIBILITY_NODE)).toHaveCount(75)
    await expect(page.locator('svg text', { hasText: 'Michael Röthlin ( rlm1 )'})).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Jürgen Eckerle ( erj1 )'})).toBeVisible();
    await expect(page.locator('svg text', { hasText: 'Lucia'})).toBeHidden();
    await expect(page.locator('svg text', { hasText: 'Marek'})).toBeHidden();
    await page.locator('svg text', { hasText: 'Department' }).click();
    await expect(page.locator(DEPARTMENT_NODE)).toHaveCount(1)
    await expect(page.locator('svg text', { hasText: 'Technik und Informatik'})).toBeVisible();
    await page.locator('svg text', { hasText: 'Studiengang' }).click();
    await expect(page.locator('svg text', { hasText: 'BSc Informatik'})).toBeVisible();
    await expect(page.locator(PROGRAM_NODE)).toHaveCount(1)

    // Step 15
    await page.getByRole('button', { name: 'zurücksetzen' }).click();
    await expect(page.locator(MODULE_NODE)).toHaveCount(286);
    await page.getByRole('combobox', { name: 'Modul', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(286);
    await page.locator('svg text', { hasText: 'Department' }).click();
    await expect(page.locator(DEPARTMENT_NODE)).toHaveCount(2)
    await page.getByRole('combobox', { name: 'Department', exact: true }).click();
    await expect(page.getByRole('option')).toHaveCount(2);
    await page.locator('svg text', { hasText: 'Studiengang'}).click();
    await expect(page.locator(PROGRAM_NODE)).toHaveCount(3)
    await page.getByRole('combobox', { name: 'Studiengang', exact: true }).click( { force: true});
    await expect(page.getByRole('option')).toHaveCount(3);
    await page.locator('svg text', { hasText: 'Modultyp' }).click();
    await expect(page.locator(MODULE_TYPE_NODE)).toHaveCount(3)
    await page.getByRole('combobox', { name: 'Modultyp' }).click();
    await expect(page.getByRole('option')).toHaveCount(3);
    await page.locator('svg text', { hasText: 'Responsibility' }).click();
    await expect(page.locator(RESPONSIBILITY_NODE)).toHaveCount(215)
  });

/**
 * Test Case 6 - Modul node info panel
 * ----------------------------------
 * Objective:
 * Verify that the module info panel shows correct data and navigation actions.
 *
 * Steps:
 * 1) Click the "JavaScript Frameworks" module node.
 * 2) Verify that the info panel is displayed with the correct title, code, department, and program.
 * 3) Verify that action buttons "Kompetenzprofil anzeigen" and "Inhaltsprofil anzeigen" are visible.
 * 4) Click "Inhaltsprofil anzeigen" and verify navigation to the corresponding content profile page.
 */
test('Modul node info panel', async ({ page }) => {
  await page.locator('svg text', { hasText: 'JavaScript Frameworks' }).click();
  await expect(page.getByRole('heading', { name: 'JavaScript Frameworks' })).toBeVisible();
  await expect(page.getByText('Code: BTI2031')).toBeVisible();
  await expect(page.getByText('Department: Technik und Informatik' )).toBeVisible();
  await expect(page.getByText('Studiengang: BSc Informatik' )).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kompetenzprofil anzeigen' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Inhaltsprofil anzeigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Inhaltsprofil anzeigen' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/content-profile/BTI2031`);
});

/**
 * Test Case 7 - Program node info panel
 * ----------------------------------
 * Objective:
 * Verify that the program info panel shows correct data and navigation actions.
 *
 * Steps:
 * 1) Click the "Digital Business" program node.
 * 2) Verify that the info panel is displayed with the correct title and program.
 * 3) Verify that action buttons "Kompetenzprofil anzeigen" and "Inhaltsprofil anzeigen" are visible.
 * 4) Click "Kompetenz anzeigen" and verify navigation to the corresponding content profile page.
 */
test('Program info panel', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Studiengang' }).click();
  await page.locator('svg text', { hasText: /^Digital Business$/ }).click();
  await expect(page.getByRole('heading', { name: 'Studiengang: Digital Business' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kompetenzprofil anzeigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Kompetenzprofil anzeigen' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/competence-profile/Digital%20Business`);
});

/**
 * Test Case 8 - Department node info panel
 * ----------------------------------
 * Objective:
 * Verify that the department info panel shows metadata and navigation actions.
 *
 * Steps:
 * 1) Click the "Wirtschaft und Management" department node.
 * 2) Verify that the info panel is displayed with the correct title and department.
 * 3) Verify that action buttons "Kompetenzprofil anzeigen" and "Inhaltsprofil anzeigen" are visible.
 * 4) Click "Kompetenzprofil anzeigen" and verify navigation to the corresponding content profile page.
 */
test('Department info panel', async ({ page }) => {
  await page.locator('svg text', { hasText: 'Department' }).click();
  await page.locator('svg text', { hasText: 'Wirtschaft und Management' }).click();
  await expect(page.getByRole('heading', { name: 'Department: Wirtschaft und Management' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Kompetenzprofil anzeigen' })).toBeVisible();
  await page.getByRole('button', { name: 'Kompetenzprofil anzeigen' }).click();
  await expect(page).toHaveURL(`${BASE_URL}/#/competence-profile/Wirtschaft%20und%20Management`);
});

/**
 * Test Case 9 - Similarity search rendering
 * -----------------------------------------
 * Objective:
 * Verify that the similarity search dynamically filters the graph modules
 * according to the entered search keywords, verifies its interplay with selector filtersand resets when the input is cleared.
 *
 * Steps:
 * 1) Verify that 286 module nodes are initially rendered.
 * 2) Enter keyword "business" and click "Suchen". Expect exactly 10 module nodes in the graph.
 * 3)  Select Program "Digital Business". Expect 2 module nodes belonging to that program.
 * 4) Enter keyword "machine learning" and expect 10 module nodes.
 * 5) Enter keyword "garten" and verify that a "no results" message is displayed.
 * 6) Clear the input field and verify that all 286 module nodes are rendered again (reset state).
 */
test('Similarity search rendering', async ({ page }) => {
  await expect(page.locator(MODULE_NODE)).toHaveCount(286);
  await page.getByRole('textbox', { name: 'Modul Stichwortsuche...' }).fill('business');
  await page.getByRole('button', { name: 'Suchen' }).click();
  await expect(page.locator(MODULE_NODE)).toHaveCount(10);
  await page.getByRole('option', { name: 'Digital Business', exact: true }).click( { force: true } );
  await expect(page.locator(MODULE_NODE)).toHaveCount(2);
  await page.getByRole('textbox', { name: 'Modul Stichwortsuche...' }).fill('machine learning');
  await expect(page.locator(MODULE_NODE)).toHaveCount(10);
  await page.getByRole('textbox', { name: 'Modul Stichwortsuche...' }).fill('garten');
  await expect(page.getByText('Keine Module gefunden. Bitte passen Sie Ihre Suchkriterien an.')).toBeVisible()
  await page.getByText('Modul Stichwortsuche...').fill('');
  await expect(page.locator(MODULE_NODE)).toHaveCount(286);
});



