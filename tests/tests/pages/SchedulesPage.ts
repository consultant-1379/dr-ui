import { Page, expect } from "@playwright/test";
import { clearSearch, clickContextButton, clickRow, searchFor, selectOptionFromPullDown } from "../test-utils";

import { FeaturePackData } from "../feature-pack-test.model";

export class SchedulesPage {
  page: Page;
  testNamePrefix: string = 'test_';

  constructor(page: Page) {
    this.page = page;
  }

  async gotoSchedulesPageViaMenu() {
    /* for as long as Schedule menu is in third place
      (better than relying on dictionary being loaded
      i.e. 'text=S Schedules or text=NS navigation.SCHEDULES) */
    await this.page.locator('.item-cards > div:nth-child(3)').click();
  }

  async gotoSchedulesPage() {
    await this.page.goto('/dr-ui/schedules-table');
  }

  async createSchedule(scheduleName: string, jobName: string, fpData: FeaturePackData) {
    console.log(`SchedulesPage:#createSchedule: scheduleName: ${scheduleName}, jobName ${jobName}`);

    await this.page.locator('id=create-schedule-icon-button-id').click();
    // Enter Schedule info
    await this.page.locator('erad-text-input[id="schedule-name"] input').fill(scheduleName);
    await this.page.locator('erad-text-input[id="schedule-description"] textarea').fill("Schedule desc");
    // Schedule for every 5 seconds.
    await this.page.locator('erad-text-input[id="cron-expression"] input').fill("*/5 * * * * *");

    // Enter Job info
    await this.page.locator('erad-text-input[id="job-name"] input').fill(jobName);
    await selectOptionFromPullDown(this.page, 'erad-dropdown[id="fp-name-dropdown"] .mat-select', fpData.name);
    await selectOptionFromPullDown(this.page, 'erad-dropdown[id="fp-app-dropdown"] .mat-select', fpData.application);
    await selectOptionFromPullDown(this.page, 'dnr-job-definition-dropdown .mat-select', fpData.job);

    await this.page.locator('id=create-schedule-button-submit-id').click();
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
  }

  async deleteSchedule(scheduleName: string) {
    await clickContextButton(this.page, 'delete-schedule-button-id', scheduleName);
    await this.page.locator('id=primary-dialog-button-id').click(); // confirm
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
  }

  async deleteScheduleAndAssociatedJobs(scheduleName: string) {

    await searchFor(this.page, scheduleName);
    await clickContextButton(this.page, 'delete-schedule-button-id', scheduleName);
    await this.page.locator('id=delete-jobs-checkbox-id').click(); // associated jobs delete
    await this.page.locator('id=primary-dialog-button-id').click(); // confirm
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
    await clearSearch(this.page);
  }

  /**
   * Exercise disable switch (in case fails to delete and have a new job every 5 secs)
   * Searches for scheduleName so should leave one (unselected) row in table when finished
   * @param scheduleName  Name of schedule to disable (or enable)
   */
  async toggleScheduleEnableSwitch(scheduleName: string) {
    await searchFor(this.page, scheduleName);
    await this._clickSwitcherInRightPanel(scheduleName);
    await clearSearch(this.page);
  }

      /* if the searchFor found one row - then the UI should have auto-selected it already */
  async _clickSwitcherInRightPanel(scheduleName: string) {
    const switcher = this.page.locator('eui-switch span').first();
    if (await switcher.count() > 0) {
      await switcher.click();
    } else {
      await clickRow(this.page, scheduleName);
      await this.page.locator('eui-switch span').first().click();
    }
  }
}