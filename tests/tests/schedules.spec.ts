import { checkIfNameInTableRow, checkValidUrlForLoginScreen, getUniqueNamesInTableRows, searchFor } from './test-utils';
import { expect, test } from '@playwright/test';

import { FeaturePackData } from './feature-pack-test.model';
import { FeaturePackPage } from './pages/FeaturePackPage';
import { JobsPage } from './pages/JobsPage';
import { LoginPage } from './pages/LoginPage';
import { SchedulesPage } from './pages/SchedulesPage';
import { featurePack1ZipFilePath } from 'tests/playwright.config';

function getFpData(): FeaturePackData {
  return {
    name: getUniqueName(),
    application: 'application_1',
    job: 'job_1'
  };
}

function getScheduleUniqueName() {
  return 'schedule_' + Math.round(Math.random() * 10000000000000);
}

function getUniqueName() {
  return 'test_' + Math.round(Math.random() * 10000000000000);
}

test('Full end to end test - Create job schedule @e2e', async ({ page }) => {
  if (checkValidUrlForLoginScreen()) {
    page = await new LoginPage(page).login();
    await createJobSchedule(page);
  }
}
);

test('Create job schedule @docker-tests @schedule', async ({ page }) => {
  await createJobSchedule(page);
});

// TODO Temp removing @e2e - failed in firefox - row not clicked - no delete context button
test('Disable and Delete job schedule and its associated jobs', async ({ page }) => {
  if (checkValidUrlForLoginScreen()) {
    page = await new LoginPage(page).login();
    await disableEnableJobSchedule(page);
  }
});

test('Disable and Delete job schedule and its associated jobs @docker-tests @schedule', async ({ page }) => {
  await disableEnableJobSchedule(page);
});

async function disableEnableJobSchedule(page) {

  // GIVEN
  const schedulesPage = new SchedulesPage(page);
  const jobsPage = new JobsPage(page);
  const fpData = getFpData();
  const scheduleName = getScheduleUniqueName();
  const scheduledJobName = getUniqueName();

  // Install Feature Pack
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  // Create Schedule
  await schedulesPage.gotoSchedulesPageViaMenu();
  await schedulesPage.createSchedule(scheduleName, scheduledJobName, fpData);

  await jobsPage.gotoJobsPageViaMenu();
  // Wait for a longer time than job is schedule for, to guarantee job has been created.
  await page.waitForTimeout(20000);

  // Check job is on jobs page
  await searchFor(page, scheduledJobName);

  // THEN
  await page.locator(`table tr:has-text("${scheduledJobName}")`);

  let error = await checkIfNameInTableRow(jobsPage, scheduledJobName, 3);
  if (error) {
    await page.screenshot({ path: 'screenshots/disable-schedule-failure.png' });
  }

  await schedulesPage.gotoSchedulesPageViaMenu();

  await schedulesPage.toggleScheduleEnableSwitch(scheduleName);
  await schedulesPage.deleteScheduleAndAssociatedJobs(scheduleName);

  await jobsPage.gotoJobsPageViaMenu();

  // expect that all associated jobs are gone
  await expect((await getUniqueNamesInTableRows
    (jobsPage.page, scheduledJobName, 3)).length).toBe(0);

  // clean up Feature Pack
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.uninstall(fpData.name);

  if (error) {
    throw error;
  }
}

async function createJobSchedule(page) {

  // GIVEN
  const schedulesPage = new SchedulesPage(page);
  const jobsPage = new JobsPage(page);
  const fpData = getFpData();
  const scheduleName = getScheduleUniqueName();
  const scheduledJobName = getUniqueName();

  // Install Feature Pack
  const featurePackPage = new FeaturePackPage(page);
  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.upload(fpData.name, featurePack1ZipFilePath);

  // WHEN
  // Create Schedule
  await schedulesPage.gotoSchedulesPageViaMenu();
  await schedulesPage.createSchedule(scheduleName, scheduledJobName, fpData);

  await jobsPage.gotoJobsPageViaMenu();
  // Wait for a longer time than job is schedule for, to guarantee job has been created.

  await page.waitForTimeout(20000);

  // Check job is on jobs page
  await searchFor(page, scheduledJobName);

  // THEN
  console.log(`schedules.spec.ts:#createJobSchedule: Search for scheduledJobName: ${scheduledJobName}`);
  await page.locator(`table tr:has-text("${scheduledJobName}")`);

  let error = await checkIfNameInTableRow(jobsPage, scheduledJobName, 3);
  if (error) {
    await page.screenshot({ path: 'screenshots/create-schedule-failure.png' });
  }

  // Clean up
  await schedulesPage.gotoSchedulesPageViaMenu();
  await schedulesPage.deleteScheduleAndAssociatedJobs(scheduleName);

  await featurePackPage.gotoFeaturePackPage();
  await featurePackPage.uninstall(fpData.name);

  if (error) {
    throw error;
  }
}