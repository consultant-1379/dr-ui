import { ApplicationJob, ApplicationProperty } from 'src/app/models/application.model';
import { ColumnsConfig, DiscoveredObjectsActionsType } from './discovered-objects-table.component.config';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Item, SelectionType } from '@erad/components/common';
import {
  PageIndexDetail,
  TableActionEvent,
  TableColumnData,
} from '../dnr-table/table-view.model';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { localStorageKeys, sessionStorageKeys } from 'src/app/constants';
import { persistObjectInLocalStore, retrieveLocalStoreObject } from 'src/app/utils/local-store.utils';
import {
  persistObjectInSessionStore,
  retrieveSessionStorageTableColumns,
  retrieveSessionStoreObject
} from 'src/app/utils/session-store.utils';

import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DiscoveredObjectsFacadeService } from 'src/app/lib/discovery-objects/services/discovered-objects-facade.service';
import { DiscoveredObjectsStatus } from 'src/app/models/enums/discovered-objects-status.enum';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DnrTableActionItem } from '../dnr-table/dnr-table-button.model';
import { Job } from 'src/app/models/job.model';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { QueryParams } from 'src/app/models/query.params.model';
import { StateColors } from 'src/app/models/enums/state-colors.enum';
import { TablePaginationParams } from 'src/app/models/table.params.model';
import { TableUtilsService } from '../../services/table-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { tooltipCell } from '../dnr-table/table-view.component.config';

@Component({
  selector: 'dnr-discovered-objects-table',
  templateUrl: './discovered-objects-table.component.html',
})
@UnsubscribeAware()
export class DiscoveredObjectsTableComponent implements OnInit, OnChanges {
  @Input() job: Job;

  // Show right click menu on table rows
  @Input() showRightContextMenu: boolean;

  @Input() actionItems: any | DnrTableActionItem[] = [];

  // Event sent when GET returns data itemCount > 0
  @Output() dataLoaded = new EventEmitter<boolean>();

  @Output() refreshClicked = new EventEmitter();
  @Output() selectionChanged = new EventEmitter<DiscoveredObjects[]>();
  @Output() reconcileClicked = new EventEmitter();

  // general
  selectionType = SelectionType.Multiple;
  failure: DnrFailure = null;

  /* used to store pagination limits for dynamic discovery table
    - to remain for as long as navigation tab exists (even when table destroyed)
    (if user shuts down browser without closing tab - need to be removed) */
  sessionStorageName: string = null;

  // Table Data
  columnsConfig = ColumnsConfig;
  discoveredObjects: DiscoveredObjects[] = [];
  displayRows: any[] = [];
  getMenuItems: () => any;
  selectedItems: string[] = [];

  waitingForResponse = true;

  objectsLoading = false;
  appLoading = false;

  // pagination
  tablePaginationParams: TablePaginationParams;
  pageQueryParams: QueryParams;

  constructor(
    private readonly translateService: TranslateService,
    private readonly tableUtils: TableUtilsService<DiscoveredObjectsStatus>,
    private readonly discoveredObjectsService: DiscoveredObjectsFacadeService,
    private readonly applicationsFacadeService: ApplicationDetailsFacadeService
  ) { }

  ngOnInit() {
    this.getMenuItems = this.createMenuItems.bind(this);
    this._initSubscriptions();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.job?.currentValue) {
      this.job = changes.job.currentValue;
      this.sessionStorageName = this.job ? sessionStorageKeys.tabSessionStoragePrefix+this.job.name : null;
      /* dynamic tab change - changes the job id*/
      if (changes.job.currentValue?.id !== changes.job?.previousValue?.id) {
        this._reset();
      }
      this.reloadTableItems();
    }
  }

  /**
   * Resolve issue with dynamic tab navigation changes
   * using data from table on previous tab. Must
   * - close the current flyout,
   * - ensure selected item label is not one from previous table
   * - ensure paginated page selected is not one from previous table (ensure reset to first page in case data changed)
   * - can keep previous selected limit (10, 20, 50, 100) - read from LOCAL STORE.
  */
  _reset() {

    this.applicationsFacadeService.loadApplicationDetails(this.job.featurePackId, this.job.applicationId);

    this.clearSelection();  // this will close flyout also

    const storedParams = retrieveSessionStoreObject(this.sessionStorageName);
    this.pageQueryParams = storedParams?.queryParams || {
      limit: 10,
      offset: 0,
    };
    const localStoreLimit = retrieveLocalStoreObject(localStorageKeys.DISCOVERY_OBJECTS_LIMIT)?.limit;
    this.pageQueryParams.limit = localStoreLimit || this.pageQueryParams.limit;

    this.tablePaginationParams = storedParams?.tablePaginationParams || {
      currentPage: 1,
      itemsCount: 0,
      numberOfPages: 1
    };
  }

  private createMenuItems(): Item[] {
    const menuItems = [];
    if (this.showRightContextMenu && this.selectedItems?.length > 0) {
      menuItems.push(this._setItem(DiscoveredObjectsActionsType.RECONCILE));
    }
    return menuItems;
  }

  onMenuClicked(event: TableActionEvent) {
    if (event.action.value === DiscoveredObjectsActionsType.RECONCILE) {
      this.reconcileClicked.emit();  // no point in emitting event.row (multiple select table - selected item(s) are known)
    }
  }

  private _setItem(item: DiscoveredObjectsActionsType): Item {
    return {
      label: this.translateService.instant('buttons.' + item),
      value: item
    };
  }

  onConfigChanged(settingConfig: TableColumnData[]) {
    this.columnsConfig = (settingConfig) ? [...settingConfig] : ColumnsConfig;
    persistObjectInSessionStore(this.sessionStorageName, { columns: this.columnsConfig });
  }

  onSortChanged(sort: string) {
    this.pageQueryParams = {
      ...this.pageQueryParams,
      sort,
    };
    this._persistPageData();
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
      itemsCount: this.tablePaginationParams.itemsCount,
      currentPage,
      numberOfPages
    };

    const limit: number = pageIndexDetail.numEntries || 10;
    // Page 1 has offset of 0
    const offset: number = (this.tablePaginationParams.currentPage - 1) * limit;
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

  onSelectionChanged(items: DiscoveredObjects[]) {
    this.selectedItems = items.map(item => item.objectId);
    this.selectionChanged.emit(items);
  }

  reloadTableItems(): void {
    this.waitingForResponse = this._isDiscoveryInProgress();
    this.discoveredObjectsService.loadDiscoveredObjects(this.job.id, this.pageQueryParams);
  }

  onRefreshClicked(): void {
    this.refreshClicked.emit();
  }

  getItemsCount(): number {
    return this.tablePaginationParams?.itemsCount || 0;
  }

  /* exposed for junit */
  _initSubscriptions(): void {

    this.discoveredObjectsService
      .getDiscoveredObjects()
      .pipe(
        filter(o => !!o),
        takeUntilDestroyed(this))
      .subscribe(dObjects => {
        this.discoveredObjects = dObjects;
        this.failure = null;

        if (dObjects.length === 0) {
          this.clearSelection();
          this.waitingForResponse = this._isDiscoveryInProgress();

        } else if (dObjects.length > 0) {
          this.waitingForResponse = false;
        }
        this.displayRows = this._createDisplayRows(dObjects);
        this.dataLoaded.emit(dObjects?.length > 0)
      }
    );

    this.discoveredObjectsService
      .getDiscoveredObjectsTotalCount()
      .pipe(
        // Don't have to worry if == 0 as won't show pagination.
        filter(count => count > 0),
        takeUntilDestroyed(this))
      .subscribe(count => {
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
      }
    );

    this.applicationsFacadeService
      .getApplicationDetails()
      .pipe(
        filter(app => !!app),
        takeUntilDestroyed(this))
      .subscribe(app => {
        const appForJob: ApplicationJob = app.jobs.find(job => job.name === this.job?.applicationJobName);
        if (appForJob?.api?.properties) {
          this.columnsConfig = this._addPropertiesToSettingsColumns(appForJob?.api?.properties);
        }
      });

    this.discoveredObjectsService
      .getDiscoveredObjectsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe(failure => {
        this._handleFailure(failure);
      }
    );

    this.applicationsFacadeService
      .getApplicationDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe(failure => {
        this._handleFailure(failure);
      }
    );

    this.discoveredObjectsService
      .getDiscoveredObjectsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe(loading => {
        this.objectsLoading = loading;
        if (loading) {
          this.dataLoaded.emit(!this.objectsLoading && !this.appLoading);
        }
      }
    );

    this.applicationsFacadeService
      .getApplicationDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe(loading => {
        this.appLoading = loading;
        if (loading) {
          this.dataLoaded.emit(!this.objectsLoading && !this.appLoading);
        }
      }
    );
  }

  private _isCurrentPageInvalid(numberOfPages) {
    // lowest page number = 1, so 1 is always valid
    return (!this.tablePaginationParams
      || (this.tablePaginationParams.currentPage > 1
        && this.tablePaginationParams.currentPage > numberOfPages));
  }

  _handleFailure(failure) {
    this.failure = failure
    if (this.failure) {
      this.waitingForResponse = false;
      this.dataLoaded.emit(false);
      this.clearSelection();
    }
  }

  /* exposed for junit */
  _createDisplayRows(data: DiscoveredObjects[]): any[] {
    return data?.map(row => this._createDisplayRow(row));
  }

  /**
   * Create discovered object row object for display.
   * Assumes dObject.discrepancies is a mandatory array and dObject.properties
   * should not be null as mandatory in API schema
   *
   * @param dObject   server object with row data (not null)
   * @returns         row object
   */
  private _createDisplayRow(dObject: DiscoveredObjects) {

    const row = {
      objectId: dObject.objectId,
      discrepancies: dObject.discrepancies.join(', '),
      statusColor: dObject.status ? StateColors[dObject.status] : undefined,
      // cannot use this.tableUtils.getTranslatedStatus(dObject?.status) with DiscoveredObjects type (expects JobStatus)
      status: dObject.status ? this.translateService.instant('state.' + dObject?.status) : '',
      statusWithoutTranslation: dObject.status,
    };

    Object.entries(dObject.properties).forEach(([key, value]) => {
      row[key] = value;
    });

    return row;
  }

  _isDiscoveryInProgress() {
    return (this.job?.status === undefined ||
      this.job.status === null ||
      this.job.status === JobStatus.NEW ||
      this.job.status === JobStatus.DISCOVERY_INPROGRESS);
  }

  _persistPageData() {
    const objectToStore = {
      tablePaginationParams: this.tablePaginationParams,
      queryParams: this.pageQueryParams
    }

    // Limit applies to all pages so store in local store.
    persistObjectInLocalStore(localStorageKeys.DISCOVERY_OBJECTS_LIMIT, { limit: this.pageQueryParams.limit });
    // Other pagination params only apply to each specific instance of a table.
    // I.e. can have 10 object tables, each with its own pagination data, but all with the same table limit.
    persistObjectInSessionStore(this.sessionStorageName, objectToStore);
  }

  private _addPropertiesToSettingsColumns(props: [ApplicationProperty]): TableColumnData[] {
    let columns = [...ColumnsConfig];

    columns.forEach(col => col.title = this.translateService.instant(col.title));

    props.forEach(prop =>
      columns.push({
        title: this.tableUtils.getAttributeTranslationIfPresent('discoveredObjects', prop.name),
        attribute: prop.name,
        width: '200px', // using "px" in place of "em" works better when resizable columns (avoids horizontal scroll bar when not needed)
        hidden: false,
        cell: tooltipCell
      })
    )
    return this._getTableColumnsConfig(columns);
  }

  _getTableColumnsConfig(columnsConfig: TableColumnData[]) {
    // pass column meta data to retrieve call to put back cell functions if required
    return retrieveSessionStorageTableColumns(this.sessionStorageName, this.translateService, this.pageQueryParams.sort, columnsConfig);
  }
}
