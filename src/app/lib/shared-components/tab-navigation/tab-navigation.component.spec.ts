import { ActionItem, ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { Renderer2 } from '@angular/core';
import { TabNavigationComponent } from './tab-navigation.component';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';

describe('TabNavigationComponent', () => {
  let component: TabNavigationComponent;
  let fixture: ComponentFixture<TabNavigationComponent>;
  let contextAction: ActionItem;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModuleMock],
      declarations: [TabNavigationComponent],
      providers: [
        TabsService,
        Renderer2,
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
      ],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should (not) emit tab index when tab selected (as using click method instead) - should enable + nav button', () => {

    // GIVEN
    const tabSelectedEmitterSpy = spyOn(component.tabChange, 'emit');
    component.disableAddSign = true;

    // WHEN
    component.onTabChanged(1);

    // THEN
    expect(tabSelectedEmitterSpy).not.toHaveBeenCalledWith(1);
    expect(component.disableAddSign).toBeFalse();
    expect(component.addSignIconPath).toEqual('./assets/icons/add-sign-icon.svg');
  });

  it('should emit reachedMaxTabs when exceeds max tabs', () => {

    // GIVEN
    const reachedMaxTabsEmitterSpy = spyOn(component.reachedMaxTabs, 'emit');
    spyOn(component.tabsService, 'getMaxTabs').and.returnValue(4);
    component.disableAddSign = true;

    // WHEN
    component.onTabChanged(4);

    // THEN
    expect(reachedMaxTabsEmitterSpy).toHaveBeenCalled();
    expect(component.disableAddSign).toBeFalse();
    expect(component.addSignIconPath).toEqual('./assets/icons/add-sign-icon.svg');

  });

  it('should emit add sign icon clicked', () => {

    // GIVEN
    const addSignEmitterSpy = spyOn(component.addSignClick, 'emit');

    // WHEN
    component.onAddSignClick();

    // THEN
    expect(addSignEmitterSpy).toHaveBeenCalled();

  });

  it('should emit the number of remaining tabs when tab is closed', () => {

    // GIVEN
    spyOn(component.totalTabsOpened, 'emit');
    spyOn(component.tabsService, 'getTabs').and.returnValue(
      [{ id: 'tab1', title: 'tab1' },
       { id: 'tab3', title: 'tab3' }, { id: 'tab3', title: 'tab3' }]);

    // WHEN
    component.onTabClosed(3);

    // THEN
    expect(component.totalTabsOpened.emit).toHaveBeenCalledWith(3);
  });

  it('should keep session storage for storageNamesToKeep', () => {
    // GIVEN
    window.sessionStorage.setItem("tab_job1", JSON.stringify({ "limit": '20' }));
    window.sessionStorage.setItem("tab_job2", JSON.stringify({ "limit": '30'}));
    window.sessionStorage.setItem("tab_job3", JSON.stringify({ "limit": '50'}));

    // WHEN
    component._keepTabSessionStorage(["tab_job1", "tab_job3"]);

    expect(window.sessionStorage.getItem("tab_job1")).toEqual('{"limit":"20"}');
    expect(window.sessionStorage.getItem("tab_job2")).toBeNull();
    expect(window.sessionStorage.getItem("tab_job3")).toEqual('{"limit":"50"}');
  });

  it('should emit the action when onActionsClicked method is called', () => {

    // GIVEN
    spyOn(component.contextActionClicked, 'emit');

    // WHEN
    component.onActionsClicked(contextAction);

    // THEN
    expect(component.contextActionClicked.emit).toHaveBeenCalledWith(contextAction);
  });

  describe("tab rendering tests", () => {

    it("onTab click should render tab as active again (add active class if not present)", () => {
      // GIVEN
      const tabClickEvent = new MouseEvent("click", { bubbles: true });
      component.disableAddSign = true;

      const targetElement = document.createElement('div');
      targetElement.innerHTML = "Tab 1";
      Object.defineProperty(tabClickEvent, 'target', { writable: false, value: targetElement });

      const activeRenderedTabLabel = document.createElement('div');
      activeRenderedTabLabel.textContent = "Tab 1";

      component.activeRenderedTabLabel = activeRenderedTabLabel;

      // WHEN
      component.onTabClicked(tabClickEvent);

      // THEN
      expect(activeRenderedTabLabel.classList.contains('mat-tab-label-active')).toBeTrue();
      expect(component.disableAddSign).toBeFalse();
      expect(component.addSignIconPath).toEqual('./assets/icons/add-sign-icon.svg');
    });

    it("onTab click should remove activeRenderedTabLabel if new tab selection does not match old selection", () => {
      // GIVEN
      const tabClickEvent = new MouseEvent("click", { bubbles: true });
      component.disableAddSign = true;

      const targetElement = document.createElement('div');
      targetElement.innerHTML = "Tab OTHER";
      Object.defineProperty(tabClickEvent, 'target', { writable: false, value: targetElement });

      const activeRenderedTabLabel = document.createElement('div');
      activeRenderedTabLabel.textContent = "Tab 1";

      component.activeRenderedTabLabel = activeRenderedTabLabel;

      // WHEN
      component.onTabClicked(tabClickEvent);

      // THEN
      expect(component.activeRenderedTabLabel).toEqual(undefined);
    });

    it("renderTabsInactive method should render tab as inactive (remove active class)", () => {
      // GIVEN
      const activeRenderedTabLabel = document.createElement('div');
      activeRenderedTabLabel.textContent = "Tab 1";
      activeRenderedTabLabel.classList.add('mat-tab-label', 'mat-tab-label-active');

      component.el.nativeElement.appendChild(activeRenderedTabLabel);

      // WHEN
      component.renderTabsInactive();

      // THEN
      expect(activeRenderedTabLabel.classList.contains('mat-tab-label-active')).toBeFalse();
    });

    it("renderTabsInactive method disables AddSign when called", () => {
      // GIVEN
      component.disableAddSign = false;
      // WHEN
      component.renderTabsInactive();
      // THEN
      expect(component.disableAddSign).toBeTrue();
      expect(component.addSignIconPath).toEqual('./assets/icons/add-sign-icon-disabled.svg');
    });

    it("renderTabsActive method should render tab as inactive (remove active class)", () => {
      // GIVEN
      const activeRenderedTabLabel = document.createElement('div');
      activeRenderedTabLabel.className = "mat-tab-label";
      activeRenderedTabLabel.textContent = "Tab 1";

      component.activeRenderedTabLabel = activeRenderedTabLabel;

      // WHEN
      component.renderTabsActive();

      // THEN
      expect(activeRenderedTabLabel.classList.contains('mat-tab-label-active')).toBeTrue();
    });

    it("renderTabsActive method enabled AddSign when called", () => {
      // GIVEN
      component.disableAddSign = true;
      // WHEN
      component.renderTabsActive();
      // THEN
      expect(component.disableAddSign).toBeFalse();
    });
  });
});
