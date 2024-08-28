import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AdvanceSearchValue, SearchFilter } from './components/search-filter/search-filter.model';
import { AdvanceSearchFormField } from '@erad/components';

/**
 * Contains the Advanced search components. It consists of
 * 1) The search bar
 * 2) The advanced search button which opens advanced search (filter)
 * 2) The search tabs
 *
 * When search is set, tabs will appear with the search attributes.
 * Search attributes can be cleared by closing the tab.
 */
@Component({
  selector: 'dnr-search',
  templateUrl: './search.component.html',
})
export class SearchComponent {

  @Input() filter: SearchFilter = {};
  @Input() searchFields: AdvanceSearchFormField[] = [];
  @Input() placeholder: string = null;

  @Output() quickSearch = new EventEmitter<string>();
  @Output() searchFilterChanged = new EventEmitter<SearchFilter>();

  constructor() { }

  onQuickSearchClicked(event: string) {
    this.quickSearch.emit(event);
  }

  onChangeFilter(event : SearchFilter){
    this.filter = event;
    this.searchFilterChanged.emit(this.filter);
  }

  onAdvanceSearchClicked(event: AdvanceSearchValue[] = []) {
    this.filter = {};
    event.forEach(v => this.filter[v.key] = this._getFilterValue(v));
    this.searchFilterChanged.emit(this.filter);
  }

  // Add wildcards to string values.
  // DO NOT ADD to number values (IDs are longs and cannot handle wildcards)
  _getFilterValue(searchValue: AdvanceSearchValue ): string {
    return (this.searchFields.find(field => field.key === searchValue.key)?.type === 'string')
      ? `*${searchValue.value}*`
      : searchValue.value;
  }

}
