import { checkValidUrlForLoginScreen, getUniqueNamesInTableRows, searchFor } from './test-utils';
import { expect, test } from '@playwright/test';

import { DiscoveredObjectsPage } from './pages/DiscoveredObjectsPage';
import { FeaturePackData } from './feature-pack-test.model';
import { FeaturePackDetailsPage } from './pages/FeaturePackDetailsPage';
import { FeaturePackPage } from './pages/FeaturePackPage';
import { JobsPage } from './pages/JobsPage';
import { LoginPage } from './pages/LoginPage';
import { featurePack1ZipFilePath } from 'tests/playwright.config';

function getFpData(): FeaturePackData {
  return {
    name: getUniqueName(),
    application: 'application_1',
    job: 'job_1'
  };
}

function getUniqueName() {
  return 'test_' + Math.round(Math.random() * 10000000000000);
  ;
}

test('Full end to end test - reconcile All @proxy', async ({ page }) => {
  if (checkValidUrlForLoginScreen()) {
    page = await new LoginPage(page).loginToProxy();
    await reconcileAllTest(page);
  }
});

test('Full end to end test - reconcile All @e2e', async ({ page }) => {
  if (checkValidUrlForLoginScreen()) {
    page = await new LoginPage(page).login();
    await reconcileAllTest(page);
  }
}
);

test('Full end to end test - reconcile All @docker-tests', async ({ page }) => {
  page.goto('/dr-ui/feature-packs');
  await reconcileAllTest(page);
});

test('Full end to end test - reconcile row @docker-tests', async ({ page }) => {
  // GIVEN
  const fpData = getFpData();
  const jobName = getUniqueName();

  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  const jobsPage = new JobsPage(page);

  const discoveredObjectsPage = new DiscoveredObjectsPage(page);

  // WHEN
  await jobsPage.gotoJobsPageViaMenu();
  await jobsPage.createJob(jobName, fpData);

  // THEN
  await discoveredObjectsPage.refreshPage();

  await _expectDiscoveredPillToBeVisible(page);

  await discoveredObjectsPage.clickReconcile();
  await discoveredObjectsPage.refreshPage();

  await discoveredObjectsPage.refreshPage();

  await _expectReconciledPillToBeVisible(page);

  await _removeCreatedData(jobsPage, jobName, featurePackPage, fpData.name);

  // If no feature packs exist, will show no feature pack available.
  // Otherwise continue.
  const timeout = 5000; // 5 seconds timeout
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await page.locator('id=empty-table-msg-id')) {
      return;
    }
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Other feature packs exist, search for uninstalled one to make sure it doesn't exist.
  await searchFor(page, fpData.name);
  await expect(page.getByRole('cell', { name: fpData.name })).not.toBeVisible();
});

test('Create job from Feature Pack table @docker-tests', async ({ page }) => {
  // GIVEN
  const fpData = getFpData();
  const jobName = getUniqueName();

  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  await page.getByRole('table').locator('div').filter({ hasText: `${fpData.name} ${fpData.name}` }).click();

  await page.getByText('Applications').click();
  await page.locator('#dnr-application-information-details').getByRole('emphasis').click();

  const jobsPage = new JobsPage(page);

  const discoveredObjectsPage = new DiscoveredObjectsPage(page);

  // WHEN
  await jobsPage.createJobViaFeaturePagePage(jobName, fpData);

  // THEN
  await discoveredObjectsPage.refreshPage();
  await _expectDiscoveredPillToBeVisible(page);

  await _removeCreatedData(jobsPage, jobName, featurePackPage, fpData.name);
});

test('Create job from Feature Pack Details page @docker-tests', async ({ page }) => {
  // GIVEN
  const fpData = getFpData();
  const jobName = getUniqueName();

  // WHEN
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  await featurePackPage.linkAwayToFeaturePackDetailsPage(fpData.name);

  const featurePackDetailsPage = new FeaturePackDetailsPage(page);
  await featurePackDetailsPage.clickApplicationCard(fpData.application);

  const jobsPage = new JobsPage(page);
  await jobsPage.createJobViaFeaturePagePage(jobName, fpData);

  // THEN
  const discoveredObjectsPage = new DiscoveredObjectsPage(page);
  await discoveredObjectsPage.refreshPage();
  await _expectDiscoveredPillToBeVisible(page);

  // back to feature pack details page via navigation tab
  await page.getByRole('tab', { name: fpData.name }).first().click();
  await featurePackDetailsPage.checkJobDetailsPanel(fpData.application, fpData.job);

  await _removeCreatedData(jobsPage, jobName, featurePackPage, fpData.name);
});

test('Duplicate job from Jobs page @docker-tests', async ({ page }) => {

  // GIVEN
  const fpData = getFpData();
  fpData.name = fpData.name + '_forDup';
  const jobName = getUniqueName() + '_forDup';

  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  const jobsPage = new JobsPage(page);

  await jobsPage.gotoJobsPageViaMenu();
  await jobsPage.createJob(jobName, fpData);  // brings us to discovery page
  await jobsPage.navigateFromDetailsPageToJobsPage();

  // WHEN
  await jobsPage.duplicateJob(jobName);

  // THEN
  await expect(getUniqueNamesInTableRows(jobsPage.page, jobName, 3)).resolves.toHaveLength(2);

  await _removeCreatedData(jobsPage, jobName, featurePackPage, fpData.name, true);
});

async function reconcileAllTest(page) {

  // GIVEN
  const fpData = getFpData();
  const jobName = getUniqueName();

  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  const jobsPage = new JobsPage(page);

  const discoveredObjectsPage = new DiscoveredObjectsPage(page);

  // WHEN
  await jobsPage.gotoJobsPageViaMenu();
  await jobsPage.createJob(jobName, fpData);

  // THEN
  await discoveredObjectsPage.refreshPage();
  await _expectDiscoveredPillToBeVisible(page);

  // Reconcile
  await discoveredObjectsPage.clickReconcileAll();
  await discoveredObjectsPage.refreshPage();

  await _expectReconciledPillToBeVisible(page);

  await _removeCreatedData(jobsPage, jobName, featurePackPage, fpData.name);

  // If no feature packs exist, will show no feature pack available.
  // Otherwise continue.
  const timeout = 5000; // 5 seconds timeout
  const startTime = Date.now();
  while (Date.now() - startTime < timeout) {
    if (await page.getByText("No feature packs available")) {
      return;
    }
    // Wait for 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Other feature packs exist, search for uninstalled one to make sure it doesn't exist.
  await searchFor(page, fpData.name);
  await expect(page.getByRole('cell', { name: fpData.name })).not.toBeVisible();
}

async function _expectDiscoveredPillToBeVisible(page){
  const discoverPill_I18n = page.getByRole('table').locator('div').filter({ hasText: 'Discovered Discovered' });
  const discoverPill = page.getByRole('table').locator('div').filter({ hasText: 'state.DISCOVERED state.' });
  await expect(discoverPill_I18n.or(discoverPill).first()).toBeVisible();
}

async function _expectReconciledPillToBeVisible(page){
  const resolvedPill_I18n = page.getByRole('table').locator('div').filter({ hasText: 'Reconciled Reconciled' });
  const resolvedPill = page.getByRole('table').locator('div').filter({ hasText: 'state.RECONCILED state.' });
  await expect(resolvedPill_I18n.or(resolvedPill).first()).toBeVisible();
}

// housekeeping
async function _removeCreatedData(jobsPage: JobsPage, jobName: string,
  featurePackPage: FeaturePackPage, fpName: string, isDuplicateJobTest = false) {

  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.uninstall(fpName);

  await jobsPage.gotoJobsPageViaMenu();
  if (isDuplicateJobTest) {
    await jobsPage.deleteAllDuplicateJobs(jobName);
  } else {
    await jobsPage.deleteJob(jobName);
  }
}


/**
 * Utility to clean up previous job table test data
 * @see package.json  'npm run clean' (all tables)
 *                    'npm run clean-job' (just jobs table)
*/
test('Clean data utility @clean-data @clean-job', async ({ page }) => {

  // GIVEN
  const jobsPage = new JobsPage(page);
  await jobsPage.gotoJobsPage();

  // WHEN
  /**
   * If too many jobs, easiest to remove in postman with the delete call APIs
   * DELETE http://dr.docker.localhost/discovery-and-reconciliation/v1/jobs?filters=name==*test*
   * DELETE http://dr.docker.localhost/discovery-and-reconciliation/v1/jobs?filters=jobScheduleId==73
   */
  await jobsPage.deleteAllTestJobs("test");

  // THEN
  await expect.soft(getUniqueNamesInTableRows(jobsPage.page, jobsPage.testNamePrefix, 3)).resolves.toHaveLength(0);
});
