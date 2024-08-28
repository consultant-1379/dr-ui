import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock, ConfigThemeService, ConfigThemeServiceMock } from '@erad/core';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppComponent } from './app.component';
import { BrandingType } from '@erad/components';
import { Job } from './models/job.model';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { Tab } from './services/tabs/tabs.model';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

const navigationEndEvent = new NavigationEnd(1, 'theUrl', 'urlAfterRedirects');
const pipeEventsSpy = jasmine.createSpyObj('events', ['pipe']);

const routerSpy = jasmine.createSpyObj(
  'Router',
  ['navigate', 'navigateByUrl'],
  {
    events: pipeEventsSpy
  },
);
let fixture: ComponentFixture<AppComponent>;
let configLoaderService: ConfigLoaderService;
let appToTest: AppComponent;

const fakeActivatedRoute = { snapshot: { queryParams: { linkAwaySection: 'OBJECTS', id: 'active_route_id' } } };

describe('AppComponent', () => {
  beforeEach(async () => {

    pipeEventsSpy.pipe.and.returnValue({
      subscribe: (callback: any) => callback(navigationEndEvent)
    });

    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          },
        })
      ],
      providers: [
        {
          provide: Router,
          useValue: routerSpy
        },
        {
          provide: TabsService,
        },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        {
          provide: TranslateService,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        {
          provide: ConfigThemeService,
          useClass: ConfigThemeServiceMock
        },
        provideMockStore(),
        {
          provide: MatDialog,
          useValue: MatDialogMock
        },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({})
          }
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    configLoaderService = TestBed.inject(ConfigLoaderService);
    fixture.detectChanges();
    appToTest = fixture.componentInstance;
  });

  afterEach(() => {
    routerSpy.navigate.calls.reset();
    routerSpy.navigateByUrl.calls.reset();

    fixture.destroy();
  });


  it('should create the app', () => {
    expect(appToTest).toBeTruthy();
  });

  it(`should have as app name 'Discovery and Reconciliation'`, () => {
    expect(appToTest.getAppName()).toEqual('APP_NAME');
  });

  it('should render initial screen', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('div').textContent).toContain('apps');
  });


  describe("tab handling tests", () => {

    let fpTab: Tab, jobDetailTab: Tab;

    beforeEach(() => {

      fpTab = {
        title: "my tab name0",
        id: "id0",
        isFeaturePack: true // note true
      };
      jobDetailTab = {
        title: "my tab name1",
        id: "id1",
        isFeaturePack: false
      };
      appToTest.tab = null;
      appToTest.selectedTabIndex = -1;
    });
    it('initTabs should set current tab and selectedTabIndex when the tab exists', () => {

      // GIVEN
      spyOn(appToTest.tabsService, 'tabExists').and.returnValue(true);
      spyOn(appToTest.tabsService, 'getTabById').and.returnValue(jobDetailTab);
      spyOn(appToTest.tabsService, 'getIndexOfTab').and.returnValue(1);

      // WHEN
      appToTest.initTabs()

      // THEN
      expect(appToTest.tab).toEqual(jobDetailTab);
      expect(appToTest.selectedTabIndex).toEqual(1);
    });

    it('initTabs should show max tabs opened dialog if max tabs are opened and reset to first tab', () => {

      // GIVEN
      spyOn(appToTest.tabsService, 'tabExists').and.returnValue(false);
      spyOn(appToTest.tabsService, 'maxTabsOpened').and.returnValue(true);
      spyOn(appToTest.tabsService, 'showMaxTabOpenedDialog');
      spyOn(appToTest.tabsService, 'getFirstTab').and.returnValue(fpTab);
      spyOn(appToTest, '_updateUrl').and.callThrough();

      // WHEN
      appToTest.initTabs()

      // THEN
      expect(appToTest.tabsService.showMaxTabOpenedDialog).toHaveBeenCalled();
      expect(appToTest.selectedTabIndex).toEqual(0);
      expect(appToTest._updateUrl).toHaveBeenCalled();
    });

    it('initTabs should add new tab if tab does not exist (and max not exceeded)', () => {

      // GIVEN
      spyOn(appToTest.tabsService, 'tabExists').and.returnValue(false);
      spyOn(appToTest.tabsService, 'maxTabsOpened').and.returnValue(false);

      // reusing for test
      spyOn(appToTest.tabsService, 'getTabById').and.returnValue(fpTab);
      spyOn(appToTest.tabsService, 'getIndexOfTab').and.returnValue(3);

      const job: Job = { name: "my_job", id: "my_job_id", jobScheduleId: "my_schedule_id"};
      // WHEN
      appToTest.initTabs(null, job);

      // THEN
      expect(appToTest.selectedTabIndex).toEqual(3);
      expect(appToTest.tab.isFeaturePack).toEqual(false);
      expect(appToTest.tab.jobScheduleId).toEqual("my_schedule_id");
    });

    it('onTabChanged should do nothing if no tabs exist', () => {
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(true);
      spyOn(appToTest, '_updateUrl');
      appToTest.onTabChanged(1);
      expect(appToTest._updateUrl).not.toHaveBeenCalled();
    });

    it('onTabChanged should call to load job details when a job details tab', () => {

      // GIVEN
      appToTest.tab = fpTab;
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(false);
      spyOn(appToTest.tabsService, 'getTabById').and.returnValue(jobDetailTab);
      spyOn(appToTest.tabsService, 'getTabByIndex').and.returnValue(jobDetailTab);
      spyOn(appToTest.jobDetailsFacadeService, 'loadDetails');

      // WHEN
      appToTest.onTabChanged(1);

      // THEN
      expect(appToTest.tab).toEqual(jobDetailTab);
      expect(appToTest.selectedTabIndex).toEqual(1);
      expect(appToTest.downloadURL).toEqual(null);
      expect(appToTest.jobDetailsFacadeService.loadDetails).toHaveBeenCalledWith(jobDetailTab.id);
    });

    it('onTabChanged should call to load feature pack details, and set download url when a FP details tab', () => {

      // GIVEN
      appToTest.tab = jobDetailTab;
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(false);
      spyOn(appToTest.tabsService, 'getTabById').and.returnValue(fpTab);
      spyOn(appToTest.tabsService, 'getTabByIndex').and.returnValue(fpTab);
      spyOn(appToTest.featurePackDetailFacadeService, 'loadDetails');

      // WHEN
      appToTest.onTabChanged(0);

      // THEN
      expect(appToTest.tab).toEqual(fpTab);
      expect(appToTest.selectedTabIndex).toEqual(0);
      expect(appToTest.downloadURL).toEqual('/discovery-and-reconciliation/v1/feature-packs/id0/files');
      expect(appToTest.featurePackDetailFacadeService.loadDetails).toHaveBeenCalledWith(fpTab.id);
    });

    it("onTabClosed should route to home if closing last remaining tab", () => {
      // GIVEN
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(true);

      // WHEN
      appToTest.onTabClosed(0);
      // THEN
      expect(appToTest.router.navigate).toHaveBeenCalledWith(['feature-packs']);
    });

    it("onTabClosed should retrigger selection on first tab if selectedTabIndex is zero ", () => {
      // GIVEN
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(false);
      spyOn(appToTest, 'onTabChanged');
      appToTest.selectedTabIndex = 0;
      // WHEN
      appToTest.onTabClosed(4);
      // THEN
      expect(appToTest.onTabChanged).toHaveBeenCalledWith(0);
    });

    it("onTabClosed should change selectedTabIndex to zero if it is not zero ", () => {
      // GIVEN
      spyOn(appToTest.tabsService, 'noTabsExist').and.returnValue(false);
      spyOn(appToTest, 'onTabChanged');
      appToTest.selectedTabIndex = 3;
      // WHEN
      appToTest.onTabClosed(2);
      // THEN
      expect(appToTest.onTabChanged).not.toHaveBeenCalled();
      expect(appToTest.selectedTabIndex).toEqual(0);
    });

    it("onMaxTabs (if called) should remove the last tab", () => {
      // GIVEN
      spyOn(appToTest.tabsService, 'removeLastTab').and.callThrough();

      appToTest.tabsService.addTab('1', 'tab1', true);
      appToTest.tabsService.addTab('2', 'tab2', false);
      appToTest.tabsService.addTab('3', 'tab3', true);
      appToTest.tabsService.addTab('4', 'tab4', false, 'jobScheduleId4');
      appToTest.tabsService.addTab('5', 'tab5', true);

      appToTest.tabs = [
        appToTest.tabsService.getTabById('1', true),
        appToTest.tabsService.getTabById('2', false),
        appToTest.tabsService.getTabById('3', true),
        appToTest.tabsService.getTabById('4', false),
        appToTest.tabsService.getTabById('5', true),
      ];

      // WHEN
      appToTest.onMaxTabs();
      // THEN
      expect(appToTest.tabsService.removeLastTab).toHaveBeenCalled();
      expect(appToTest.tabs.length).toEqual(4);
    });
  });

  it('onApplicationNameClicked should re-route to home', () => {
    // WHEN
    appToTest.onApplicationNameClicked();
    // THEN
    expect(appToTest.router.navigate).toHaveBeenCalledWith(['feature-packs']);
  });

  it("onAddSignClick should re-route to home", () => {

    // WHEN
    appToTest.onAddSignClick();
    // THEN
    expect(appToTest.router.navigate).toHaveBeenCalledWith(['feature-packs']);
  });

  it("_subscribeToRouteNavigationEnd should set _currentEventUrl and force a url change", () => {
    // GIVEN
    appToTest._currentEventUrl = null;
    spyOn(appToTest, '_handleURLChange');

    // WHEN
    appToTest._subscribeToRouteNavigationEnd();

    // THEN
    expect(appToTest._handleURLChange).toHaveBeenCalledWith('theUrl');
    expect(appToTest._currentEventUrl).toEqual('theUrl');
  });

  describe("handleToolbarBreadcrumbClick tests", () => {

    beforeEach(() => {
      appToTest._jobsDetailLabel = 'Job details';
      appToTest._featurePacksLabel = 'Feature pack details';
    });

    afterEach(() => {
      routerSpy.navigate.calls.reset();
      routerSpy.navigateByUrl.calls.reset();
    });

    it("should route to job page when breadcrumb is Browse > Job details", () => {
      appToTest.handleToolbarBreadcrumbClick({ label: 'Job details' });
      expect(appToTest.router.navigateByUrl).toHaveBeenCalledWith('jobs-table');
    });

    it("should route to feature pack page when breadcrumb is Browse > Feature pack details", () => {
      appToTest.handleToolbarBreadcrumbClick({ label: 'Feature pack details' });
      expect(appToTest.router.navigate).toHaveBeenCalledWith(['/feature-packs']);
    });

    it("should route to home in any other case", () => {
      appToTest.handleToolbarBreadcrumbClick({ label: 'whatever' });
      expect(appToTest.router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  it("onAppsClicked should set showApps to true", () => {
    appToTest.showApps = false;
    appToTest.onAppsClicked();
    expect(appToTest.showApps).toBeTrue();
  });

  it("onAppsCloseClicked should set showApps to false", () => {
    appToTest.showApps = true;
    appToTest.onAppsCloseClicked();
    expect(appToTest.showApps).toBeFalse()
  });

  it("onUserActionClicked should open the right side panel (drawer)", () => {
    spyOn(appToTest.sideDrawerFacadeService, 'setRightDrawerOpened').and.callThrough();
    appToTest.onUserActionClicked();
    expect(appToTest.sideDrawerFacadeService.setRightDrawerOpened).toHaveBeenCalledOnceWith(true);
  });

  it("onRightDrawerClose should close the right side panel (drawer)", () => {
    spyOn(appToTest.sideDrawerFacadeService, 'setRightDrawerOpened').and.callThrough();
    appToTest.onRightDrawerClose();
    expect(appToTest.sideDrawerFacadeService.setRightDrawerOpened).toHaveBeenCalledOnceWith(false);
  });

  describe("onLogoutClicked tests", () => {

    afterEach(() => {
      routerSpy.navigate.calls.reset();
    });

    it("should redirect to external login screen if user confirms okay", () => {
      // GIVEN
      spyOn(appToTest.confirmationService, 'show').and.returnValue(of(true));
      spyOn(appToTest.sideDrawerFacadeService, 'setRightDrawerOpened');
      appToTest.showApps = true;

      // WHEN
      appToTest.onLogoutClicked();

      // THEN
      expect(appToTest.showApps).toBeFalse();
      expect(appToTest.sideDrawerFacadeService.setRightDrawerOpened).toHaveBeenCalledOnceWith(false);
      expect(appToTest.router.navigate).toHaveBeenCalledWith(['/logout-redirect'], { queryParams: { originUrl: encodeURIComponent(window.location.href) } });
    });

    it("should not redirect to external login screen if is not okay", () => {
      // GIVEN
      spyOn(appToTest.confirmationService, 'show').and.returnValue(of(false));
      spyOn(appToTest.sideDrawerFacadeService, 'setRightDrawerOpened');
      appToTest.showApps = true;

      // WHEN
      appToTest.onLogoutClicked();

      // THEN
      expect(appToTest.showApps).toBeTrue();
      expect(appToTest.sideDrawerFacadeService.setRightDrawerOpened).not.toHaveBeenCalled();
      expect(appToTest.router.navigate).not.toHaveBeenCalled();
    });
  });

  it("onChangeOption should call to change the option", () => {
    spyOn(appToTest.configThemeService, 'changeTheme');
    spyOn(appToTest, '_checkBranding').and.callThrough();
    spyOn(appToTest, '_defineIcon').and.callThrough();
    spyOn(appToTest.configThemeService, 'getThemeList').and.returnValue(['ericsson-dark']);

    appToTest.onChangeOption('ericsson-dark');

    expect(appToTest.configThemeService.changeTheme).toHaveBeenCalledWith('ericsson-dark');
    expect(appToTest._checkBranding).toHaveBeenCalled();
    expect(appToTest._defineIcon).toHaveBeenCalled();
  });

  it("_defineIcon should set the app icon when BrandingType.PRIVATE", () => {

    spyOn(appToTest.configThemeService, 'getBranding').and.returnValue(BrandingType.PRIVATE);
    appToTest.branding = BrandingType.PRIVATE;
    appToTest.favicon = null;

    spyOn(document, 'querySelector').and.returnValue(document.createElement('img'));

    appToTest._defineIcon();

    expect(document.querySelector).toHaveBeenCalledWith('#appIcon');
    expect(appToTest.favicon.href).toEqual('../assets/custom/logo.png');

  });

  describe("onSystemBarEnterPressed tests", () => {

    it("onSystemBarEnterPressed with 'userProfile' string parameter should open the side drawer", () => {
      // GIVEN
      spyOn(appToTest, 'onUserActionClicked').and.callThrough();
      spyOn(appToTest.sideDrawerFacadeService, 'setRightDrawerOpened');

      // WHEN
      appToTest.onSystemBarEnterPressed('userProfile')

      // THEN
      expect(appToTest.onUserActionClicked).toHaveBeenCalled();
      expect(appToTest.sideDrawerFacadeService.setRightDrawerOpened).toHaveBeenCalledOnceWith(true);
    });

    it("onSystemBarEnterPressed with 'apps' string parameter should show the application", () => {
      // GIVEN
      spyOn(appToTest, 'onAppsClicked').and.callThrough();
      appToTest.showApps = false;;

      // WHEN
      appToTest.onSystemBarEnterPressed('apps')

      // THEN
      expect(appToTest.onAppsClicked).toHaveBeenCalled();
      expect(appToTest.showApps).toBeTrue();
    });
  });

  describe("_getRightDrawerOpened tests", () => {

    it('_getRightDrawerOpened should set the right drawer opened if subscription say it is opened', () => {
      // GIVEN
      appToTest.rightDrawerOpened = false;
      spyOn(appToTest.sideDrawerFacadeService, 'getRightDrawerOpened').and.returnValue(of(true));
      // WHEN
      appToTest._getRightDrawerOpened();

      // THEN
      expect(appToTest.rightDrawerOpened).toBeTrue();

    });

    it('_getRightDrawerOpened should set the right drawer closed if subscription say it is closed', () => {
      // GIVEN
      appToTest.rightDrawerOpened = true;
      spyOn(appToTest.sideDrawerFacadeService, 'getRightDrawerOpened').and.returnValue(of(false));
      // WHEN
      appToTest._getRightDrawerOpened();

      // THEN
      expect(appToTest.rightDrawerOpened).toBeFalse
    });
  });


  it('_getCurrentTheme subscription should set the current theme', () => {
    // GIVEN
    spyOn(appToTest.configThemeService, 'getCurrentThemeName').and.returnValue('ERICSSON-DARK');
    appToTest.themes = [
      { value: 'ERICSSON-DARK', label: 'ERICSSON DARK' },
      { value: 'ERICSSON', label: 'ERICSSON' },
      { value: 'CUSTOM', label: 'CUSTOM' }
    ];
    // WHEN
    appToTest._getCurrentTheme();

    // THEN
    expect(appToTest.currentTheme).toEqual({ value: 'ERICSSON-DARK', label: 'ERICSSON DARK' });

  });



  describe("config loader service tests", () => {

    beforeEach(() => {
      spyOn(configLoaderService, 'getRuntimePropertiesInstant').and.returnValue({
        version: '1.0.99',
        privacyPolicy: 'https://privacy',
        termsOfService: 'https://legal'
      });
    });

    it('getPrivacyPolicy should be returned via configLoaderService', () => {

      expect(appToTest.getPrivacyPolicy()).toEqual({
        url: 'https://privacy',
        label: 'PRIVACY_POLICY'
      });
    });
    it('getTermsOfService should be returned via configLoaderService', () => {
      expect(appToTest.getTermsOfService()).toEqual({
        url: 'https://legal',
        label: 'TERMS_OF_SERVICE'
      });
    });
  });
});