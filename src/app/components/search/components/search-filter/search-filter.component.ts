import { AdvanceSearchFormField, FieldType, SearchBarComponent, ViewStyle } from '@erad/components';
import { AdvanceSearchValue, SearchFilter } from './search-filter.model';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { validationConstants } from 'src/app/constants';

@Component({
  selector: 'dnr-search-filter',
  templateUrl: './search-filter.component.html'
})

/**
 * This handles both quick search (the search bar above the table),
 * and Advanced Search (the 'filter' icon to the left of the search bar).
 *
 * Advanced search fields are defined in the 'searchFields' property.
 * If there are no 'searchFields' then it is assumed there is only quick
 * search and no advanced search.
 */
export class SearchFilterComponent implements OnInit, OnChanges {

  @Input() searchFields: AdvanceSearchFormField[] = [];
  @Input() filter: SearchFilter = {}; // name values pairs for current search filter.
  @Input() placeholder: string = this.translateService.instant('DEFAULT_SEARCH_PLACEHOLDER');

  @Output() quickSearch = new EventEmitter<string>();
  @Output() advanceSearch = new EventEmitter<AdvanceSearchValue[]>();

  @ViewChild('searchBar') searchBar: SearchBarComponent;

  isAdvanceSearch: boolean;
  viewStyle = ViewStyle.Bordered;

  quickSearchValue = '';

  constructor(
    readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.isAdvanceSearch = this.searchFields?.length > 0;
    this.searchFields = (this.isAdvanceSearch) ? this._createSearchFields() : null;
    this._setFilters();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.filter?.currentValue) {
      this._setFilters();
    }
  }

  private _setFilters() {
    this.quickSearchValue = (this._shouldShowNameInQuickSearch())
      ? this._getBasicFilterValue('name')
      : '';

    if (this.isAdvanceSearch) {
      let advanceSearchValues = '';
      Object.keys(this.filter).forEach((key) =>
        advanceSearchValues += key + ':"' + this._getBasicFilterValue(key) + '"');
      this._setAdvanceSearchFilter(advanceSearchValues);
    }
  }

  // Get filter value without '*'
  private _getBasicFilterValue(key: string) {
    // Not using replaceAll as that is only in ECMAScript 2021 (ES12).
    return this.filter[key].replace(/\*/g, '').trim();
  }

  // separated out for unit test
  _setAdvanceSearchFilter(advanceSearchValues: string) {
    //  Add delay as doesn't work immediately. Perhaps component is being created/recreated?
    setTimeout(() =>
      this.searchBar?.setAdvanceFormValue(advanceSearchValues), 200);
  }

  // Only show name in quick search textfield if name is the only search item,
  // or if the search is for name and a specific Id (i.e. id without *).
  // A search for a specific id is used when for example clicking a FP ID to go to
  // the feature pack table with a FP ID already selected.
  _shouldShowNameInQuickSearch() {
    const keys = Object.keys(this.filter);

    return !!((keys?.length === 1 && this.filter.name)
      || (keys?.length === 2 &&
          this.filter.name &&
          this.filter.id &&
          this.filter.id.indexOf('*') < 0));
  }

  private _createSearchFields(): AdvanceSearchFormField[] {

    return this.searchFields.map(field => ({
      ...field,
      label: this.translateService.instant(field.label), // instant returns field.label if not found
      fieldType: (field.fieldOptions?.length > 0) ? FieldType.singleSelect : FieldType.input,
      fieldOptions: this._translateFieldOptions(field.fieldOptions),
      placeholder: this._getPlaceholder(field),
      fieldValidation: this._getFieldValidation(field)
    }));
  }

  // Add number placeholder if type is number and no other placeholder.
  _getPlaceholder(field: AdvanceSearchFormField) {
    return (field.placeholder)
      ? this.translateService.instant(field.placeholder)
      : (field.type === 'number')
        ? this.translateService.instant('NUMBER_SEARCH_PLACEHOLDER')
        : undefined;
  }

  _getFieldValidation(field: AdvanceSearchFormField) {
    if (field.type === 'number') {
      return {
        regex: validationConstants.validNumber,
        errorMessage: this.translateService.instant('INVALID_NUMBER_TOO_LARGE')
      }
    }
    return {
      regex: validationConstants.safeStringPattern,
      errorMessage: this.translateService.instant('INVALID_VALUES_IN_INPUT',
        { chars: validationConstants.invalidInputCharDisplay })
    };
  }

  _translateFieldOptions(options = []) {
    return options.map(field =>
    ({
      ...field,
      key: (field.key) ? this.translateService.instant(field.key) : undefined
    }));
  }

  onSearchClicked(event: any) {
    this.quickSearchValue = event;
    this.quickSearch.emit(event);
  }

  onAdvanceSearchClicked(event: any) {
    const searchObj: AdvanceSearchValue[] = Object.keys(event)
      .filter(key => event[key]?.length > 0)
      .map(key => ({
        label: this._getSearchLabel(key),
        key,
        value: event[key]
      }));

    // no advanced search values entered
    if (searchObj.length === 0 && this.searchBar.value) {
        // TODO - assuming name attribute exists.
        // Will revisit when doing Discovered Objects table...
      this.searchBar.setAdvanceFormValue(`name:"${this.searchBar.value}"`);
      searchObj.push({
        label: this._getSearchLabel('name'),
        key: 'name',
        value: this.searchBar.value
      });
      this.quickSearchValue = this.searchBar.value;

    } else {
      this.quickSearchValue = '';
    }

    this.advanceSearch.emit(searchObj);
  }

  private _getSearchLabel(key: string) {
    return this.searchFields.find(field => field.key === key)?.label || key;
  }
}
