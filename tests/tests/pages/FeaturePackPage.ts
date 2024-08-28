import { Page, expect } from "@playwright/test";
import { clickContextButton, clickRow, getUniqueNamesInTableRows, searchFor } from "../test-utils";

export class FeaturePackPage {
  page: Page;
  testNamePrefix: string = 'all' // 'test_'; /* some have test_  some have fp_test_ */

  constructor(page: Page) {
    this.page = page;
  }

  async gotoFeaturePackPage() {
    await this.page.goto('/dr-ui/feature-packs');
  }

  async gotoFeaturePackPageViaMenu() {
    /* for as long as FP in first position in menu
       (less flaky than text=FP Feature packs, text=NF navigation.FEATURE_PACKS') */
    await this.page.locator('.item-cards > div').first().click();
  }

  async upload(featurePackName: string, fileName: string) {
    console.log(`FeaturePackPage:#upload: featurePackName: ${featurePackName}`);

    // click install icon button
    await this.page.locator('id=install-fp-icon-button-id').click();
    await this.page.locator('erad-text-input[id="fp-name"] input').fill(featurePackName);

    await this.page.locator('input[type="file"]').setInputFiles(fileName);
    // click Dialog Install button
    await this.page.locator('id=install-fp-submit-button-id').click();
  }

  /**
   * Clicks application link away icon on Feature pack details side panel
   * @param fpName  Feature pack name to select in feature pack table
   */
  async linkAwayToFeaturePackDetailsPage(fpName: string) {
    await clickRow(this.page, fpName);
    await this.page.locator('#dnr-item-information-details').getByRole('emphasis').click();
  }

  async update(fpName: string, description: string, fileName: string) {
    await searchFor(this.page, fpName);

    // click context Update button
    await clickContextButton(this.page, 'update-fp-button-id', fpName);
    await this.page.locator('erad-text-input[id="fp-description"] textarea').fill(description);
    await this.page.locator('input[type="file"]').setInputFiles(fileName);

    // click Dialog Update button
    await this.page.locator('id=update-fp-submit-button').click();
  }


  async uninstall(fpName: string) {
    // Search on Feature pack so one to uninstall will be on table
    await searchFor(this.page, fpName);

    // click context Uninstall button
    await clickContextButton(this.page, 'uninstall-fp-button-id', fpName);
    // Click ERAD confirm dialog Uninstall button
    await this.page.locator('id=primary-dialog-button-id').click();
    await expect.soft(this.page.locator('erad-notification-v2').last().locator('css=.notification-success')).toBeVisible();
  }

  /**
   * Utility for external house keeping (npm run clean)
   * not for calling in tests normally
   * as could interfere with a parallel test
   */
  async uninstallAllTestFeaturePacks(nameToSearch: string = this.testNamePrefix) {
    await this._clearTableData(nameToSearch);
  }

  async _clearTableData(nameToSearch: string = "test_") {
    let namesInRows: string[] = [];
    const emptyTableMessage = await this.page.$('.empty-text:visible');
    if (emptyTableMessage) {
      return Promise.resolve(0);
    }
    try {
      if (await this.page.waitForSelector('table', { state: 'visible' })) {
        // need a delay before can calc namesInRows
        namesInRows = await getUniqueNamesInTableRows(this.page, nameToSearch);
        console.log(`Cleaning up ${namesInRows.length} feature pack table rows found matching ${nameToSearch}`);

        if (namesInRows.length > 0) {
          while (namesInRows.length > 0) {
            try {
              // this unique name better than partial nameToSearch with many matches
              await clickContextButton(this.page, 'uninstall-fp-button-id', namesInRows[0]);
              await this.page.locator('id=primary-dialog-button-id').click(); // Click ERAD confirm Dialog button

              // slowing it down for table reload
              await this.page.locator('erad-notification-v2').getByRole('emphasis').first().click();

              namesInRows.splice(0, 1);

            } catch (err) {
              console.log(`#clearTableData error for feature pack table using clean up utility with ${nameToSearch}:  ${err.message}`);
              console.log(err.stack);
              namesInRows = [];
            }
          }
        }
      } else {
        console.log(`No Feature Pack Table rows found, implying table is now empty`);
      }

    } catch (err) {
      // timeout if no table
      console.log(`Timeout - no Feature Pack Table rows found`);
    }
    return Promise.resolve(namesInRows.length === 0);
  }
}