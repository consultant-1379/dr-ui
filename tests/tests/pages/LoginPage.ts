import { LOGIN_PASSWORD, LOGIN_USER_NAME } from "tests/playwright.config";
import { Page } from "@playwright/test";
import { expect } from '@playwright/test';

export class LoginPage {
  page: Page;

  certError: 'ERR_CERT_AUTHORITY_INVALID';
  proxyError: 'NS_ERROR_PROXY_CONNECTION_REFUSED';

  constructor(page: Page) {
    this.page = page;
  }

  launchOptions = {
    proxy: {
      server: 'socks5://localhost:5005'
    }
  };

  async login() {
    this.page.close();

    const browserType = this.page.context().browser().browserType();
    const browser = await browserType.launch();
    const context = await browser.newContext();
    this.page = await context.newPage();
    await this.page.goto('/dr-ui/feature-packs');

    const pageIds = {
      username: 'username',
      password: 'password',
      loginButton: 'kc-login-input'
    };

    await this.page.locator(`#${pageIds.username}`).fill(LOGIN_USER_NAME);
    await this.page.locator(`#${pageIds.password}`).fill(LOGIN_PASSWORD);
    await this.page.locator(`#${pageIds.loginButton}`).click();

    await expect(this.page.getByText('Discovery and Reconciliation')).toBeVisible();
    return this.page;
  }

  async loginToProxy() {
    this.page = await this.launchNewBrowserWithProxy();
    await this._checkAndClickAdvancedButton(1);

    await this.login();
    return this.page;
  }

  // this is just to see page for development.
  // Close current browser and open new one using proxy.
  // proxyServer: 'socks5://localhost:5005';
  async launchNewBrowserWithProxy() {
    this.page.close();

    const browserType = this.page.context().browser().browserType();
    const browser = await browserType.launch(this.launchOptions);
    const context = await browser.newContext();
    return await context.newPage();
  }

  async _checkAndClickAdvancedButton(repeatTimes: number) {

    try {
      await this.page.goto('/dr-ui/feature-packs');
    } catch (e) {
      /* Warning: Potential Security Risk Ahead situation  (finding "Advanced..."  (in chrome) */
      for (let i = 1; i < repeatTimes + 1; i++) {
        console.log('Trying to agree with risks ' + i + ' time');
        this._agreeWithSecurityRisk();
      }
    }
  }

  async _agreeWithSecurityRisk() {

    const proceedLinkId = 'proceed-link';
    const advancedButton = this.page.getByRole('button', { name: /^Advanced/ });
    if (advancedButton) {
      console.log('Button with label starting with "Advanced" found and clicked.');
      await advancedButton.click();

      // TODO browser type check
      try {
        const proceedHrefLink = this.page.locator(`#${proceedLinkId}`);
        if (proceedHrefLink) {
          console.log('Proceed link found (unsafe) and clicking ');
          await proceedHrefLink.click();
        } else {
          console.log('Proceed link not found on the page');
        }
      } catch (e) {
        console.log('Proceed page error ' + e);
        try {
          this._clickAcceptRiskButton();
        } catch (e2){
          console.log('Accept risk button error ' + e2);
        }

      }

    } else {
      console.log('Button with label starting with "Advanced" not found on the page.');
    }

  }

  async _clickAcceptRiskButton() {
    const acceptRiskButton = this.page.getByRole('button', { name: /^Accept/ });
    if (acceptRiskButton) {
      console.log('Accept risk button found (unsafe) and clicking (should enter the login page)');

      await acceptRiskButton.click();
      await this.page.screenshot({ path: 'acceptScreenshot.png' });

    } else {
      console.log('Accept risk button not found on the page');
    }
  }
}
