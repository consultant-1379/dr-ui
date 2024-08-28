import { Page } from "@playwright/test";
import { expect } from '@playwright/test';
import { getBaseUrl } from "tests/playwright.config";

/*
 * Click table row matching nameInRow
 * strict mode requires one return here so ideally only used with unique names)
 * @param nameInRow Full name in row to click, e.g. "test_1710149710009" or if not
 *                  will attempt to click the first row (assumed at row 0, e.g. if searched first)
 */
export async function clickRow(page: Page, nameInRow: string) {
  // strict mode requires one return here so need to pick the first in duplicate scenario
  const row = page.locator(`table tr:has-text("${nameInRow}")`).first();
  const hasSelectedAttribute = await row.evaluate((node) => node.hasAttribute('selected'));

  if (!hasSelectedAttribute) {
    await row.click();
  } else {
    console.log(`Row ${nameInRow} already selected - not clicking again!`);
  }
}

/**
 * Get unique names in table rows matching partialName
 *
 * @param page         e.g JobPage.page
 * @param partialName  part of display name in row we are looking for ("all" matches all rows)
 * @param nameColumnPosition position of "name" column (default 2),
 *                           but 3 if multi-select table with checkboxes
 * @returns  array of full names in table rows matching partialName
 */
export async function getUniqueNamesInTableRows(
  page: Page,
  partialName: string = "test_",
  nameColumnPosition: number = 2): Promise<string[]> {


  const emptyTableMessage = await page.$('.empty-text:visible');
  if (emptyTableMessage) {
    return [];
  }

  const htmlForNameCell = `td:nth-child(${nameColumnPosition})`
  const rows = await page.$$('table  tbody  tr');
  const resultArray: string[] = [];

  for (const row of rows) {
    const nameColumnCell = await row.$(htmlForNameCell);  // jobs table could have FP names

    if (nameColumnCell) {
      const nameValue = (await nameColumnCell.textContent()).trim();
      if (nameValue && (partialName === 'all' || nameValue.includes(partialName))) { // normally only remove test generated data
        resultArray.push(nameValue.trim());
      }
    }
  }
  return resultArray;
}

/**
 * Selected the desired option from the pulldown menu selector.
 *
 * @param page - current page.
 * @param selector - pulldown menu selector.
 * @param desiredOptionText - text of option to be selected.
 */
export async function selectOptionFromPullDown(page: Page, selector, desiredOptionText: string) {
  await page.locator(selector).click();

  const optionSelector = `mat-option:has-text(" ${desiredOptionText} ")`;
  await page.locator(optionSelector).scrollIntoViewIfNeeded();
  // Select the option by clicking on it
  await page.click(optionSelector);
}

/**
 * Search for the specified 'searchName' in the search box.
 *
 * @param page - current page.
 * @param searchName - name to search for.
 */
export async function searchFor(page: Page, searchName: string) {
  const searchField = page.locator('.entity-search-bar input');
  const searchFieldPresent = await searchField.count() !== 0;
  console.log(`test-utils.ts:#searchFor: SearchFieldPresent ${searchFieldPresent}`);

  if (searchFieldPresent) {
    await searchField.click();
    await searchField.fill(searchName);
    await searchField.press('Enter');

    console.log(`test-utils.ts:#searchFor: searchName ${searchName}`);
  }
}

export async function clearSearch(page: Page) {
  const searchField = page.locator('.entity-search-bar input');
  const searchFieldPresent = await searchField.count() !== 0;
  if (searchFieldPresent) {
    await searchField.click();
    await searchField.fill('');
    await searchField.press('Enter');
  }
}


/**
 * Click context button (when do not know if row is selected or not)
 *
 * i.e. Should be no need for await clickRow(page, searchName) if the UI
 * pre-select a row when find row from search look up (#searchFor call)
 * Clicking in that case would only unselect the row again (and loose the context button
 * we want to click on)
 */
export async function clickContextButton(page: Page, buttonId: string, searchName: string) {
  const contextButton = page.locator(`id=${buttonId}`);
  if (await contextButton.count() > 0) {
    await contextButton.click();
  } else {
    await clickRow(page, searchName);
    await page.locator(`id=${buttonId}`).click();
  }
}

/**
 * Include just for convenience that
 * "npx playwright test" command would not wait for login page
 * (rather the test would be skipped) when no login page is going to be available.
 */
export async function checkValidUrlForLoginScreen() {
  const baseUrl = getBaseUrl();
  if (!baseUrl || baseUrl.includes('dr.docker')) {
    console.log(`Skipping test: ${baseUrl} is not a valid baseURL to expect a login screen (check tests/playwright.config.ts)`)
    return false;
  }
  return true;
}

/**
 * Check if a row is in a table using expect.
 * We do NOT want the test to stop completing next steps if check fails.
 *
 * Not using expect.soft as that doesn't not take a screenshot.
 * So catch error, take screenshot, and keep going.
 *
 * EXPECT would do a #searchFor before calling this method such
 * that search is limited to current page in view
 *
 * @param tablePage  (not Page object), e.g. JobPage
 * @param rowName    name on row
 * @param nameColumnPosition position of name column (2 or 3 for multi-select when checkboxes)
 * @returns error if name not present.
 */
export async function checkIfNameInTableRow(tablePage: any, rowName: string, nameColumnPosition: number) {
  console.log(`test-utils.ts:#checkIfNameInTableRow: rowName: ${rowName}`);

  try {
    // workaround if search field filter is not called (never expect more than one page of data)
    const tablePageCount = await _tablePageCount(tablePage);
    if (tablePageCount > 1) {
      console.log("test-utils.ts:#checkIfNameInTableRow - more pages than 1 encountered! - resetting searchfield");
      await searchFor(tablePage.page, rowName);
    }

    // catch expect as even if error, we want to continue with clean up.
    await expect((await getUniqueNamesInTableRows(tablePage.page, rowName, nameColumnPosition)).length).toBeGreaterThan(0);
    return null;
  } catch (error) {
    console.log('test-utils.ts:#checkIfNameInTableRow: ERROR');
    return error;
  }
}

 async function _tablePageCount (tablePage: any) : Promise<number> {
  const pagination  = tablePage.page.locator('eui-pagination');
  const pagesCount: string | null =  await pagination.getAttribute('num-pages');
  return pagesCount ? Number.parseInt(pagesCount) : null;
}