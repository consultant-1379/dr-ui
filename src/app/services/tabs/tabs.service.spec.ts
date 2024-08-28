import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components/confirmation-dialog';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Tab } from './tabs.model';
import { TabsService } from './tabs.service';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { tabsMock } from './tabs.data.mock';

describe('Tabs', () => {
  let service: TabsService;
  let confirmationService: ConfirmationService;
  let configLoaderService: ConfigLoaderService;

  const mockTab = {
    title: 'job_1015: Analyst 1-0-15-replaced',
    id: 'job_1015',
    isFeaturePack: false,

  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: TabsService,
        },
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
      ]
    });
    service = TestBed.inject(TabsService);
    confirmationService = TestBed.inject(ConfirmationService);
    configLoaderService = TestBed.inject(ConfigLoaderService);

    tabsMock.forEach(tab => service.addTab(tab.id, tab.title, tab.isFeaturePack, tab.jobScheduleId));

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getTabs should return tabs', () => {
    const tabs = service.getTabs();
    expect(tabs.length).toEqual(tabsMock.length);
  });

  it('getTabById should return tab by id', () => {
    const tab = service.getTabById('fp_12', true);
    expect(tab.title).toEqual(tabsMock[2].id + ": " + tabsMock[2].title);
  });

  it('getTabById should return NO tab if id exist for FP but request is for Job with same id', () => {
    const tab = service.getTabById('fp_12', false);
    expect(tab).toBeUndefined();
  });

  it('getTabByIndex should return correct tab by index', () => {
    const tab = service.getTabByIndex(4);
    expect(tab.title).toEqual(tabsMock[4].id + ": " + tabsMock[4].title);
  });

  it('getFirstTab should return correct first tab', () => {
    const tab = service.getFirstTab();
    expect(tab.title).toEqual(tabsMock[0].id + ": " + tabsMock[0].title);
  });

  it('updateTab should replace tab at index', () => {
    // GIVEN
    const tabCount = service.getTabs().length;

    expect(service.getIndexOfTab('job_1015', false)).toEqual(3);

    //WHEN
    service.updateTab(mockTab);

    // THEN
    expect(service.getTabById('job_1015', false).title).toEqual( 'job_1015: Analyst 1-0-15-replaced');
    expect(service.getTabs().length).toEqual(tabCount);
  });

  it("should call confirmation show on showMaxTabOpenedDialog", () => {
    //GIVEN
    const showSpy = spyOn(confirmationService, 'show');
    const headerMock = 'tabs.REACH_MAX_TITLE';
    const contentMock = 'tabs.REACH_MAX_MESSAGE';
    const confirmButtonTextMock = 'tabs.OK';

    //WHEN
    service.showMaxTabOpenedDialog();

    //THEN
    expect(showSpy).toHaveBeenCalledWith({
      header: headerMock,
      content: contentMock,
      confirmButtonText: confirmButtonTextMock
    });
  });

  describe('addTabs tests', () => {
    it('should add tab', () => {
      // GIVEN
      const numberOfTabs = service.getTabs().length;

      //WHEN
      service.addTab("id", "name", false);

      // THEN
      expect(service.getTabs().length).toBe(numberOfTabs + 1);
      expect(service.getTabById("id", false)).toBeDefined();
    });

    it('should add tabs separately with same id and different types', () => {
      // GIVEN
      const numberOfTabs = service.getTabs().length;

      //WHEN
      service.addTab("id", "name", false);
      service.addTab("id", "name", true);

      // THEN
      expect(service.getTabs().length).toBe(numberOfTabs + 2);
      const fpTabIx = service.getIndexOfTab("id", true);
      const jobTabIx = service.getIndexOfTab("id", false);
      expect(fpTabIx).not.toEqual(jobTabIx);
      expect(service.getTabById("id", false)).toBeDefined();
    });

    it('should add jobScheduleId to jobs tab if one is provided', () => {
      // GIVEN
      const numberOfTabs = service.getTabs().length;

      //WHEN
      service.addTab("idShed", "jobName", false, "myJobScheduleId");

      // THEN
      expect(service.getTabs().length).toBe(numberOfTabs + 1);

      const scheduledJobTab: Tab = service.getTabById("idShed", false);
      expect(scheduledJobTab.jobScheduleId).toEqual("myJobScheduleId");
    });
  });

  describe('canCreateNewTab tests', () => {
    it('should call showMaxTabOpenedDialog and return false when maxTabsOpened is true on canCreateNewTab', () => {

      //GIVEN
      spyOn(service, 'maxTabsOpened').and.returnValue(true);
      spyOn(service, 'showMaxTabOpenedDialog');

      // WHEN
      const canCreateNewTabResult = service.canCreateNewTab();

      // THEN
      expect(service.showMaxTabOpenedDialog).toHaveBeenCalled();
      expect(canCreateNewTabResult).toBe(false);
    });

    it('should return false when maxTabsOpened is false on canCreateNewTab', () => {

      //GIVEN
      spyOn(service, 'maxTabsOpened').and.returnValue(false);
      spyOn(service, 'showMaxTabOpenedDialog');

      // WHEN
      const canCreateNewTabResult = service.canCreateNewTab();

      // THEN
      expect(canCreateNewTabResult).toBe(true);
    });
  });

  describe('canOpenTab tests', () => {
    it('should return true given maxTabsOpened on canOpenTab WHEN tabs available', () => {

      //GIVEN
      spyOn(service, 'maxTabsOpened').and.returnValue(false);

      // WHEN
      const canOpenTab = service.canOpenTab("abc1", true);

      // THEN
      expect(canOpenTab).toBe(true);
    });

    it('should return true given maxTabsOpened on canOpenTab WHEN tab with that id already opened', () => {

      //GIVEN
      service.addTab(mockTab.id, mockTab.title, mockTab.isFeaturePack);
      spyOn(service, 'maxTabsOpened').and.returnValue(true);

      // WHEN
      const canOpenTab = service.canOpenTab(mockTab.id, mockTab.isFeaturePack);

      // THEN
      expect(canOpenTab).toBe(true);
    });

    it('should return false given maxTabsOpened on canOpenTab WHEN tab with that id already opened for Feature pack BUT attempting to open for job', () => {

      //GIVEN
      service.addTab(mockTab.id, mockTab.title, mockTab.isFeaturePack);
      spyOn(service, 'maxTabsOpened').and.returnValue(true);

      // WHEN
      const canOpenTab = service.canOpenTab(mockTab.id, !mockTab.isFeaturePack);

      // THEN
      expect(canOpenTab).toBe(false);
    });

    it('should return false given maxTabsOpened on canOpenTab WHEN tab with that id NOT opened', () => {

      //GIVEN
      service.addTab(mockTab.id, mockTab.title, true);
      spyOn(service, 'maxTabsOpened').and.returnValue(true);

      // WHEN
      const canOpenTab = service.canOpenTab("abc", true);

      // THEN
      expect(canOpenTab).toBe(false);
    });

  });

  describe('Remove Tabs Tests', () => {

    it('should remove tab', () => {
      // GIVEN
      const numberOfTabs = service.getTabs().length;

      //WHEN
      service.removeTab(tabsMock[0].id, tabsMock[0].isFeaturePack);

      // THEN
      expect(service.getTabs().length).toBe(numberOfTabs - 1);
      expect(service.getTabById(tabsMock[0].id, tabsMock[0].isFeaturePack)).toBeUndefined();
    });

    it('should NOT remove tab if removing for existing id but different type', () => {
      // GIVEN
      const numberOfTabs = service.getTabs().length;

      //WHEN
      // Removing for existing id but opposite type.
      service.removeTab(tabsMock[0].id, !tabsMock[0].isFeaturePack);

      // THEN
      expect(service.getTabs().length).toBe(numberOfTabs);
      expect(service.getTabById(tabsMock[0].id, tabsMock[0].isFeaturePack)).toBeDefined();
    });

    it('removeTabByIndex should remove tab at index', () => {
      //GIVEN
      const tabCount = service.getTabs().length;

      //WHEN
      service.removeTabByIndex(3);

      //THEN
      expect(service.getTabs().length).toEqual(tabCount - 1);
      expect(service.getTabById('job_1015', false)).toBeUndefined();
    });

    it('noTabsExist should return true when no tabs exist', () => {
      //GIVEN
      tabsMock.forEach(tab => service.removeTab(tab.id, tab.isFeaturePack));

      //WHEN
      const noTabsExist = service.noTabsExist();

      //THEN
      expect(noTabsExist).toBeTrue();
    });

    it('noTabsExist should return false when tabs exist', () => {
      //GIVEN
      tabsMock.forEach(tab => service.addTab(tab.id, tab.title, tab.isFeaturePack, tab.jobScheduleId));

      //WHEN
      const noTabsExist = service.noTabsExist();

      //THEN
      expect(noTabsExist).toBeFalse();
    });

    it('removeAllTabsWithJobScheduleId should remove all tabs with jobScheduleId', () => {
      //GIVEN
      const tabCount = service.getTabs().length;

      //WHEN
      service.removeAllTabsWithJobScheduleId('schedule_1');

      //THEN
      expect(service.getTabs().length).toEqual(tabCount - 5);
    });
  });

  describe('Maximum Tabs Tests', () => {

    it('getMaxTabs should return the runTime property value when present', () => {
      // GIVEN
      service._maxTabs = undefined;
      configLoaderService.getRuntimePropertiesInstant = () => {
        return { maxNavigationTabs: 10 };
      }
      // WHEN
      const maxTabs = service.getMaxTabs();

      // THEN
      expect(maxTabs).toEqual(10);
    });

    it('getMaxTabs should return the default fallback value when can not find runTimeProperty', () => {

      // GIVEN
      service._FALLBACK_MAX_TABS = 15;
      service._maxTabs = undefined;

      // WHEN
      const maxTabs = service.getMaxTabs();

      // THEN
      expect(maxTabs).toEqual(15);
    });

    it('getMaxTabs should return the lazy loaded value when already known', () => {

      // GIVEN
      service._FALLBACK_MAX_TABS = 15;
      service._maxTabs = 33;

      // WHEN
      const maxTabs = service.getMaxTabs();

      // THEN
      expect(maxTabs).toEqual(33);
    });

    it("maxTabsOpened should return true when tabs length is maxTabs", () => {
      // GIVEN
      service._maxTabs = 14;
      // add 13 tabs
      tabsMock.forEach(tab => service.addTab(tab.id, tab.title, tab.isFeaturePack, tab.jobScheduleId));
      expect(service.maxTabsOpened()).toBeFalse();

      // WHEN
      service.addTab('id_new', "nameMockNew", true);

      // THEN
      expect(service.maxTabsOpened()).toBeTrue();
    });
  });

});
