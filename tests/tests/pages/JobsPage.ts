import { Page, expect } from "@playwright/test";
import { clickContextButton, searchFor, selectOptionFromPullDown } from "../test-utils";

import { FeaturePackData } from "../feature-pack-test.model";
import { getBaseUrl } from "tests/playwright.config";

const { exec } = require('child_process');

export class JobsPage {
  page: Page;
  // only meant to delete test generated jobs - change to "all" if want to delete all jobs
  testNamePrefix: string = 'test_';
  // XX testNamePrefix: string = 'all';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoJobsPageViaMenu() {
    /* for as long as Jobs menu is in second place
       (better than 'text=J Jobs or text=NJ navigation.JOBS) */
    await this.page.locator('.item-cards > div:nth-child(2)').click();
  }

  async gotoJobsPage() {
    await this.page.goto('/dr-ui/jobs-table');
  }

  async navigateFromDetailsPageToJobsPage() {
    // Click on the + on the details page to go to the main page:
    await this.page.locator('id=home-navigation-icon-id').click();
    await this.gotoJobsPageViaMenu();
  }

  async createJob(jobName: string, fpData: FeaturePackData) {

    await this.page.locator('id=create-job-icon-button-id').click();
    await this.page.locator('erad-text-input[id="job-name"] input').fill(jobName);
    await this.page.locator('erad-text-input[id="job-description"] textarea').fill(jobName + ' description');

    await selectOptionFromPullDown(this.page, 'erad-dropdown[id="fp-name-dropdown"] .mat-select', fpData.name);
    await selectOptionFromPullDown(this.page, 'erad-dropdown[id="fp-app-dropdown"] .mat-select', fpData.application);
    await selectOptionFromPullDown(this.page, 'dnr-job-definition-dropdown .mat-select', fpData.job);

    await this.page.locator('id=create-job-button-submit-id').click();
    await this.page.waitForURL(/.*linkAwaySection=OBJECTS/);

    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
    await expect(this.page.getByRole('cell', { name: jobName })).not.toBeVisible();
  }

  async createJobViaFeaturePagePage(jobName: string, fpData: FeaturePackData) {

    await this.page.locator('id=create-job-icon-button-id').click();
    await this.page.locator('erad-text-input[id="job-name"] input').fill(jobName);
    await this.page.locator('erad-text-input[id="job-description"] textarea').fill(jobName + ' description');

    // FP and Application should have already been selected.
    await selectOptionFromPullDown(this.page, 'dnr-job-definition-dropdown .mat-select', fpData.job);

    await this.page.locator('id=create-job-button-submit-id').click();
    await this.page.waitForURL(/.*linkAwaySection=OBJECTS/);
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
    await expect(this.page.getByRole('cell', { name: jobName })).not.toBeVisible();
  }

  async duplicateJob(jobName: string) {
    // Search on job name so one to duplicate will be on table
    await searchFor(this.page, jobName);
    await clickContextButton(this.page, 'duplicate-job-button-id', jobName);
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
  }

  async deleteJob(jobName: string) {
    // Search on job name so one to delete will be on table
    await searchFor(this.page, jobName);

    await clickContextButton(this.page, 'delete-job-button-id', jobName);
    await this.page.locator('id=primary-dialog-button-id').click(); // confirm
  }

  async deleteAllDuplicateJobs(jobName: string) {
    /* use exact name (not 'forDup', as Firefox and Chrome creating duplicates in parallel) */
    await this.deleteAllTestJobs(jobName);
  }

  /**
  * Utility house keeping at end of test
  *
  * Also (npm run clean) for a full clear out,
  * though that would not for calling in tests normally
  * as could interfere with a parallel test between browsers etc
  */
  async deleteAllTestJobs(nameToSearch: string = 'test') {

    const baseUrl = getBaseUrl(); // e.g. 'http://dr.docker.localhost/dr-ui/'
    const prefix = baseUrl.substring(0, baseUrl.indexOf('/dr-ui/')); // i.e.'http://dr.docker.localhost'

    const url = `${prefix}/discovery-and-reconciliation/v1/jobs?filters=name==*${nameToSearch}*`;
    const curlCommand = `curl -X DELETE "${url}"`;

    try {
      console.log(`Deleting test jobs via server call: ${url}`);
      await new Promise<void>((resolve, reject) => {
        exec(curlCommand, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing curl: ${stderr}`);
            return reject(error);
          }
          console.log(`curl output: ${stdout}`);
          resolve();
        });
      });
      console.log('Successfully deleted test jobs');
    } catch (error) {
      console.error('Error deleting test jobs:', error);
    }
  }
}