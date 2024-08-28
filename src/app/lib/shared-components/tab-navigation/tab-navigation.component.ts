import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';

import { ActionItem } from '@erad/components';
import { Tab } from 'src/app/services/tabs/tabs.model';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { sessionStorageKeys } from 'src/app/constants/app.constants';

@Component({
  selector: 'dnr-tab-navigation',
  templateUrl: './tab-navigation.component.html',
  styleUrls: ['./tab-navigation.component.scss'],
})
export class TabNavigationComponent implements AfterViewInit {
  @Input() id: string;
  @Input() selectedIndex: number;
  @Input() showAddSignIcon = true;
  @Input() tabs: any;
  @Input() contextActions: ActionItem[] = [];
  @Output() addSignClick = new EventEmitter<void>();
  @Output() tabChange = new EventEmitter<number>();
  @Output() totalTabsOpened = new EventEmitter<number>();
  @Output() reachedMaxTabs = new EventEmitter<void>();
  @Output() contextActionClicked = new EventEmitter<ActionItem>();

  dialogValue: boolean;
  activeRenderedTabLabel: HTMLElement;
  addSignIconPath: string = './assets/icons/add-sign-icon.svg';
  disableAddSign: boolean;


  // TODO (ideally in erad-tabs) - they should have some kind of tabindex type
  // functionality related to
  // support keyboard navigation through a tab list

  // Also ERAD TabsComponent itself writes selected tab index into local storage (will see "undefined": value in local storage
  // when select a tab - its not coming from dr-ui code
  // (would not want this in local storage - fortunate it is using undefined as an id key or would clutter local storage completely over time and
  // seems ids would clash with previous session ids))


  constructor(
    readonly tabsService: TabsService,
    readonly renderer: Renderer2,
    readonly el: ElementRef
  ) { }

  ngAfterViewInit(): void {
    this.tabsService.setTabNavigationComponent(this);
  }

  onAddSignClick(): void {
    this.addSignClick.emit();
  }

  /**
   * Note handle selection tab with a click event instead
   * (this one kicks in when new tab is attempted to be added)
   * @param newTabIndex   new tab index
   */
  onTabChanged(newTabIndex: number): void {
    this.selectedIndex = newTabIndex;
    this._disableAddSign(false);

    const maxTabs: number = this.tabsService.getMaxTabs();
    if (maxTabs && newTabIndex > maxTabs - 1) {
      this.reachedMaxTabs.emit();
    }
  }

   /**
   * Not a tab changed event listener, as want same tab selection
   * to have an affect when not in the objects table (when in home screen),
   * i.e. so can do back to the objects page for that tab.
   * (as tabChange listener only fires when changing selection)
   *
   * If coming from home screen back into the object table on this click
   * (navigation component is being presented on home screen with tabs all gray),
   * need to enable the home screen navigation add-sign
   * button again (was disabled in home screen) so user can get back to home screen.
   */
  onTabClicked(event: MouseEvent): void {
    event?.stopPropagation();

    if (this._isSelectingPreviousDisabledTab(event)) {
      this.renderTabsActive();
    } else {
      delete this.activeRenderedTabLabel;
    }
    this._disableAddSign(false);
    this.tabChange.emit(this.selectedIndex);
  }

   /**
   * Disable the + icon beside the pills. This icon is for
   * navigation to the home page.
   * When not applicable (i.e. on the home page), the icon
   * needs to be is disabled.
   * @param disable true to disable the icon, false to enable it
   */
   _disableAddSign(disable: boolean) {
    this.disableAddSign = disable;
    this.addSignIconPath = (disable) ? './assets/icons/add-sign-icon-disabled.svg' : './assets/icons/add-sign-icon.svg';
  }

  _isSelectingPreviousDisabledTab(event) {
    const selectedTabLabel: HTMLElement = (event.target as HTMLElement);
    return (this.activeRenderedTabLabel?.textContent === selectedTabLabel?.textContent);
  }

  /**
   * Handle tab closed
   * Emit a totalTabsOpened event to emit count of tabs remaining (not index of tab just closed)
   *
   * Keep remaining tabs table session storage (loose the one just closed)
   *
   * @param index  index of tab just closed
   */
  onTabClosed(index: number): void {
    const tabs: Tab[] = this.tabsService.getTabs();
    this._keepTabSessionStorage(tabs.map(t => sessionStorageKeys.tabSessionStoragePrefix + t.title));

    if (index >= 0) { /* not really needing index but method signature needs it */
      this.totalTabsOpened.emit(tabs?.length || 0);
    }
  }

  _keepTabSessionStorage (storageNamesToKeep: string[]){
    const currentKeys = Object.keys(window.sessionStorage);
    for (let currentKey of currentKeys) {
        if (currentKey.startsWith(sessionStorageKeys.tabSessionStoragePrefix) && !storageNamesToKeep.includes(currentKey)){
            window.sessionStorage.removeItem(currentKey);
        }
    }
  }

  onActionsClicked(contextAction: ActionItem) {
    this.contextActionClicked.emit(contextAction);
  }

  /**
   * When in page where tab is relevant (e.g. discovery table), the selected tab
   * should be rendered, but on the home screens (feature pack table, jobs table),
   * the tab should be inactive,
   * i.e. only clicking the tab should make it active (and bring user back to relevant page)
   */
  renderTabsInactive() {
    this._disableAddSign(true);
    this.activeRenderedTabLabel = this._getTabLabel();
    if (this.activeRenderedTabLabel) {
      this.renderer.removeClass(this.activeRenderedTabLabel, 'mat-tab-label-active');
    }
  }

  renderTabsActive() {
    this._disableAddSign(false);
    if (this.activeRenderedTabLabel) {
      this.renderer.addClass(this.activeRenderedTabLabel, 'mat-tab-label-active');
      delete this.activeRenderedTabLabel;
    }
  }

  _getTabLabel(): HTMLElement {
    return this.el.nativeElement.querySelector('.mat-tab-label.mat-tab-label-active');
  }
}
