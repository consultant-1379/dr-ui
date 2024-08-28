import { AdvanceSearchFormField } from '@erad/components';
import { SearchFilter } from '../search/components/search-filter/search-filter.model';
import { AppConstants, localStorageKeys } from 'src/app/constants';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { EntityTranslateName, EntityType } from 'src/app/enums/entity-type.enum';
import { Item, SelectionType } from '@erad/components/common';
import { PageIndexDetail, Row, TableColumnData } from '../dnr-table/table-view.model';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import {
  persistObjectInLocalStore,
  retrieveLocalStorageTableColumns,
  retrieveLocalStoreObject
} from 'src/app/utils/local-store.utils';

import { AppItemDetailFacadeService } from './model/app-item-detail-facade-service.interface';
import { AppItemTableViewService } from './services/app-item-table-view.service';
import { AppItemsFacadeService } from './model/app-items-facade-service.interface';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DnrTableActionItem } from '../dnr-table/dnr-table-button.model';
import { QueryParams } from 'src/app/models/query.params.model';
import { RbacService } from 'src/app/services/rbac.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { TablePaginationParams } from 'src/app/models/table.params.model';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'dnr-app-item-table-view',
  templateUrl: './app-item-table-view.component.html',
  styleUrls: ['./app-item-table-view.component.scss']
})
@UnsubscribeAware()
export class AppItemTableViewComponent<T, StatusModel> implements OnInit {
  @Input() forceReload: boolean;

  // TODO EEIBKY REMOVE entity... should send in the strings e.g. storage key...
  @Input() entity: string = EntityType.FP;
  @Input() appItemsFacadeService: AppItemsFacadeService;
  @Input() appItemDetailFacadeService: AppItemDetailFacadeService;
  @Input() emptyTableMessage: string = `${EntityTranslateName.FeaturePack}.EMPTY_TABLE_MESSAGE`;
  @Input() actionItems: DnrTableActionItem[];
  @Input() filter: SearchFilter = {};
  @Input() defaultSort: string | null = "-name";
  @Input() searchFieldPlaceholder: string = null;
  @Input() selectionType = SelectionType.Single;  // default (not boolean - ERAD has 3 types)
  @Input() searchFields: AdvanceSearchFormField[] = [];

  @Output() selectionChanged = new EventEmitter<T[]>();
  @Output() tableActionClick = new EventEmitter<Array<T | string>>();
  @Output() quickSearch = new EventEmitter<string>();
  @Output() searchFilterChanged = new EventEmitter<SearchFilter>();

  // general
  loading = false;
  failure: DnrFailure = null;

  // search / filter
  advanceSearchImage = './assets/icons/advanced_search.svg';
  isEmptyFilterResult = false;
  cancelLabel = this.translateService.instant("buttons.CANCEL");
  searchLabel = this.translateService.instant("buttons.SEARCH");

  // Table Data
  columnsConfig: TableColumnData[];
  localStorageKey: string = null;
  items: T[] = [];

  selectedItems: string[] = [];
  displayRows: any[] = [];

  tableActions: () => any;
  tablePaginationParams: TablePaginationParams;
  actionItemToggler = false;
  subscriptions: Subscription[] = [];

  pageQueryParams: QueryParams;
  defaultQueryParams: QueryParams = JSON.parse(JSON.stringify(AppConstants.defaultQueryParams)); // deep copy


  constructor(
    readonly translateService: TranslateService,
    readonly appItemTableViewService: AppItemTableViewService<T, StatusModel>,
    readonly rbacService: RbacService) { }

  ngOnInit() {
    this._resetTableData();
    this._initSubscriptions();
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes?.defaultSort) {
      this.defaultQueryParams.sort = this.defaultSort;
    }

    this._onEntityTypeChange(changes?.entity);

    this._initSubscriptions();  // TODO eeicmsy is this a good place for this ??

    if (changes?.filter || changes?.defaultSort) {
      this._handleFilterChange();
    } else if (!changes?.entity) { /* prevent repeat call to #reloadTableItems if made already */
      this._onForceReload(changes?.forceReload);
    }
  }

  _getEmptyTableMessage() {
    if (this._isFilterSet()) {
      return ""; /* use info message component instead for this situation */
    }

    switch (this.entity) {
      case EntityType.FP:
        return this.rbacService.isAdmin() ? `${EntityTranslateName.FeaturePack}.EMPTY_TABLE_MESSAGE_ADMIN_USER` : `${EntityTranslateName.FeaturePack}.EMPTY_TABLE_MESSAGE`;
      case EntityType.JBS:
        return this.translateService.instant(`${EntityTranslateName.Job}.EMPTY_TABLE_MESSAGE`);
      case EntityType.SCHEDULES:
        return this.translateService.instant(`${EntityTranslateName.Schedule}.EMPTY_TABLE_MESSAGE`);
      default:
        return this.translateService.instant('GENERAL_EMPTY_TABLE_MESSAGE');
    }
  }

  /**
   * Only admin user can create, update or install Feature packs
   * For other types - only need regular write access
   */
  _hasAccess() {
    // TODO more Entity dependency - to be removed as part of that task
    // (refetching RBAC as one class per table type)
    return (this.entity === EntityType.FP) ? this.rbacService.isAdmin() : this.rbacService.isReadWrite();
  }

  /**
   * This is always called on reload browser. Not interested
   * in preserving a previous offset for this table (because the
   * data may have changed - so reset from 0 offset and pageNumber 1 always)
   * @param entityChanges   FP or Jobs Table change  (or launch of UI)
   */
  _onEntityTypeChange(entityChanges?: SimpleChange) {
    if (entityChanges?.currentValue !== entityChanges?.previousValue) {
      this.appItemTableViewService.entityType = this.entity;

      /* all table types supporting by this class: */
      this.localStorageKey = null;
      if (this.entity === EntityType.FP) {
        this.localStorageKey = localStorageKeys.FP_TABLE_SETTINGS
      } else if (this.entity === EntityType.JBS) {
        this.localStorageKey = localStorageKeys.JOBS_TABLE_SETTINGS;
      } else if (this.entity === EntityType.SCHEDULES) {
        this.localStorageKey = localStorageKeys.SCHEDULES_TABLE_SETTINGS;
      }

      this.emptyTableMessage = this._getEmptyTableMessage();
      this.clearSelection();  // this will close flyout also
      this._resetPaginationData();

      this.columnsConfig = this._getTableColumnsConfig();
      /* table right click context menu (same access as context buttons) */
      this.tableActions = this._hasAccess() ? this._createMenuItems.bind(this) : () => [];
      this.reloadTableItems();
    }
  }

  _onForceReload(forceReloadChanges: SimpleChange) {
    if (forceReloadChanges?.currentValue) {
      this.actionItemToggler = false;
      this._resetTableData();
      this.reloadTableItems();
    }
  }

  _resetTableData() {
    this.items = [];
    this.displayRows = [];
    this.failure = null;
    /*  leave selectedItems as will try and get panel information back */
    this._resetPaginationData();
  }

  _resetPaginationData() {
    const storedParams = retrieveLocalStoreObject(this.localStorageKey);

    this.pageQueryParams = storedParams?.queryParams || this.defaultQueryParams;

    this.tablePaginationParams = storedParams?.tablePaginationParams || {
      currentPage: 1,
      itemsCount: 0,
      numberOfPages: 1
    };

    this._setFilterInPageQueryParams();

    if (!storedParams) {
      this._persistPageData();
    }
  }

  private _setFilterInPageQueryParams() {
    let filters = undefined;
    if (this._isFilterSet()) {
      filters = Object.entries(this.filter)
        .map(([key, value]) => `${key}==${value}`)
        .join(";"); // FIQL search so ; = AND and , = OR

      this.pageQueryParams = {
        ...this.pageQueryParams,
        filters,
      };
    } else {
      this.pageQueryParams = {
        ...this.pageQueryParams
      }
      delete this.pageQueryParams.filters;
    }
  }

  /**
   * Create context menu items
   *
   * Note actionItem.allowForStatus can be undefined to allow all through
   * as would be the case for a "force" delete for example
   *
   * @param row  (optional) status field in row may be used to
   *             determine which menu items are applicable to the row
   * @returns    menu items applicable to the row
   * @see dnr-table actions property
   */
  _createMenuItems(row?: Row): Item[] {
    if (row?.status) {
      return this.actionItems
        .filter((actionItem: DnrTableActionItem) => this._isCommandAllowedForStatus(row.status, actionItem.allowForStatus))
        .map((i) => this._setItem(i));
    }
    /* e.g. Feature pack table does not have a status field */
    return this.actionItems.map((actionItem: DnrTableActionItem) => this._setItem(actionItem));
  }

  /**
   * Check if a command is allowed for a status based on allowForStatus content
   * If allowForStatus is not defined then allow all statuses
   *
   * @param status           e.g. 'Reconcile in progress'  (if translated already)
   * @param allowForStatus   e.g. ['COMPLETED', 'DISCOVERY_FAILED', 'DISCOVERED', 'NEW', 'PARTIALLY_RECONCILED', 'RECONCILE_REQUESTED']
   * @returns                if command is allowed (e.g for right click context menu)
   */
  _isCommandAllowedForStatus(status: string, allowForStatus?: string[]) {
    return !allowForStatus || allowForStatus.includes(status) || this._i18nTranslatedStatusArray(allowForStatus).includes(status);
  }

  _i18nTranslatedStatusArray(i18nStatusKeys: string[]) {
    return i18nStatusKeys.map((status) => this.translateService.instant(`state.${status}`));
  }

  private _setItem(item: DnrTableActionItem): Item {
    return {
      label: this.translateService.instant('buttons.' + item.label),
      value: item.label,
    };
  }

  onConfigChanged(settingConfig: any) {
    this.columnsConfig = settingConfig ? [...settingConfig] : this.columnsConfig;
    persistObjectInLocalStore(this.localStorageKey, { columns: this.columnsConfig });
  }

  onSortChanged(sort: string) {
    this.pageQueryParams = {
      ...this.pageQueryParams,
      sort,
    };
    this._persistPageData();
    this.reloadTableItems();
  }

  onSearchFilterChanged(event : SearchFilter) {
    this.filter = event;
    this._handleFilterChange();
    this.searchFilterChanged.emit(this.filter);
  }

  _handleFilterChange(){
    this._setFilterInPageQueryParams();
    this.emptyTableMessage = this._getEmptyTableMessage(); // reset
    this.reloadTableItems();
  }

  onPageChanged(pageIndexDetail: PageIndexDetail) {
    if (pageIndexDetail.currentPage === 0) {
      // Guard here to prevent multiple server calls during load sequence)
      return;
    }

    const currentPage = pageIndexDetail.currentPage || 1;
    const numberOfPages = Math.ceil(this.tablePaginationParams.itemsCount / Number(pageIndexDetail.numEntries));

    this.tablePaginationParams = {
      ...this.tablePaginationParams,
      currentPage,
      numberOfPages
    };

    const limit: number = pageIndexDetail.numEntries || 10;
    // Page 1 has offset of 0
    const offset: number = (pageIndexDetail.currentPage - 1) * Number(limit);

    this.pageQueryParams = {
      ...this.pageQueryParams,
      offset,
      limit
    };

    this._persistPageData();
    this.reloadTableItems();
  }

  clearSelection() {
    this.displayRows.forEach(row => row.selected = false);
    this.displayRows = [...this.displayRows];
    this.onSelectionChanged([]);
  }

  onSelectionChanged(items: any) {
    this.selectedItems = items.map((item) => item['id']);
    /* context buttons (not right click menu) */
    this.actionItemToggler = this._hasAccess() && !!this.selectedItems.length;
    this.selectionChanged.emit(items); /* pass full row objects (or empty if unselect)*/
  }

  /**
   * Right click context menu action click
   * (as apposed to the context button)
   */
  onActionClicked(event: any) {
    this.tableActionClick.emit([event.row, event?.action?.value || '']);
  }

  /**
   * Reload table items, e.g. on refresh clicked, and
   * reload side panel (details) information for same id (if single row selected)
   */
  reloadTableItems(): void {
    const selectedRows = this._getSelectedRowsFromCurrentPage();
    this.appItemsFacadeService.loadItems(this.pageQueryParams);

    if (selectedRows.length === 1){
      this.appItemDetailFacadeService.clearFailureState();
      this.appItemDetailFacadeService.loadDetails(selectedRows[0].id);
    }
  }

  _getSelectedRowsFromCurrentPage(){
    // (row.selected not set in this.displayRows or could use that as filter)
    return this.displayRows.filter(row => this.selectedItems.includes(row.id));
  }

  /**
   * Reload table items on refresh clicked when inline fail message (and searchbar field) are showing.
   * For search bar (on fail), do not clear filter as user
   * should clear filter search bar to initiate refresh call without filter (if search field
   * entry is causing is failure).
   */
  onReloadTableOnFail (): void {
    this.appItemsFacadeService.loadItems(this.pageQueryParams); // no row is selected
  }

  // Not private as used by unit tests
  _initSubscriptions(): void {
    // We need to manually unsubscribe as the takeUntilDestroyed does not work (until one leaves
    // the main landing page) as when switching from Job table to Feature pack table, the page is not
    // being destroyed, it is being updated with a new appItemsFacadeService.
    // Every time one switches between Job and FP tables, this page initiates new subscriptions for
    // the new type, so need to unsubscribe from the old type, otherwise the number of subscriptions
    // will increase eternally (i.e. a memory leak).
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    if (this.appItemsFacadeService) {
      this._subscribeToGetItemsLoading();
      this._subscribeToGetItems();
      this._subscribeToGetItemCount();
      this._subscribeToGetItemsFailure();
    }
  }

  private _subscribeToGetItemsLoading() {
    this.subscriptions.push(this.appItemsFacadeService
      .getItemsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => this.loading = loading));
  }

  private _subscribeToGetItems() {
    this.subscriptions.push(this.appItemsFacadeService
      .getItems()
      .pipe(takeUntilDestroyed(this))
      .subscribe((items) => {
        // TODO eeicmsy caching both items and displayRows seems excessive
        this.items = items;
        this.displayRows = this._createDisplayRows(items);

        this.isEmptyFilterResult = this._isFilterSet() && this.displayRows?.length === 0;

        if (this.displayRows?.length === 0) {
          this.clearSelection();

          // auto select row if single row (but only if it is because of search result)
        } else if (this._isFilterSet() && this.displayRows?.length === 1) {
          /* have to ensure that do not enter here again, when press a create button,
             or the create panel will not show - since selection means you want to see details */
          this.onSelectionChanged([this.items[0]]);
        }
      }));
  }

  private _subscribeToGetItemCount() {
    this.subscriptions.push(this.appItemsFacadeService
      .getItemsTotalCount()
      .pipe(
        // Don't have to worry if == 0 as won't show pagination.
        filter(count => count > 0),
        takeUntilDestroyed(this))
      .subscribe((count) => {
        const numberOfPages = Math.ceil(count / Number(this.pageQueryParams.limit)) || 1;
        // If no data returned for current page, reset the page number
        const currentPageInvalid = this._isCurrentPageInvalid(numberOfPages);
        const currentPage = (currentPageInvalid) ? 1 : this.tablePaginationParams.currentPage;
        this.tablePaginationParams = {
          itemsCount: count,
          currentPage,
          numberOfPages
        };

        const offset: number = (currentPage - 1) * Number(this.pageQueryParams.limit);
        this.pageQueryParams = {
          ...this.pageQueryParams,
          offset,
          limit: this.pageQueryParams.limit
        };

        this._persistPageData();

        if (currentPageInvalid) {
          this.reloadTableItems();
        }
      }));
  }

  private _subscribeToGetItemsFailure() {
    this.subscriptions.push(this.appItemsFacadeService
      .getItemsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure) => {
        this.failure = failure;
        if (this.failure) {
          this.clearSelection();
        }
      }));
  }

  private _isCurrentPageInvalid(numberOfPages) {
    // lowest page number = 1, so 1 is always valid
    return (!this.tablePaginationParams
      || (this.tablePaginationParams.currentPage > 1
        && this.tablePaginationParams.currentPage > numberOfPages));
  }

  private _createDisplayRows(data: any[]): any[] {
    return data?.map((row) => this.appItemTableViewService.createDisplayRow(row)) || [];
  }

  _persistPageData() {
    const queryParams = { ...this.pageQueryParams };
    delete queryParams.filters; // do not persist filters.

    const storeData = {
      tablePaginationParams: this.tablePaginationParams,
      queryParams
    };
    persistObjectInLocalStore(this.localStorageKey, storeData);
  }

  _getTableColumnsConfig() {
    const columnsConfig = this.appItemTableViewService.getColumnsConfig();
    // pass column meta data to retrieve call to put back cell functions if required
    return retrieveLocalStorageTableColumns(this.localStorageKey, this.translateService, this.pageQueryParams.sort, columnsConfig);
  }

  private _isFilterSet() {
    return (!!this.filter && Object.keys(this.filter).length > 0);
  }
}
