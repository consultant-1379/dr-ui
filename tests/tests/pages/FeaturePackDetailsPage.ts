import { Page, expect } from "@playwright/test";

import { selectOptionFromPullDown } from "../test-utils";

export class FeaturePackDetailsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async clickApplicationCard(applicationName: string) {
    const card_I18n = this.page.getByText(applicationName+'Application');
    const card =  this.page.locator('#dnr-applications-card-view').getByText(applicationName);
    await (card_I18n.or(card).first()).click();
  }

  async checkJobDetailsPanel(applicationName: string, jobDefinition: string) {
    await this.clickApplicationCard(applicationName);
    await selectOptionFromPullDown(this.page, 'dnr-job-definition-dropdown .mat-select', jobDefinition); // panel 1
    await this._testJobDetailsPanel(); // panel 2
  }

  async _testJobDetailsPanel() {
    await this.page.getByRole('listitem').locator('div').first().click();

    const discoverCountLabel_I18n = this.page.locator('div').filter({ hasText: /^Discovered objects count1$/ });
    const discoverCountLabel = this.page.locator('div').filter({ hasText: /^job.DISCOVERED_OBJECTS_COUNT1$/ });
    await expect(discoverCountLabel_I18n.or(discoverCountLabel).first()).toBeVisible();
  }
}
