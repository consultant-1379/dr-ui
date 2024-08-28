import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';

import { ActionItem } from '@erad/components';
import { SearchFilter } from '../search-filter/search-filter.model';
import { TabsData } from '@erad/components/tabs';
import { TranslateService } from '@ngx-translate/core';

/**
 * Displays tabs representing advance search
 * filter selection from SearchFilterComponent
 *
 * When tabs are removed - emit new filter
 *
 * @see search-filter.component.ts
 */
@Component({
  selector: 'dnr-search-filter-tabs',
  templateUrl: './search-filter-tabs.component.html',
  styleUrls: ['./search-filter-tabs.component.scss']
})
export class SearchFilterTabsComponent implements OnInit {

  /**
   * Name Values pairs object representing the
   * current search filter
   * @see search-filter.component.ts filter
   */
  @Input() filter: SearchFilter = {};

  /**
   * Output from ActionItem (kebab icon),
   * to clear all filters
   */
  @Output() clearAllFilters = new EventEmitter();

  /**
   * Output on tab removal, to emit
   * a new advance search filter based on remaining tabs
   */
  @Output() changeFilter = new EventEmitter<SearchFilter>();

  tabs: TabsData[] = [];

  contextActions: ActionItem[] = [];
  clearAllActionItem: ActionItem;
  _CLEAR_ALL_ACTION_VALUE: string = "clearAll";

  constructor(
    readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this._addContextActions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.filter?.currentValue) {
      this._setTabs();
    }
  }

  /**
   * Handle "kebab" context menu actions
   * @param event  actionItem clicked
   */
  onActionClicked(event: ActionItem) {
    if (event.value === this._CLEAR_ALL_ACTION_VALUE) {
      this.filter = {};
      this.tabs = [];
      this.clearAllFilters.emit();
    }
  }

  /**
   * Handle tab closed
   * Tabs[index] will be the tab gone.
   *
   * The filters object still has reference
   * Emit changed filter
   *
   * @param index  index of tab just closed  (erad does not pass tab content)
   */
  onTabClosed(index: number): void {
    const entries = Object.entries(this.filter);

    if (index < 0 || index >= entries.length) {
      console.error('#onTabClosed Index out of bounds');
      return;
    }
    entries.splice(index, 1);
    this.filter = Object.fromEntries(entries);
    this.changeFilter.emit(this.filter);
  }

  private _addContextActions() {
    this.clearAllActionItem = {
      label: this.translateService.instant("CLEAR_ALL_SEARCH_FILTERS"),
      value: this._CLEAR_ALL_ACTION_VALUE
    };
    this.contextActions.push(this.clearAllActionItem);
  }

  private _setTabs() {
    this.tabs = [];
    Object.keys(this.filter).forEach((key) => {

      const value = this._removeWildCards(this.filter[key]);
      const displayValue = this.isStatusKey(key) ? this._i18nConvertState(value) : value;

      /* TODO no support to change matTooltip in current erad-tab version
         displaying full key pair - adding it as title here instead of displayValue*/
      const fullDisplayValue = `${key}: ${displayValue}`

      const tab = {
        title: fullDisplayValue,
        content: null,
      };

      this.tabs.push(tab);
    });
  }

  _removeWildCards(searchValue: string) {
    return searchValue?.replace(/\*/g, "").trim();
  }

  private isStatusKey(key: string): boolean {
    return key === 'status';
  }

  private _i18nConvertState(value: string): string {
    return this.translateService.instant(`state.${value}`);
  }
}
