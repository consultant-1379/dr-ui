import { Button, Dialog, Menu, MenuItem, Pill, Tooltip } from '@eui/base';
import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  CustomProperties,
  PageIndexDetail,
  TableActionEvent,
  TableColumnData,
} from './table-view.model';
import { Item, SelectionType } from '@erad/components/common';
import {
  ListTableStyles,
  ListTileStyles,
  listMenuStylesAfter,
  listMenuStylesBefore,
} from './table-view.component.config';
import { Pagination, Setting, Table } from '@eui/table';

import { AppConstants } from 'src/app/constants';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DnrTableActionItem } from './dnr-table-button.model';
import { Icon } from '@eui/theme';
import { QueryParams } from 'src/app/models/query.params.model';
import { TablePaginationParams } from 'src/app/models/table.params.model';
import { TableSortType } from './table-view.enum';
import { TableSubtitleComponent } from './table-subtitle/table-subtitle.component';
import { Tile } from '@eui/layout';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dnr-table',
  templateUrl: './dnr-table.component.html',
  styleUrls: ['./dnr-table.component.scss']
})
export class DnrTableComponent implements OnInit, OnChanges {

  @Input() data: any[] = [];
  @Input() displayRows: any[] = [];
  @Input() actionItems: any | DnrTableActionItem[] = [];
  @Input() emptyTableMessage: string = ''; // don't show message in filter scenario
  @Input() failure: DnrFailure;
  @Input() selectedItems: string[] = [];
  @Input() columnsConfig: TableColumnData[];
  @Input() selectionType: SelectionType = SelectionType.Multiple;
  @Input() showFilter = true;
  @Input() showResultsCount = true;
  @Input() showSortSelector = true;

  @Input() tablePaginationParams: TablePaginationParams = {
    currentPage: 1,
    itemsCount: 0,
    numberOfPages: 0
  };
  @Input() queryParams: QueryParams = AppConstants.defaultQueryParams;

  @Input() hasSettingIconTooltip = true;
  @Input() actions: (item?: any) => Item[];
  @Input() localStorageKey?: string;

  @Output() actionClicked = new EventEmitter<TableActionEvent>();
  @Output() filterIconClicked = new EventEmitter<CustomEvent>();
  @Output() selectionChanged = new EventEmitter<any[]>();
  @Output() sortChanged = new EventEmitter<string>();
  @Output() refreshClicked = new EventEmitter();
  @Output() reloadTableOnFail = new EventEmitter();
  @Output() pageChanged = new EventEmitter<any>();
  @Output() configChanged = new EventEmitter<TableColumnData[]>();
  @Output() clearClicked = new EventEmitter();

  @ViewChild('ListViewTable', { static: true }) tableElement: ElementRef;

  clickInterval = 0;
  allActions: DnrTableActionItem[] = [];
  currentRow: any;
  table: Table;
  tile: Tile;
  timestampOfPreviousClick = new Date().getTime();
  showSettings = false;
  pagination: Pagination;
  pageEntries = []; // for pagination dropdown limit options
  controlsLocale: object;  // for pagination locale
  isMenuInitialized = false;
  selectedRows: any[] = [];
  showEmptyMessage = false;
  tableHeader: HTMLElement;

  constructor(
    private readonly translateService: TranslateService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.pageEntries = AppConstants.pageEntries;

    this.controlsLocale = {
      SPINNER_TEXT: this.translateService.instant('table.GO_TO'),
      DROPDOWN_TEXT: this.translateService.instant('table.SHOW'),
      DROPDOWN_LABEL: this.translateService.instant('table.ENTRIES_PER_PAGE'),
    };

    this._buildTable();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (changes?.data?.currentValue || changes?.displayRows?.currentValue) {
      if (this.table && !this.failure) {
        this._clearNativeTableElementHtml();
        this._buildTable();
      }
    }

    if (changes?.actionItems?.currentValue || changes?.selectedItems?.currentValue) {
      this.allActions = changes.actionItems?.currentValue || this.allActions;
      this.actionItems = [...this._filterActions([...this.allActions])];
      this._preBuildActionOperation();
    }

    if (changes.selectedItems || changes.tablePaginationParams) {
      this._buildTileSubtitle();
    }
  }

  onReloadTableOnFail(): void {
     // keep consistent with pageQueryParams clear in app-item-table-view.component.ts
     this.queryParams = AppConstants.defaultQueryParams;
     this.reloadTableOnFail.emit();
  };

  onRefresh(): void {
    this.refreshClicked.emit()
  }

  /* exposed for junit */
  _clearNativeTableElementHtml() {
    this.tableElement.nativeElement.innerHTML = '';
  }

  _preBuildActionOperation() {
    this.tile?.shadowRoot?.querySelectorAll('.tile__header__right slot eui-button').forEach(item => {
      item.remove();
    });
    this._buildActionButtons();
  }

  // TODO right click context menu action needs to be filtered also for status (same a context button)
  // hiding the context buttons based upon status in the row
  // (warning expects attribute name for state to be "status")
  _filterActions(_actions: DnrTableActionItem[]): DnrTableActionItem[] {
    const _actionFilter = (row) => {
      return _actions.filter(action => {
        if (action?.allowForStatus?.length) {
          const rowStatus = row['status'];
          return (action.allowForStatus.includes(rowStatus));
        }
        return true;
      });
    }

    if (this.selectionType === SelectionType.Single) {
      return _actionFilter(this.selectedRows[0]);
    } else {
      // assume SelectionType.Multiple
      return this.selectedRows.reduce((result, row) => {
        const filtered = _actionFilter(row);
        return result.filter(action => filtered.includes(action));
      }, _actions);
    }
  }

  _buildTable(): void {
    this._removeEvents();
    this.table = new Table();
    this.table.components = { 'eui-pill': Pill, 'eui-tooltip': Tooltip };
    this.table.slot = 'content';
    this.table.expandable = false;
    this.table.resizable = true;
    this.table.striped = false;
    this.table.customRowHeight = (this.table.compact) ? null : 48;
    this.table.sortable = this.showSortSelector;
    this.table.columns = this.columnsConfig;
    this._updateTableData();

    if (this.selectionType === SelectionType.Multiple) {
      this.table.multiSelect = true;
    } else if (this.selectionType === SelectionType.Single) {
      this.table.singleSelect = true;
    }

    this._buildTile();
    this._buildPagination();
    this._buildMenu();
    this._bindEvents();
  }

  _buildMenu(): void {
    const menu = new Menu();
    menu.slot = 'context-menu';
    menu.id = 'actions-menu';
    menu.part = 'actions-menu';
    this.table.appendChild(menu);
  }

  /**
   * Need to keep pagination choice on a table refresh,
   * or page change - but for a reload want the page 1 (in case data changed)
   *
   * Can not seem to get eui-table:page-index-change event using html
   * so using this method to create the pagination component via javascript
   */
  _buildPagination(): void {
    // should nothing to remove here as empties html
    this.tableElement.nativeElement.querySelector('eui-pagination')?.remove();


    this.pagination = document.createElement('eui-pagination');
    this.pagination.controlsLocale = this.controlsLocale;

    this.pagination.numEntries = this.queryParams.limit || 10;
    this.pagination.currentPage = this.tablePaginationParams.currentPage || 1;
    this.pagination.numPages = this.tablePaginationParams.numberOfPages || 0;
    this.pagination.pageEntries = this._updateCheckedPage();

    this.pagination.addEventListener(
      'eui-table:page-index-change', this._paginationPageIndexChange.bind(this)
    );
    this.pagination.style.display = 'flex';
    this.pagination.style.justifyContent = 'center';
    this.pagination.style.outline = 'none';

    // pagination should in in pagination-group slot in table shadowRoot (but makes no difference)
    this.tableElement.nativeElement.appendChild(this.pagination);
  }

  _updateCheckedPage() {
    return this.pageEntries.map(entry => {
      entry.checked = entry.value === this.pagination.numEntries;
      return entry;
    });
  }

  /**
   * EUI table "eui-table:page-index-change" event handler
   *
   * @param event  containing state in detail, e.g. {
   *  currentPage : 1   (same as pageNumber)
   *  hasNextPage: false
   *  hasPreviousPage:false
   *  numEntries:50 (same as itemsPerPage and limit)
   *  numPages:1  (newState.numPages seems to be 1 always - so calculating instead )
   *  pageClicked:"1"
   * }
   */
  _paginationPageIndexChange(event: any): void {
    const newState: PageIndexDetail = event.detail.state;
    this.pageChanged.emit(newState);
  }

  _buildSettings(): void {
    const button = new Button();
    const dialog = new Dialog();
    const tableSetting = this._createTableSettings();
    const tooltip = new Tooltip();
    const icon = new Icon();
    const settings = this.translateService.instant(
      'table.SETTINGS'
    );

    const settingAttributes: CustomProperties = {
      'hide-all': this.translateService.instant(
        'table.HIDE_ALL'
      ),
      'show-all': this.translateService.instant(
        'table.SHOW_ALL'
      ),
      'sub-heading': this.translateService.instant(
        'table.COLUMNS'
      ),
      'visibility-action-tooltip': this.translateService.instant(
        'table.VISIBILITY_TOOLTIP'
      ),
      slot: 'content'
    };

    const tooltipAttributes: CustomProperties = {
      delay: '10',
      message: settings,
      slot: 'action',
      visible: this.hasSettingIconTooltip ? '' : 'never'
    };

    const ButtonAttributes: CustomProperties = {
      id: 'apply-settings',
      primary: 'true',
      slot: 'bottom'
    };

    this.setAttribute(ButtonAttributes, button);
    this.setAttribute(settingAttributes, tableSetting);
    this.setAttribute(tooltipAttributes, tooltip);
    icon.name = 'settings';
    icon.className = 'list-view-icon-settings';
    button.innerHTML = this.translateService.instant(
      'buttons.APPLY'
    );

    tableSetting.addEventListener('eui-table-setting:apply', (_event: any) => {
      dialog.show = false;

      this.columnsConfig = _event.detail.value.map(newColumn => {
        const oldColumn = this.columnsConfig?.find(oldCol => oldCol?.attribute === newColumn?.attribute);
        newColumn.cell = oldColumn?.cell;
        return newColumn;
      });
      this.table.columns = this.columnsConfig;
      this.configChanged.emit(this.columnsConfig);
    });

    button.addEventListener('click', () => {
      tableSetting.apply();
    });

    icon.addEventListener('click', () => {
      tableSetting.columns = this.columnsConfig;
      dialog.show = !this.showSettings;
    });

    dialog.label = settings;
    dialog.show = this.showSettings;
    dialog.appendChild(button);
    dialog.appendChild(tableSetting);
    dialog.addEventListener(
      'eui-table-setting:apply',
      this.onFilterIconClicked.bind(this)
    );

    tooltip.appendChild(icon);
    this.tableElement.nativeElement.appendChild(dialog);
    this.tile.shadowRoot
      .querySelector('.tile__header__right')
      .appendChild(tooltip);
  }

  /* for unit test */
  _createTableSettings(): Setting {
    return new Setting();
  }

  _buildActionButtons() {
    this.actionItems.forEach((actionButton: DnrTableActionItem, index: number) => {
      const button = new Button();
      button.name = `table-button-${actionButton.label || 'eui'}`;
      button.className = `table-view-button`;
      button.id = actionButton.id;
      if (actionButton?.icon) {
        button.icon = actionButton.icon;
      }
      button.tabIndex = index;
      button.innerHTML = this.translateService.instant(
        `buttons.${actionButton.label}`
      );
      if (actionButton?.handler && typeof actionButton.handler === 'function') {
        button.addEventListener('click', (event) => {
          event.stopPropagation();
          actionButton.handler(actionButton.label);
        });
      }
      this.tile?.shadowRoot
        .querySelector('.tile__header__right slot')
        .appendChild(button);
    });
  }

  _buildTileSubtitle(): void {
    if (!this.tile) {
      return;
    }

    const targetDiv = this._getTileSubtitleDiv();
    const subtitleComponent = targetDiv.querySelector('dnr-table-subtitle');
    if (subtitleComponent) {
      targetDiv.removeChild(subtitleComponent);
    }

    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TableSubtitleComponent);

    // Create and attach the component to the container
    const subTitleComponentRef = this.viewContainerRef.createComponent(componentFactory);

    // Access the native element of the component
    const componentNativeElement = (subTitleComponentRef.hostView as any).rootNodes[0] as HTMLElement;

    subTitleComponentRef.instance.itemsPerPage = this.queryParams.limit
    subTitleComponentRef.instance.currentPage = this.tablePaginationParams.currentPage;
    subTitleComponentRef.instance.itemsCount = this.tablePaginationParams.itemsCount;
    subTitleComponentRef.instance.selectedItemsCount = this.selectedItems.length;

    subTitleComponentRef.instance.clearClicked.subscribe(() => {
      this.clearClicked.emit();
    });
    targetDiv.appendChild(componentNativeElement);
  }

  // for unit test.
  _getTileSubtitleDiv() {
    return this.tile.shadowRoot.querySelector('.tile__header__left__subtitle');
  }

  _buildTile(): void {
    this.tile = new Tile();

    if (this.showResultsCount) {
      this._buildTileSubtitle();
    }
    if (this.actionItems.length) {
      this._buildActionButtons();
    }
    if (this.showFilter) {
      this._buildSettings();
    }

    const reload = new Icon();
    reload.name = 'reload';
    reload.className = 'list-view-icon-reload';

    const reloadTooltip = new Tooltip();
    reloadTooltip.message = this.translateService.instant('RELOAD_TABLE');
    reloadTooltip.appendChild(reload);
    this.tile.shadowRoot.querySelector('#left').appendChild(reloadTooltip);
    reload.addEventListener('click', this.onRefresh.bind(this));

    // For some reason, reload button not appearing.
    const leftPanelControls = this.tile.shadowRoot.querySelector('.left-panel-controls');
    leftPanelControls.style.display = 'contents';

    const tileStyle = document.createElement('style');
    tileStyle.innerHTML = ListTileStyles;
    this.tile.shadowRoot.appendChild(tileStyle);
    this.tile.appendChild(this.table);

    this.tableElement.nativeElement.appendChild(this.tile);
    this.tableElement.nativeElement.querySelector(
      'eui-table'
    ).shadowRoot.innerHTML = ListTableStyles;
  }

  _bindEvents(): void {
    this.table.addEventListener(
      'eui-table:contextmenu',
      this.showActionMenu.bind(this)
    );
    this.table.addEventListener(
      'eui-table:row-select',
      this.onRowSelected.bind(this)
    );
    this.table.addEventListener(
      'eui-table:sort',
      this.onSortChanged.bind(this)
    );
    this.table.addEventListener(
      'mouseup',
      this._onTableColumnResize.bind(this)
    );
  }

  _removeEvents(): void {
    if (this.pagination) {
      this.pagination.removeEventListener('eui-table:page-index-change', this._paginationPageIndexChange.bind(this));
      delete this.pagination;
    }
    if (this.table) {
      this.table.removeEventListener(
        'eui-table:contextmenu',
        this.showActionMenu.bind(this)
      );
      this.table.removeEventListener(
        'eui-table:row-select',
        this.onRowSelected.bind(this)
      );
      this.table.removeEventListener(
        'eui-table:sort',
        this.onSortChanged.bind(this)
      );
      this.table.removeEventListener(
        'mouseup',
        this._onTableColumnResize.bind(this)
      );
      if (this.tableHeader) {
        this.tableHeader.removeEventListener('mouseup', this._onTableColumnResize.bind(this));
        delete this.tableHeader;
      }
      delete this.table;
    }
  }

  onFilterIconClicked(event: CustomEvent): void {
    this.filterIconClicked.emit(event);
  }

  onSortChanged(event: CustomEvent): void {
    const dir = event.detail.sort === TableSortType.ASC ? '+' : '-';
    const sort = dir + event.detail.column.attribute;
    this.sortChanged.emit(sort);
  }

  onRowSelected(event: CustomEvent): void {
    const selectedRows = [];
    for (const row of event.detail) {
      selectedRows.push(this.getRow(row, this.data));
    }
    this.selectedRows = selectedRows;
    this.selectionChanged.emit(selectedRows);
  }

  /**
   * Persist table column width change after resize
   *
   * (E-UI SDK has no event for column resize end
   * and we have to wait until the table header is loaded (with no access
   * to SDK lifecycle methods)) before can add listener for mouseup event
   * on the header part of the table where resize controls are located)
   *
   * @param event  mouse up event on the table target initially and
   *               tableHeader once E-UI SDK has loaded it
   */
  _onTableColumnResize(event: MouseEvent): void {

    const targetElement: HTMLElement = event?.target as HTMLElement;

    if (!this.tableHeader) {
      this.tableHeader = this.table.tableHeader || targetElement?.shadowRoot?.querySelector('thead');

      if (this.tableHeader) {
        this.tableHeader.addEventListener('mouseup', this._onTableColumnResize.bind(this));
        targetElement.removeEventListener('mouseup', this._onTableColumnResize.bind(this));
        /* action for for first mouseup on table target
           (will not do any harm if that is a row selection mouseup (as apposed to header))*/
        this.configChanged.emit(this.table.columns);
      }
    }

    /* only on header mouse up updates from now on */
    if (targetElement?.classList?.contains('th__resize-control')) {
      this.configChanged.emit(this.table.columns);
    }
  }

  showActionMenu(event: CustomEvent): void {
    this.currentRow = this.getRow(event.detail.row, this.data);
    event.detail.menu.querySelectorAll('eui-menu-item').forEach(item => {
      item.remove();
    });
    const menuItems = this.actions(event.detail.row);
    if (menuItems && menuItems.length > 0) {
      menuItems.forEach(item => {
        const menuItem = new MenuItem();
        menuItem.label = item.label;
        menuItem.value = item.value;
        menuItem.addEventListener(
          'eui-menuItem:click',
          this.actionMenuEvent.bind(this)
        );
        event.detail.menu?.appendChild(menuItem);
      });
      event.detail.menu.show = true;
      this.isMenuInitialized = this.isMenuInitialized
        ? true
        : this.initializeMenuStyle();
    } else {
      this.tableElement.nativeElement
        .querySelector('eui-table').shadowRoot
        .querySelector('tbody')
        .querySelector('.hover-effect').classList
        .remove('hover-effect');
    }
  }

  getRow(value: any, data: any[]): any {
    return data?.find(
      (row: any) =>
        // Discovered objects table has id as 'objectId', other tables have id as 'id'
        (row.objectId) ? row.objectId === value.objectId : row.id === value.id
    );
  }

  actionMenuEvent(event: CustomEvent): void {
    const target = event.target as unknown as MenuItem;
    this.actionClicked.emit({
      action: {
        label: target.label,
        value: target.value
      },
      row: this.selectedItems?.length == 1 ? this.currentRow : null
    });
  }

  setAttribute(attributes: CustomProperties, element: any): void {
    Object.keys(attributes).forEach(key => {
      element.setAttribute(key, attributes[key]);
    });
  }

  private initializeMenuStyle(): boolean {
    const styleBefore = document.createElement('style');
    styleBefore.innerHTML = listMenuStylesBefore;
    this.tableElement.nativeElement.querySelector('eui-table').shadowRoot.appendChild(styleBefore);
    setTimeout(() => {
      const styleAfter = document.createElement('style');
      styleAfter.innerHTML = listMenuStylesAfter;
      this.tableElement.nativeElement.querySelector('eui-table').shadowRoot.appendChild(styleAfter);
    }, 5);
    return true;
  }

  getTableClassName() {
    if (this.failure !== null) {
      return 'table-failure';
    } else if (this.failure === null && this.showEmptyMessage) {
      return 'table-no-data';
    }
    return '';
  }

  /* expose for junit */
  _updateTableData() {
    this.table.data = this.displayRows;
    this.showEmptyMessage = this.displayRows?.length === 0;
    this.table.compact = this.displayRows?.length > 20;
    this.table.customRowHeight = (this.table.compact) ? null : 48;
    this._reselectRows(this.selectedItems);
  }

  /**
   * When a table is reloaded following a refresh or poll,
   * or on page change, selected row(s) must still appear selected.
   * We must reselect any row(s) that were selected before,
   * on this page, if they can be found on the new page dataset.
   * (currently paginated tables only allow cherry pick selection on one page,
   * but if that is not the case - this method should not affect overall selected item label count)
   *
   * @param selectedItems   current selected ids (id or objectId in the case of discovered objects)
   */
  _reselectRows(selectedItems: string[]): void {
    const foundRows = this.displayRows?.filter(row => selectedItems.indexOf(row.id) >= 0 || selectedItems.indexOf(row.objectId) >= 0);

    if (foundRows.length > 0) {
      foundRows.forEach(row => row.selected = true);  // includes SelectionType.Single case
    }
  }
}
