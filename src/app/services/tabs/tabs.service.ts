import { ConfigLoaderService } from '@erad/core';
import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { Injectable } from '@angular/core';
import { Tab } from './tabs.model';
import { TabNavigationComponent } from 'src/app/lib/shared-components/tab-navigation/tab-navigation.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * Handles Tabs/Pill on Feature Pack/Job details page.
 * Each Tab/Pill is for a different item (.e.g. one tab for a job id)
 **/
@Injectable({
  providedIn: 'root', // avoid duplicates (don't use in any other provider)
})
export class TabsService {

  private tabs: Tab[];
  private tabNavigationComponent: TabNavigationComponent | null = null;

  /* expose for unit testing */
  _maxTabs: number;
  _FALLBACK_MAX_TABS: number = 20;

  constructor(
    private readonly translateService: TranslateService,
    private readonly confirmationService: ConfirmationService,
    private readonly configLoaderService: ConfigLoaderService,
  ) { }

  getTabs(): Tab[] {
    return this.tabs;
  }

  getTabById(id: string, isFeaturePack: boolean = false): Tab {
    return this.tabs?.find(t => t.id === id && t.isFeaturePack === isFeaturePack);
  }

  getTabByIndex(index: number): Tab {
    return this.tabs[index];
  }

  getIndexOfTab(id: string, isFeaturePack: boolean = false): number {
    const index = this.tabs?.findIndex(tab => tab.id === id && tab.isFeaturePack === isFeaturePack);
    return index >= 0 ? index : -1; // extra caution for 0 being interpreted as a falsy
  }

  getFirstTab(): Tab {
    return this.tabs[0]
  }

  /**
   * Add a new tab or update an existing tab.
   * @param id              id of the tab
   * @param name            name of the tab
   * @param isFeaturePack   true if tab is for a feature pack - default false
   *                        (support different types sharing id for as long as only have FP tabs and Jobs tabs)
   *
   * @param jobScheduleId   used to distinguish jobs tabs for jobs that were created using a schedule - default empty
   * @returns  created tab
   */
  addTab(id: string, name: string, isFeaturePack: boolean = false, jobScheduleId: string = ''): Tab {
    if (this.tabExists(id, isFeaturePack)) {
      this.updateTabTitle(id, name, isFeaturePack);
      return this.getTabById(id, isFeaturePack);
    } else {
      const title = this._createTitle(id, name);
      const tab: Tab = {
        title,
        id: id,
        isFeaturePack,
        jobScheduleId
      };
      this._addTab(tab);
      return tab;
    }
  }

  removeTab(id: string, isFeaturePack: boolean = false): void {
    this.removeTabByIndex(this.getIndexOfTab(id, isFeaturePack));
  }

  removeAllTabsWithJobScheduleId(jobScheduleId: string): void {
    const tabsToRemove = this.tabs?.filter(tab => tab?.jobScheduleId === jobScheduleId);
    tabsToRemove?.forEach(tab => {
      this.removeTabByIndex(this._getIndex(tab));
    });
    // there is no where this call could be made from where tabs should look active afterwards
    this.tabNavigationComponent?.renderTabsInactive();
  }

  updateTab(tab: Tab): void {
    const index = this._getIndex(tab);
    if (index >= 0) {
      this.tabs[index] = tab;
    }
  }

  updateTabTitle(id: string, name: string, isFeaturePack: boolean = false) {
    if (this.tabExists(id, isFeaturePack)) {
      this.getTabById(id, isFeaturePack).title = this._createTitle(id, name);
    }
  }

  removeTabByIndex(index: number): void {
    if (this.tabs && index >= 0 && index < this.tabs.length) {
      this.tabs.splice(index, 1);
    }
  }

  removeLastTab(): void {
    this.tabs.pop();
  }

  noTabsExist(): boolean {
    return !this.tabs || this.tabs.length === 0;
  }

  maxTabsOpened(): boolean {
    return this.tabs?.length >= this.getMaxTabs();
  }

  tabExists(id: string, isFeaturePack: boolean = false) {
    return !!this.getTabById(id, isFeaturePack);
  }

  showMaxTabOpenedDialog() {
    this.confirmationService
      .show({
        header: this.translateService.instant('tabs.REACH_MAX_TITLE'),
        content: this.translateService.instant('tabs.REACH_MAX_MESSAGE'),
        confirmButtonText: this.translateService.instant('tabs.OK'),
      })
  }

  setTabNavigationComponent(component: TabNavigationComponent): void {
    this.tabNavigationComponent = component;
  }

  getTabNavigationComponent(): TabNavigationComponent {
    return this.tabNavigationComponent;
  }

  /**
   * Can a tab be opened with the specified id.
   * Tab will be created if it does not exist, otherwise re-opened.
   *
   * @param id - id of object for new tab
   * @returns true if tab can be created OR if tab already exists with that id.
   */
  canOpenTab(id: string, isFeaturePack: boolean = false): boolean {
    if (this.tabExists(id, isFeaturePack)) {
      return true;
    }
    return this.canCreateNewTab();
  }

  canCreateNewTab(): boolean {
    if (this.maxTabsOpened()) {
      this.showMaxTabOpenedDialog();
      return false;
    }
    return true;
  }

  /**
  * Reads max navigation tabs from runtime properties
  * @returns  max number of tabs allowed
  */
  getMaxTabs(): number {
    if (!this._maxTabs) { /* lazy loaded */
      const runtimeProperties = this.configLoaderService?.getRuntimePropertiesInstant();
      const configuredKey = parseInt(runtimeProperties?.maxNavigationTabs);
      this._maxTabs = !Number.isNaN(configuredKey) ? configuredKey : this._FALLBACK_MAX_TABS;
    }
    return this._maxTabs;
  }

  _addTab(tab: Tab) {
    if (!this.tabs) {
      this.tabs = [];
    }
    this.tabs.push(tab);
  }

  _createTitle(id: string, name: string) {
    return id + ((name) ? ': ' + name : '');
  }

  _getIndex(tab: Tab): number {
    return this.getIndexOfTab(tab?.id, tab?.isFeaturePack);
  }

}
