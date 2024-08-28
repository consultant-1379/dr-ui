import { AppConstants, localStorageKeys } from 'src/app/constants';
import { Button, Dialog, Menu, MenuItem, Tooltip } from '@eui/base';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import {
  CustomEventMock,
  EntityDetailMockData,
  changesMock,
  mockActions,
  selectedRowMock,
  sortClickedEventAscMock,
  sortClickedEventDescMock,
  tileInnerHTMLMock,
} from './dnr-table.component.mock.data';
import { Pagination, Setting, Table } from '@eui/table';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { _LOCAL_STORAGE_UI_VERSION_ID, _wipeAllDnRLocalStorage } from 'src/app/utils/local-store.utils';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColumnsConfig } from '../discovered-objects-table/discovered-objects-table.component.config';
import { DnrTableComponent } from './dnr-table.component';
import { Icon } from '@eui/theme';
import { SelectionType } from '@erad/components';
import { SharedModule } from 'src/app/shared/shared.module';
import { SimpleChanges } from '@angular/core';
import { Tile } from '@eui/layout';
import { TranslateService } from '@ngx-translate/core';

describe('DnrTableComponent', () => {
  let component: DnrTableComponent;
  let fixture: ComponentFixture<DnrTableComponent>;
  let subtitleDivMock;

  function _registerEUIElements() {

    if (!customElements.get('eui-table')) {
      customElements.define('eui-table', Table);
    }

    if (!customElements.get('eui-tile')) {
      customElements.define('eui-tile', Tile as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-icon')) {
      customElements.define('eui-icon', Icon as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-button')) {
      customElements.define('eui-button', Button as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-dialog')) {
      customElements.define('eui-dialog', Dialog as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-table-setting')) {
      customElements.define('eui-table-setting', Setting as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-pagination')) {
      customElements.define('eui-pagination', Pagination as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-tooltip')) {
      customElements.define('eui-tooltip', Tooltip as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-menu')) {
      customElements.define('eui-menu', Menu as unknown as CustomElementConstructor);
    }

    if (!customElements.get('eui-menu-item')) {
      customElements.define('eui-menu-item', MenuItem as unknown as CustomElementConstructor);
    }
  }

  beforeEach(async () => {
    _registerEUIElements();
    await TestBed.configureTestingModule({
      declarations: [DnrTableComponent],
      imports: [
        TranslateModuleMock,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(DnrTableComponent);
    component = fixture.componentInstance;
    component.columnsConfig = ColumnsConfig;
    component.data = EntityDetailMockData;
    fixture.detectChanges();

    subtitleDivMock = document.createElement('div');
    spyOn(component, '_getTileSubtitleDiv').and.returnValue(subtitleDivMock);
  });

  afterEach(() => {
    fixture.destroy();
    _wipeAllDnRLocalStorage();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges tests', () => {

    beforeEach(() => {
      spyOn(component, '_buildTable').and.callThrough();
      spyOn(component, '_buildActionButtons').and.callThrough();

      component._buildTile();
    });

    it('should reselect selection, and change subtitle on ngOnChanges', () => {
      // GIVEN
      component.selectedItems = ['2', '4'];
      component.displayRows = EntityDetailMockData;
      spyOn(component, '_reselectRows').and.callThrough();
      spyOn(component, '_buildTileSubtitle').and.callThrough();
      // WHEN
      component.ngOnChanges(changesMock);

      // THEN
      expect(component._reselectRows).toHaveBeenCalledWith(['2', '4']);
      expect(component._buildTileSubtitle).toHaveBeenCalled();
    });

    it("data change should remove tableElement reference data in the DOM and build the table again", () => {

      // GIVEN
      const dataMockChange: SimpleChanges = { data: changesMock.data };
      spyOn(component, '_clearNativeTableElementHtml').and.callThrough();

      // WHEN
      component.ngOnChanges(dataMockChange);

      // THEN
      expect(component._buildTable).toHaveBeenCalled();
      expect(component._clearNativeTableElementHtml).toHaveBeenCalled();
    });

    it("actionItem change should allow context buttons when status correct - single-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Single;
      component.selectedRows = [{ id: "1", status: "NEW" }];

      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      // THEN
      expect(component.actionItems.length).toEqual(2);
      expect(component.actionItems[0].label).toEqual("DELETE_JOB");
      expect(component.actionItems[1].label).toEqual("SOME_ACTION");
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("actionItem change should allow context button (single) when status correct - single-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Single;
      component.selectedRows = [{ id: "1", status: "COMPLETED" }];

      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      // THEN
      expect(component.actionItems.length).toEqual(1);
      expect(component.actionItems[0].label).toEqual("DELETE_JOB");
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("actionItem change should create empty actionItems if state not in allowForStatus - single-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Single;
      component.selectedRows = [{ id: "1", status: "IN_PROGRESS" }];

      // IN_PROGRESS not part of allowForStatus item in actionItemsMockChange
      const expectedEmptyActions = [];

      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      expect(component.actionItems).toEqual(expectedEmptyActions);
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("actionItem change should create reduced actionItems if state not in allowForStatus - multi-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Multiple;

      // IN_PROGRESS not part of allowForStatus item in actionItemsMockChange
      component.selectedRows = [{ id: "1", status: "NEW" },
      { id: "2", status: "IN_PROGRESS" },
      { id: "3", status: "DISCOVERED" }];

      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      expect(component.actionItems).toEqual([]);
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("actionItem change should allow all context buttons if states are ok in all rows - multi-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Multiple;

      // IN_PROGRESS not part of allowForStatus item in actionItemsMockChange
      component.selectedRows = [
        { id: "1", status: "NEW" },
        { id: "2", status: "NEW" },
        { id: "3", status: "NEW" }];


      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      expect(component.actionItems.length).toEqual(2);
      expect(component.actionItems[0].label).toEqual("DELETE_JOB");
      expect(component.actionItems[1].label).toEqual("SOME_ACTION");
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("actionItem change should allow all context buttons if states are ok in all rows - multi-select", () => {
      // GIVEN
      const actionItemsMockChange: SimpleChanges = { actionItems: changesMock.actionItems };
      component.selectionType = SelectionType.Multiple;

      // IN_PROGRESS not part of allowForStatus item in actionItemsMockChange
      component.selectedRows = [
        { id: "1", status: "NEW" },
        { id: "2", status: "COMPLETED" },
        { id: "3", status: "DISCOVERED" }];


      // WHEN
      component.ngOnChanges(actionItemsMockChange);

      expect(component.actionItems.length).toEqual(1);
      expect(component.actionItems[0].label).toEqual("DELETE_JOB");
      expect(component._buildActionButtons).toHaveBeenCalled();
    });

    it("selectedItems change should _buildTileSubtitle and call to filter context actions ", () => {
      // GIVEN
      const selectedItemsMockChange: SimpleChanges = { selectedItems: changesMock.selectedItems };
      spyOn(component, '_buildTileSubtitle').and.callThrough();
      spyOn(component, '_preBuildActionOperation').and.callThrough();

      // WHEN
      component.ngOnChanges(selectedItemsMockChange);

      expect(component._buildTileSubtitle).toHaveBeenCalled();
      expect(component._preBuildActionOperation).toHaveBeenCalled();
    });

  });

  it('should reselect selection on _buildTable reload', () => {
    // GIVEN
    component.selectedItems = ['3'];
    component.selectionType = SelectionType.Single;
    component.displayRows = EntityDetailMockData;
    spyOn(component, '_reselectRows').and.callThrough();

    // WHEN
    component._buildTable();

    // THEN
    expect(component._reselectRows).toHaveBeenCalledWith(['3']);
  });

  it('should call _onTableColumnResize and emit config change on table mouse event ', () => {
    // GIVEN
    component.selectionType = SelectionType.Single;
    component.displayRows = EntityDetailMockData;

    spyOn(component, '_onTableColumnResize').and.callThrough();
    const configChangedSpy = spyOn(component.configChanged, 'emit');
    component._buildTable();
    component.table.tableHeader = document.createElement('thead');

    // WHEN
    component.table.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    // THEN
    expect(component._onTableColumnResize).toHaveBeenCalled();
    expect(configChangedSpy).toHaveBeenCalled();
  });

  it('_onTableColumnResize should attach mouse event to table header target when available ', () => {
    // GIVEN
    component.selectionType = SelectionType.Single;
    component.displayRows = EntityDetailMockData;

    spyOn(component, '_onTableColumnResize').and.callThrough();
    const configChangedSpy = spyOn(component.configChanged, 'emit');
    component._buildTable();
    component.table.tableHeader = document.createElement('thead');
    component.table.tableHeader.classList = ['th__resize-control'];

    // WHEN
    component.table.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    // on the header
    component.table.tableHeader.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    // listener gone on whole table (so this should not have an affect)
    component.table.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));

    // THEN
    expect(component._onTableColumnResize).toHaveBeenCalled();
    expect(configChangedSpy).toHaveBeenCalledTimes(2);  // as apposed to three times
  });

  it("Table settings change should change the column hidden attributes", fakeAsync(() => {

    // GIVEN
    const settingStub = new Setting();
    spyOn(component, '_createTableSettings').and.returnValue(settingStub);

    component.localStorageKey = localStorageKeys.JUNIT1;
    component.columnsConfig = ColumnsConfig;

    let newColumns = [...ColumnsConfig];
    newColumns.forEach((column) => { column.hidden = true; });

    // WHEN
    component._buildSettings();
    settingStub.dispatchEvent(
      new CustomEvent('eui-table-setting:apply', {
        detail: { value: newColumns }
      })
    );
    tick();

    // EXPECT
    expect(component.table.columns).toEqual(newColumns);
  }));

  it('should emit filterIconClicked on onFilterIconClicked', () => {
    // GIVEN
    const filterIconClickedSpy = spyOn(component.filterIconClicked, 'emit');

    // WHEN
    component.onFilterIconClicked(CustomEventMock);

    // THEN
    expect(filterIconClickedSpy).toHaveBeenCalledWith(CustomEventMock);
  });

  it('should emit sortChanged ASC', () => {
    // GIVEN
    const sortChangedSpy = spyOn(component.sortChanged, 'emit');

    // WHEN
    component.onSortChanged(sortClickedEventAscMock);

    // THEN
    expect(sortChangedSpy).toHaveBeenCalledWith("+id");
  });

  it('should emit sortChanged DESC', () => {
    // GIVEN
    const sortChangedSpy = spyOn(component.sortChanged, 'emit');

    // WHEN
    component.onSortChanged(sortClickedEventDescMock);

    // THEN
    expect(sortChangedSpy).toHaveBeenCalledWith("-name");
  });

  it('should emit rowSelected', () => {
    // GIVEN
    const selectionChangedSpy = spyOn(component.selectionChanged, 'emit');
    component.data = EntityDetailMockData;


    // WHEN
    component.onRowSelected(CustomEventMock);

    // THEN
    expect(selectionChangedSpy).toHaveBeenCalledWith(selectedRowMock);
  });

  it('should create subtitle on buildTileSubtitle', () => {
    // GIVEN
    component.tablePaginationParams = {
      currentPage: 1,
      itemsCount: 25,
      numberOfPages: 3
    };
    component.queryParams = {
      offset: 0,
      limit: 20
    }
    const appendChild = spyOn(subtitleDivMock, 'appendChild');

    // WHEN
    component._buildTileSubtitle();

    // THEN
    expect(appendChild).toHaveBeenCalled();
  });

  it('should remove old subtitle on buildTileSubtitle if it exists', () => {
    // GIVEN
    component.tablePaginationParams = {
      currentPage: 2,
      itemsCount: 25,
      numberOfPages: 3
    };
    component.queryParams = {
      offset: 0,
      limit: 20
    }

    spyOn(subtitleDivMock, 'querySelector').and.returnValue(document.createElement('div'));
    const removeChild = spyOn(subtitleDivMock, 'removeChild');
    const appendChild = spyOn(subtitleDivMock, 'appendChild');

    // WHEN
    component._buildTileSubtitle();

    // THEN
    expect(removeChild).toHaveBeenCalled();
    expect(appendChild).toHaveBeenCalled();
  });

  it('build tile on buildTile', () => {
    // GIVEN
    component.showResultsCount = true;
    component.showFilter = true;
    component.selectedItems = [];

    // WHEN
    component._buildTile();

    // THEN
    expect(component.tile.innerHTML).toEqual(tileInnerHTMLMock);
  });

  it('should return the row on getRow', () => {

    // WHEN
    const getRowValue = component.getRow(selectedRowMock[0], EntityDetailMockData);

    // THEN
    expect(getRowValue).toEqual(selectedRowMock[0]);
  });

  it('should return the row on getRow', () => {

    // WHEN
    const getRowValue = component.getRow(selectedRowMock[0], EntityDetailMockData);

    // THEN
    expect(getRowValue).toEqual(selectedRowMock[0]);
  });

  it('should get row based on objectId', () => {
    const data = [
      { objectId: '101', name: 'Object 101' },
      { objectId: '102', name: 'Object 102' },
    ];

    const value = { objectId: '102' };

    const result = component.getRow(value, data);

    expect(result).toEqual(data[1]);
  });

  it('should get row based on id', () => {
    const data = [
      { id: '101', name: 'Feature pack 1-0-1' },
      { id: '102', name: 'Feature pack 1-0-2' },
    ];

    const value = { id: '101' };

    const result = component.getRow(value, data);

    expect(result).toEqual(data[0]);
  });

  it('should return undefined when row is not found', () => {
    const data = [
      { id: '1', name: 'Item 1' },
      { id: '2', name: 'Item 2' },
    ];

    const value = { id: '3' };

    const result = component.getRow(value, data);

    expect(result).toBeUndefined();
  });

  it('should remove all menu items', () => {

    const mockMenu = {
      querySelectorAll: jasmine.createSpy('querySelectorAll').and.returnValue([]),
      appendChild: jasmine.createSpy('appendChild'),
      show: false,
    };

    const customEvent = new CustomEvent('click', {
      detail: {
        row: 1,
        menu: mockMenu,
      },
    });
    component.actions = mockActions;

    spyOn(component, 'getRow').and.returnValue(selectedRowMock[0]);

    //WHEN
    component.showActionMenu(customEvent);

    expect(mockMenu.querySelectorAll).toHaveBeenCalledWith('eui-menu-item');
  });

  describe("actionMenuEvent menu item tests", () => {
    let mockData: any;
    let customEvent: any;
    beforeEach(() => {
      mockData = {
        label: 'Update',
        value: 'Update'
      };
      component.currentRow = { id: "1", name: "some name" };
      customEvent = { target: mockData };

      spyOn(component.actionClicked, 'emit');
    });

    it('should emit actionClicked on actionMenuEvent', () => {
      component.selectedItems = ["1"];
      component.actionMenuEvent(customEvent);

      expect(component.actionClicked.emit).toHaveBeenCalledWith({
        action: mockData,
        row: component.currentRow,
      });
    });

    it('should emit actionClicked on actionMenuEvent without row if multiple selection', () => {
      component.selectedItems = ["1", "2", "3"];
      component.actionMenuEvent(customEvent);

      expect(component.actionClicked.emit).toHaveBeenCalledWith({
        action: mockData,
        row: null,
      });
    });
  });

  it('should configure pagination when no previous pagination data stored', () => {

    //GIVEN
    component.localStorageKey = null;

    spyOn(component.tableElement.nativeElement, 'appendChild');

    //WHEN
    component._buildPagination();

    //THEN
    expect(component.pagination.numEntries).toBe(10);
    expect(component.pagination.numPages).toBe(0);
    expect(component.pagination.currentPage).toBe(1);
    expect(component.tableElement.nativeElement.appendChild).toHaveBeenCalled();
  });

  it('should update pagination when pagination inputs set', () => {

    //GIVEN
    component.tablePaginationParams = {
      currentPage: 2,
      itemsCount: 25,
      numberOfPages: 3
    };
    component.queryParams = {
      offset: 0,
      limit: 10
    }

    spyOn(component.tableElement.nativeElement, 'appendChild');

    //WHEN
    component._buildPagination();

    //THEN
    expect(component.pagination.numEntries).toBe(10);
    expect(component.pagination.numPages).toBe(3);
    expect(component.pagination.currentPage).toBe(2);
    expect(component.tableElement.nativeElement.appendChild).toHaveBeenCalled();
  });

  it('should configure pagination when previous pagination data stored', () => {

    //GIVEN
    component.tablePaginationParams = {
      currentPage: 2,
      itemsCount: 50,
      numberOfPages: 3
    };
    component.queryParams = {
      offset: 0,
      limit: 20
    }

    spyOn(component.tableElement.nativeElement, 'appendChild');

    //WHEN
    component._buildPagination();

    //THEN
    expect(component.pagination.numEntries).toBe(20);
    expect(component.pagination.numPages).toBe(3);
    expect(component.pagination.currentPage).toBe(2);
    expect(component.tableElement.nativeElement.appendChild).toHaveBeenCalled();
  });

  it("_paginationPageIndexChange should emit pageChanged", () => {
    //GIVEN
    const pageChangedSpy = spyOn(component.pageChanged, 'emit');

    //WHEN
    component._paginationPageIndexChange({
      preventDefault: () => { },
      detail: {
        state: {
          currentPage: 2,
        }
      }
    });

    //THEN
    expect(pageChangedSpy).toHaveBeenCalledWith({ currentPage: 2 });
  });

  it('should create action buttons with the properties on buildActionButtons', () => {
    const mockActionItems = [
      { label: 'UPDATE', icon: 'icon1', handler: jasmine.createSpy('handler1') },
      { label: 'UNINSTALL', icon: 'icon2', handler: jasmine.createSpy('handler2') },
    ];

    component.actionItems = mockActionItems;

    component._buildActionButtons();

    const buttons = fixture.nativeElement.querySelectorAll('.table-view-button');

    expect(buttons.length).toEqual(0);

    buttons.forEach((button, index) => {
      const actionItem = mockActionItems[index];
      expect(button.name).toEqual(`table-button-${actionItem.label}`);
      expect(button.className).toContain('table-view-button');

      if (actionItem.icon) {
        expect(button.icon).toEqual(actionItem.icon);
      }

      expect(button.tabIndex).toEqual(index);
      expect(button.innerText).toEqual(`Action: ${actionItem.label}`);

      button.click();

      expect(actionItem.handler).toHaveBeenCalledWith(actionItem.label);
    });
  });

  it('should return "table-failure" when failure is not null', () => {

    const result = component.getTableClassName.call({ failure: 'Some error', showEmptyMessage: false });

    expect(result).toBe('table-failure');
  });

  it('should return "table-no-data" when failure is null and showEmptyMessage is true', () => {

    const result = component.getTableClassName.call({ failure: null, showEmptyMessage: true });

    expect(result).toBe('table-no-data');
  });

  it('should return an empty string when neither  failure is null nor showEmptyMessage is true', () => {

    const result = component.getTableClassName.call({ failure: null, showEmptyMessage: false });

    expect(result).toBe('');
  });

  it('onRefresh should emit refreshClicked event and not change currentQueryParams', () => {
    // GIVEN
    const refreshSpy = spyOn(component.refreshClicked, 'emit');
    const currentQueryParams = {
      offset: 20,
      limit: 10,
      sort: '+status',
      filters: 'name=="*test*'
    };
    component.queryParams = currentQueryParams;

    // WHEN
    component.onRefresh();

    // THEN
    expect(refreshSpy).toHaveBeenCalled();
    expect(component.queryParams).toEqual(currentQueryParams);

  });

  it('onReloadTableOnFail should reset currentQueryParams and emit reloadTableOnFail event', () => {
    // GIVEN
    const reloadTableOnFailSpy = spyOn(component.reloadTableOnFail, 'emit');
    const currentQueryParams = {
      offset: 20,
      limit: 10,
      sort: '+status',
      filters: 'name=="*test*'
    };
    component.queryParams = currentQueryParams;

    // WHEN
    component.onReloadTableOnFail();

    // THEN
    expect(reloadTableOnFailSpy).toHaveBeenCalled();
    expect(component.queryParams).toEqual(AppConstants.defaultQueryParams);

  });
});

