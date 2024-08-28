import { expect, test } from '@playwright/test';
import { featurePack1ZipFilePath, featurePack2ZipFilePath } from 'tests/playwright.config';
import { getUniqueNamesInTableRows, searchFor } from './test-utils';

import { FeaturePackPage } from './pages/FeaturePackPage';

function getUniqueName() {
  return 'test_' + Math.round(Math.random() * 10000000000000);
}

test('Install Feature Pack @docker-tests', async ({ page }) => {
  // GIVEN
  const fpName = getUniqueName();
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();

  // WHEN
  await featurePackPage.upload(fpName, featurePack1ZipFilePath);
  await searchFor(page, fpName);

  // THEN
  await expect.soft(page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
  await expect(page.getByRole('cell', { name: fpName })).toBeVisible();

  await featurePackPage.uninstall(fpName);
});

test('Update Feature Pack @docker-tests', async ({ page }) => {
  // GIVEN
  const fpName = getUniqueName();
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpName, featurePack1ZipFilePath);

  // WHEN
  const description = "desc_" + Math.round(Math.random() * 10000000000000);
  await featurePackPage.update(fpName, description, featurePack2ZipFilePath);
  await searchFor(page, fpName);

  // THEN
  await expect(page.getByRole('cell', { name: fpName })).toBeVisible();
  await expect(page.getByRole('table').locator('div').filter({ hasText: description }).first()).toBeVisible();

  await featurePackPage.uninstall(fpName);
});

test('Uninstall Feature Pack @docker-tests', async ({ page }) => {
  // GIVEN
  const fpName = getUniqueName();
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpName, featurePack1ZipFilePath);

  // WHEN
  await featurePackPage.uninstall(fpName);

  // THEN
  await expect(page.getByRole('cell', { name: fpName })).not.toBeVisible();
});


/**
 * Utility to clean up previous test data
 * @see package.json  'npm run clean'
 *                    'npm run clean-fp' (just jobs table)
*/
test('Feature pack page clean data utility @clean-data @clean-fp', async ({ page }) => {

  // GIVEN
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();

  // WHEN
   /**
   * If many rows to clear one solution mostly works:
   * - add await page.pause() below and
   * - right click debug this test in IDE.
   * - open feature packs page manually and change row limit to max (e.g. 100 rows) before
   * - pressing continue in debugger - i.e. before code is entering #uninstallAllTestFeaturePacks.
   *
   * (if don't just want to remove test data - see FeaturePackPage testNamePrefix - change is to 'all')
   */
  //XXX await page.pause();
  await featurePackPage.uninstallAllTestFeaturePacks();

  // THEN
  await expect.soft(getUniqueNamesInTableRows(featurePackPage.page, featurePackPage.testNamePrefix)).resolves.toHaveLength(0);

});
