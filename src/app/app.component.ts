import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Button, Checkbox, Dialog, Menu, MenuItem, Pill, Switch, Tooltip } from '@eui/base';
import { Component, OnInit, isDevMode } from '@angular/core';
import { ConfigLoaderService, ConfigThemeService, SideDrawerFacadeService } from '@erad/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { Pagination, Setting, Table } from '@eui/table';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { AppComponentService } from './services/app.component.service';
import { AppConstants } from './constants/app.constants';
import { BrandingType } from '@erad/components/system-bar';
import { BreadcrumbItem } from '@erad/components/breadcrumb';
import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { FEATURE_PACK_DOWNLOAD_WITH_ID_URL } from './constants/UrlConstants';
import { FeaturePackDetailsFacadeService } from './lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackDetailsResponse } from './models/feature-pack-details-response.model';
import { Icon } from '@eui/theme';
import { Item } from '@erad/components/common';
import { Job } from './models/job.model';
import { JobDetailsFacadeService } from './lib/job-detail/services/job-details-facade.service';
import { RbacService } from './services/rbac.service';
import { RoutingPathContent } from './enums/routing-path-content.enum';
import { SystemBarMenuOptions } from '@erad/smart-components/system-panel';
import { Tab } from './services/tabs/tabs.model';
import { TabsService } from './services/tabs/tabs.service';
import { Tile } from '@eui/layout';
import { TranslateService } from '@ngx-translate/core';
import { handleNewUIVersionOnStartUp } from './utils/local-store.utils';

/**
 * DnR UI entry point component
 */
@UnsubscribeAware()
@Component({
  selector: 'dnr-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  branding: BrandingType;
  brandingPath = ''; /* when switch to custom theme, this will find icon */
  currentTheme: Item;
  favicon: HTMLLinkElement = null;
  leftDrawerOpened$: Observable<boolean>;
  loading = false;
  rightDrawerOpened: boolean = false;
  showApps = false;
  subscriptions: Subscription[] = [];
  // TODO - theme temporarily removed from app.component.html for first release.
  // Keeping here as will be added again in future.
  themes: any[] = [];
  username$: Observable<string>;
  langObj: { lang?: string } = null;
  toolbarBreadcrumbData: BreadcrumbItem[];
  isAuthorized: boolean = isDevMode() || false;
  _currentEventUrl: string;
  _jobsDetailLabel: string;
  _featurePacksLabel: string;
  _browseLabel: string;
  _featurePacksDetailLabel: string;

  tab: Tab;
  tabs: Tab[];
  selectedTabIndex: number;
  downloadURL?: string;
  featurePackInfo: FeaturePackDetailsResponse;
  jobInfo: Job;

  constructor( // NOSONAR Constructor has too many parameters (12). Maximum allowed is 7
    readonly activatedRoute: ActivatedRoute,
    readonly appComponentService: AppComponentService,
    readonly configLoaderService: ConfigLoaderService,
    readonly configThemeService: ConfigThemeService,
    readonly confirmationService: ConfirmationService,
    readonly featurePackDetailFacadeService: FeaturePackDetailsFacadeService,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly rbacService: RbacService,
    readonly router: Router,
    readonly sideDrawerFacadeService: SideDrawerFacadeService,
    readonly tabsService: TabsService,
    readonly translateService: TranslateService,
  ) {

    this.isAuthorized = isDevMode() || rbacService.hasValidRoles();

    this._setTranslationLanguage();
    this._subscribeToRouteNavigationEnd();
    this._registerEUIComponents();

    handleNewUIVersionOnStartUp();
  }

  ngOnInit() {
    this.loadApps();

    this.username$ = this._getUserName();
    this.brandingPath = '../assets/custom/logo.png'; // For custom theme - at http://localhost:4200/assets/custom/logo.png in dev mode
    this.branding = this.configThemeService.getBranding();
    this.leftDrawerOpened$ = this.sideDrawerFacadeService.getLeftDrawerOpened();

    this._checkBranding();
    this._defineIcon();
    this._getThemeList();
    this._getCurrentTheme();
    this._getRightDrawerOpened();
  }

  initTabs(featurePackInfo?: FeaturePackDetailsResponse, jobInfo?: Job): void {
    this.featurePackInfo = featurePackInfo;
    const isFeaturePack = this.featurePackInfo?.name ? true : false;
    this.jobInfo = jobInfo;
    const tabId = this.activatedRoute.snapshot?.queryParams.id;
    if (this.tabsService.tabExists(tabId, isFeaturePack)) {
      this.tab = this.tabsService.getTabById(tabId, isFeaturePack);
      this.selectedTabIndex = this.tabsService.getIndexOfTab(tabId, isFeaturePack);
    } else if (this.tabsService.maxTabsOpened()) {
      this.tabsService.showMaxTabOpenedDialog();
      this.tab = this.tabsService.getFirstTab();
      this.selectedTabIndex = 0;
      this._updateUrl(this.tab);
    } else {
      const name = this.featurePackInfo?.name ? this.featurePackInfo.name : this.jobInfo?.name;
      this.tab = this.tabsService.addTab(tabId, name, isFeaturePack, this.jobInfo?.jobScheduleId);
      this.selectedTabIndex = this.tabsService.getIndexOfTab(tabId, isFeaturePack);
    }
    this.tabs = this.tabsService.getTabs();
  }

  onTabChanged(index: number): void {
    if (this.tabsService.noTabsExist()) {
      return;
    }
    this.tabsService.updateTab(this.tab);
    this.tab = this.tabsService.getTabByIndex(index);
    this.selectedTabIndex = index;
    const tabId = this.tab.id;
    this._updateUrl(this.tab);

    this.tab.isFeaturePack ? this.featurePackDetailFacadeService.loadDetails(tabId) : this.jobDetailsFacadeService.loadDetails(tabId);
    this.downloadURL = (this.tab.isFeaturePack) ? FEATURE_PACK_DOWNLOAD_WITH_ID_URL.replace('{0}', `${tabId}`) : null;
  }

  onTabClosed(numberOfTabs: number): void {
    if (numberOfTabs === 0 && this.tabsService.noTabsExist()) {
      this.router.navigate([RoutingPathContent.FeaturePacks]);
    } else if (this.selectedTabIndex === 0) {
      this.onTabChanged(0);
    } else {
      // TODO not 100% sure this is correct behavior
      // - why change selection if not closing current tab
      this.selectedTabIndex = 0;
    }
  }

  /* note - this onMaxTabs should not be called since
     warning dialog won't allow tab to be added */
  onMaxTabs(): void {
    const index = this.tabs.length - 2;
    if (index >= 0) {
      this._updateUrl(this.tabs[index]);
      this.tabsService.removeLastTab();
      this.tabs = this.tabsService.getTabs();
    }
  }

  /**
   * Clicking erad-system-bar application name,
   * should bring you to home screen from feature or jobs details pages.
   *
   * TODO If the side menu is closed - this would be a useful way to open it too
   * (since current icon to do same is confusing)
   */
  onApplicationNameClicked() {
    this.router.navigate([RoutingPathContent.FeaturePacks]);
  }

  /* expose for junit */
  _updateUrl(tab: Tab): void {
    const id = tab.id;
    if (tab.isFeaturePack) {
      this.router.navigate([RoutingPathContent.FeaturePackDetail], {
        relativeTo: this.activatedRoute,
        queryParams: { id, linkAwaySection: 'APPLICATIONS' },
      });
    }
    else {
      this.router.navigate([RoutingPathContent.JobDetail], {
        relativeTo: this.activatedRoute,
        queryParams: { id, linkAwaySection: 'OBJECTS' },
      });
    }
  }

  onAddSignClick() {
    this.router.navigate([RoutingPathContent.FeaturePacks]);
  }

  private _setTranslationLanguage() {
    this.translateService.setDefaultLang(AppConstants.defaultLanguage);
    this.translateService.use(this.translateService.getDefaultLang()).subscribe(() => {
      this._jobsDetailLabel = this.translateService.instant('breadcrumb.JOB_DETAIL');
      this._featurePacksLabel = this.translateService.instant('navigation.FEATURE_PACKS');
      this._browseLabel = this.translateService.instant('navigation.BROWSE');
      this._featurePacksDetailLabel = this.translateService.instant('breadcrumb.FEATURE_PACK_DETAILS');
      this._handleURLChange(this._currentEventUrl);
    })

    if (isDevMode()) {
      setInterval(() => {
        if (!!window['language'] && window['language'] !== window['_setLanguage']) {
          window['_setLanguage'] = window['language'];
          this.translateService.use(window['_setLanguage']).subscribe(() => {
            console.log(`Language set to ${window['language']}`);
          });
        }
      }, 0);
    }
  }

  _subscribeToRouteNavigationEnd() {
    this.router.events?.pipe(takeUntilDestroyed(this))
      .subscribe((event): void => {
        if (event instanceof NavigationEnd) {
          this._currentEventUrl = event.url;
          this._handleURLChange(this._currentEventUrl);
        }
      });
  }

  _handleURLChange(url: string = '') {
    this.toolbarBreadcrumbData = this.appComponentService.getBreadcrumb(
      url,
      {
        jobsDetailLabel: this._jobsDetailLabel,
        featurePacksDetailLabel: this._featurePacksDetailLabel,
        browseLabel: this._browseLabel
      }
    );
  }

  handleToolbarBreadcrumbClick(item: BreadcrumbItem) {
    if (item.label === this._jobsDetailLabel || this.router.url?.includes(RoutingPathContent.JobDetail)) {
      this.router.navigateByUrl(RoutingPathContent.JobsTable);
    } else if (item.label === this._featurePacksLabel) {
      this.router.navigate(['/' + RoutingPathContent.FeaturePacks]);
    }
    else {
      this.router.navigate(['/']);
    }
  }

  onAppsClicked() {
    this.showApps = true;
  }

  onAppsCloseClicked() {
    this.showApps = false;
  }

  onUserActionClicked() {
    this.sideDrawerFacadeService.setRightDrawerOpened(true);
  }

  onRightDrawerClose() {
    this.sideDrawerFacadeService.setRightDrawerOpened(false);
  }

  /**
   * Redirect to logout page should user verify logout
   *
   * BAM proxy setup should handle deleting token cookie etc
   * ref https://adp.ericsson.se/marketplace/authentication-proxy/documentation/2.2.0/dpi/api-documentation
   * ref https://eteamspace.internal.ericsson.com/display/RMADP/RBAC+Proxy+Open+API
   * @see logout-redirect-guard.ts
   */
  onLogoutClicked() {

    this.confirmationService.show({
      header: this.translateService.instant("messages.CONFIRM_SIGN_OUT_HEADER"),
      content: this.translateService.instant("messages.CONFIRM_SIGN_OUT_MESSAGE"),
      cancelText: this.translateService.instant('buttons.CANCEL'),
      confirmButtonText: this.translateService.instant('buttons.SIGN_OUT'),   /* ERAD button in side panel says "sign out" not log out*/
      icon: 'warningIcon'
    })
      .subscribe(userConfirmsLogout => {
        if (userConfirmsLogout) {

          this.showApps = false;
          this.sideDrawerFacadeService.setRightDrawerOpened(false);

          /* not setting this.isAuthorized = false here as do not want the
             not authorized message to show for a millisecond before logout
             redirect to external login screen in deployment env */

          const originUrl = encodeURIComponent(window.location.href);
          this.router.navigate([`/${RoutingPathContent.LogoutRedirect}`], { queryParams: { originUrl } });
        }
      });
  }

  loadApps() {
    /* not applicable in standalone mode for now - refer to catalog-designer-ui implementations */
  }

  /**
   * applicable when had theme (and potentially more options
   * in sign-out panel dropdown) - ref to previous app.component.html
   * for putting same back
   */
  onChangeOption(themeValue: string) {
    this.configThemeService.changeTheme(themeValue);
    this._checkBranding();
    this._defineIcon();
  }

  getAppName() {
    return this.translateService.instant('APP_NAME');
  }

  onSystemBarEnterPressed(type: string) {
    if (type === SystemBarMenuOptions.UserProfile) {
      this.onUserActionClicked();
    } else if (type === SystemBarMenuOptions.Apps) {
      this.onAppsClicked();
    }
  }

  getVersion() {
    const version = this.configLoaderService.getRuntimePropertiesInstant()?.version;
    return this.translateService.instant('VERSION') + ' ' + (version || '0.0.1');
  }

  getCopyright() {
    const year = new Date().getFullYear();
    return `${this.translateService.instant('COPYRIGHT')} © ${year}, ${this.translateService.instant('COMPANY_NAME')}`;
  }

  getPrivacyPolicy() {
    return {
      url: this.configLoaderService.getRuntimePropertiesInstant()?.privacyPolicy,
      label: this.translateService.instant('PRIVACY_POLICY'),
    };
  }

  getTermsOfService() {
    return {
      url: this.configLoaderService.getRuntimePropertiesInstant()?.termsOfService,
      label: this.translateService.instant('TERMS_OF_SERVICE'),
    };
  }

  _getRightDrawerOpened(): void {
    this.sideDrawerFacadeService.getRightDrawerOpened().subscribe((rightDrawerOpened) => {
      this.rightDrawerOpened = rightDrawerOpened;
    });
  }

  _getCurrentTheme(): void {
    const themeValue = this.configThemeService.getCurrentThemeName();
    this.currentTheme = this.themes.find((theme) => theme.value === themeValue);
  }

  /**
   * For erad-user-profile theme dropdown.
   * It would appear that can only add one dropdown to the component
   * (i.e. cannot add a second dropdown for i18n selection)
   */
  _getThemeList(): void {
    this.themes = this.configThemeService.getThemeList();
  }

  _defineIcon(): void {
    if (this.branding === BrandingType.PRIVATE) {
      this.favicon = document.querySelector('#appIcon');
      if (this.favicon) {
        this.favicon.href = this.brandingPath;
      }
    }
  }

  _checkBranding(): void {
    this.branding = this.configThemeService.getBranding();

    if (!Object.values(BrandingType).includes(this.branding)) {
      this.branding = BrandingType.ERICSSON;
    }
  }

  /* for as long not using a login page (authFacadeService), this is just a dummy implementation */
  private _getUserName(): Observable<string> {
    return new Observable((observer: Observer<string>) => {
      observer.next(this.rbacService.getPreferredUserName());
      observer.complete();
    });
  }

  private _registerEUIComponents() {
    Table.register();
    Pagination.register();
    Setting.register();
    Tile.register('eui-tile');
    Icon.register('eui-icon');

    this._registerCustomElement('eui-menu', Menu);
    this._registerCustomElement('eui-menu-item', MenuItem);
    this._registerCustomElement('eui-dialog', Dialog);
    this._registerCustomElement('eui-button', Button);
    this._registerCustomElement('eui-pill', Pill);
    this._registerCustomElement('eui-tooltip', Tooltip);
    this._registerCustomElement('eui-switch', Switch);
    this._registerCustomElement('eui-checkbox', Checkbox );
  }

  /**
   * Needed for E-UI SDK base-lib components as EUI SDK
   * removed self register in @eui/base version 1.1.4
   *
   * @param definitionName   e.g. from EUI SDK definitionName, e.g. eui-menu
   * @param euiSDKclass  SDK class name, e.g. Menu
   */
  private _registerCustomElement (definitionName: string, euiSDKclass: any) {
    if (!customElements.get(definitionName)) {
      customElements.define(definitionName, euiSDKclass as unknown as CustomElementConstructor);
    }
  }
}
