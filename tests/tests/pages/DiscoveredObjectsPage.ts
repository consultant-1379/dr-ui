import { Page } from "@playwright/test";

export class DiscoveredObjectsPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async refreshPage() {
    await this.page.locator('#left i').click();
  }

  async clickReconcileAll() {
    await this.page.locator('id=reconcile-all-button-id').click();
    await this.page.locator('id=reconcile-job-submit-button-id').click(); // confirm

    const notificationLocator = this.page.locator('erad-notification-v2').last().locator('css=.notification-success');
    await notificationLocator.click();
  }

  async clickReconcile() {
    // Select any row with state == Discovered

    const statusCellLocator = await Promise.race([
      this.page.getByRole('table').locator('eui-pill').filter({ hasText: 'Discovered'}),
      this.page.getByRole('table').locator('eui-pill').filter({ hasText: 'status.DISCOVERED'}),
    ]);

    const rowLocator = statusCellLocator.locator('xpath=ancestor::tr');
    await rowLocator.click();

    await this.page.locator('id=reconcile-button-id').click();
    await this.page.locator('id=reconcile-job-submit-button-id').click(); // confirm

    const notificationLocator = this.page.locator('erad-notification-v2').last().locator('css=.notification-success');
    await notificationLocator.click();
  }
}