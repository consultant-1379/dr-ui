import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';

import { AppItemDetailFacadeService } from './model/app-item-detail-facade-service.interface';
import { AppItemTableViewComponent } from './app-item-table-view.component';
import { AppItemsFacadeService } from './model/app-items-facade-service.interface';
import { DatePipe } from '@angular/common';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { RbacService } from 'src/app/services/rbac.service';
import { RbacServiceMock } from 'src/app/services/rbac.service.mock';
import { SimpleChanges } from '@angular/core';
import { TableColumnData } from '../dnr-table/table-view.model';
import { TranslateService } from '@ngx-translate/core';
import { failureMock } from 'src/app/shared/common.mock';
import { localStorageKeys } from 'src/app/constants';
import { retrieveLocalStoreObject } from 'src/app/utils/local-store.utils';

const filterChange: SimpleChanges = {
  'filter': {
    'currentValue': { name: "*name1*" },
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
};
const multipleFilterChange: SimpleChanges = {
  'filter': {
    'currentValue': { name: "*name1*", id: "*123*" },
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
};
const clearFilterChange: SimpleChanges = {
  'filter': {
    'currentValue': null,
    'firstChange': false,
    previousValue: { name: "name1" },
    isFirstChange() { return false }
  }
};
const entityChange: SimpleChanges = {
  'entity': {
    'currentValue':EntityType.JBS,
    'firstChange': true,
    previousValue: null,
    isFirstChange() { return true }
  }
};
const scheduleEntityChange: SimpleChanges = {
  'entity': {
    'currentValue':EntityType.SCHEDULES,
    'firstChange': true,
    previousValue: EntityType.FP,
    isFirstChange() { return true }
  }
};
const forceReloadChange: SimpleChanges = {
  'forceReload': {
    'currentValue':true,
    'firstChange': true,
    previousValue: false,
    isFirstChange() { return true }
  }
};
const defaultSortChange: SimpleChanges = {
  'defaultSort': {
    'currentValue':null,
    'firstChange': true,
    previousValue: "+date",
    isFirstChange() { return true }
  }
};

beforeEach(() => {
  window.localStorage.clear();
});

describe('AppItemTableViewComponent', () => {
  let component: AppItemTableViewComponent<any, any>;
  let fixture: ComponentFixture<AppItemTableViewComponent<any, any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppItemTableViewComponent ],
      imports: [
        TranslateModuleMock
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: AppItemsFacadeService,
          useClass: AppItemsFacadeService
        },
        {
          provide: RbacService,
          useClass: RbacServiceMock
        },
        DatePipe
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppItemTableViewComponent);
    component = fixture.componentInstance;
    component.appItemsFacadeService = new AppItemsFacadeService();

    component.appItemDetailFacadeService = new AppItemDetailFacadeService();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('emptyTableMessage tests', () => {

    it('should be Feature Pack empty message when no filtering for feature packs (admin user)', () => {
      spyOn(component.rbacService, 'isAdmin').and.returnValue(true);
      component.entity= EntityType.FP;
      entityChange.entity.currentValue = EntityType.FP;
      entityChange.entity.previousValue = EntityType.JBS;
      component.ngOnChanges(entityChange);
      expect(component.emptyTableMessage).toBe('featurePack.EMPTY_TABLE_MESSAGE_ADMIN_USER');
    });

    it('should be Feature Pack empty message when no filtering for feature packs (not admin user)', () => {
      component.entity= EntityType.FP;
      entityChange.entity.currentValue = EntityType.FP;
      entityChange.entity.previousValue = EntityType.JBS;
      spyOn(component.rbacService, 'isAdmin').and.returnValue(false);
      component.ngOnChanges(entityChange);
      expect(component.emptyTableMessage).toBe('featurePack.EMPTY_TABLE_MESSAGE');
    });

    it('should be job empty message when no filtering for jobs', () => {
      component.entity= EntityType.JBS;
      entityChange.entity.currentValue = EntityType.JBS;
      entityChange.entity.previousValue = EntityType.FP;
      component.ngOnChanges(entityChange);
      expect(component.emptyTableMessage).toBe('job.EMPTY_TABLE_MESSAGE');
    });

    it('should be job empty message when no filtering for schedule', () => {
      component.entity = EntityType.SCHEDULES;
      component.ngOnChanges(scheduleEntityChange);
      expect(component.emptyTableMessage).toBe('schedule.EMPTY_TABLE_MESSAGE');
    });

    it('should be no empty message when FP filtering (as replacing with component)', () => {
      component.entity = EntityType.FP;
      component.filter = filterChange.filter.currentValue;
      component.ngOnChanges(filterChange);
      expect(component.emptyTableMessage).toBe('');
    });

    it('should be Jobs empty message when no entity', () => {
      entityChange.entity.currentValue = null;
      entityChange.entity.previousValue = EntityType.FP;
      component.entity = null;
      component.ngOnChanges(entityChange);
      expect(component.emptyTableMessage).toBe('GENERAL_EMPTY_TABLE_MESSAGE');
    });
  });

  describe('Entity Change tests', () => {
    it('should set localStorage to fp when entity changes to Feature Pack', () => {
      component.ngOnChanges(entityChange);
      expect(component.localStorageKey).toBe('dnr:fp-table_');
    });
    it('should set localStorage to job when entity changes to Job', () => {
      component.entity = EntityType.JBS;
      component.ngOnChanges(entityChange);
      expect(component.localStorageKey).toBe('dnr:jobs_table_');
    });
    it('should set table actions when entity changes', () => {
      component.actionItems = [
        {label: 'button1', id: 'forPlaywright'},{label: 'button2', id: 'forPlaywright'}
      ]
      component.ngOnChanges(entityChange);
      // TableActions is a function so call it to get the result
      const result = component.tableActions();
      expect(result).toEqual([
        { label: 'buttons.button1', value: 'button1' },
        { label: 'buttons.button2', value: 'button2' }
      ]);
    });

    it('should reload table data when entity changes to Job', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.ngOnChanges(entityChange);
      expect(loadItems).toHaveBeenCalled();
    });
  });

  describe('On search keyword change tests', () => {

    it('should set pageQueryParams filters to null when filter cleared', () => {
      component.filter = null;
      component.ngOnChanges(clearFilterChange);
      expect(component.pageQueryParams.filters).toBeUndefined();
    });

    it('should reload table data when search changes', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.ngOnChanges(filterChange);
      expect(loadItems).toHaveBeenCalled();
    });

    it('should set change query param when search changes', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.filter = filterChange.filter.currentValue;
      component.ngOnChanges(filterChange);
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0, filters: 'name==*name1*' });
    });

    it('should set change query param when search changes for multiple queries', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.filter = multipleFilterChange.filter.currentValue;
      component.ngOnChanges(multipleFilterChange);
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0, filters: 'name==*name1*;id==*123*' });
    });
  });

  describe('onSearchFilterChanged tests', () => {

    it('onSearchFilterChanged should change component filter and _handleFilterChange', () => {
      // GIVEN);
      component.filter = {};
      spyOn(component, '_handleFilterChange').and.callThrough();
      const filters = {name: "*trevor*", description: "*eee*"};

      // WHEN
      component.onSearchFilterChanged(filters);

      // THEN
      expect(component._handleFilterChange).toHaveBeenCalled();
      expect(component.filter).toEqual(filters);
    });

    it('should emit searchFilterChanged event when advance search clicked', () => {
      // GIVEN
      const emitSpy = spyOn(component.searchFilterChanged, 'emit');
      const filters = { name: '*myName*', id: '123' };

      // WHEN
      component.onSearchFilterChanged(filters);

      // THEN
      expect(emitSpy).toHaveBeenCalled();
      expect(emitSpy).toHaveBeenCalledWith(filters);
    });
  });

  describe('Force Reload Changes tests', () => {
    it('should reload table data when force reload set', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.ngOnChanges(forceReloadChange);
      expect(loadItems).toHaveBeenCalled();
    });

    it('should reset query params when search changes', () => {
      component.pageQueryParams = {
        limit: 90,
        offset: 10,
      };
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.ngOnChanges(forceReloadChange);
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    });
  });

  describe('_createMenuItems (context menus items tests', () => {

    beforeEach(() => {
      component.actionItems = [{
        allowForStatus: [
          "COMPLETED",
          "DISCOVERY_FAILED",
          "DISCOVERED",
          "NEW",
          "PARTIALLY_RECONCILED",
          "RECONCILE_REQUESTED"
        ],
        label: 'DELETE_JOB',
        icon: 'trashcan',
        id: 'forPlaywright',
        handler: () => { }
      },
      ];
    });

    it('should return expected items when no row status is to be considered', () => {
      // GIVEN
      component.actionItems = [{
        label: 'INSTALL',
        id: 'forPlaywright'
      }];

      // WHEN
      const result = component._createMenuItems({id: 1});

      // THEN
      expect(result).toEqual([
        { label: 'buttons.INSTALL', value: 'INSTALL' },
      ]);
    });

    it('should return expected items when no row parameter is passed', () => {

      // GIVEN
      component.actionItems = [{
        label: 'INSTALL2',
        id: 'forPlaywright'
      }];

       // WHEN
      const result = component._createMenuItems();

       // THEN
      expect(result).toEqual([
        { label: 'buttons.INSTALL2', value: 'INSTALL2' },
      ]);
    });

    it('should return expected items based on status and allowForStatus containing status', () => {

      // GIVEN
      const result = component._createMenuItems({status: 'PARTIALLY_RECONCILED'});

      // EXPECT
      expect(result).toEqual([
        { label: 'buttons.DELETE_JOB', value: 'DELETE_JOB' },
      ]);
    });

    it('should return expected items based on status and allowForStatus not containing status', () => {
      // GIVEN
      const result = component._createMenuItems({status: 'DISCOVERY_INPROGRESS'});

      // EXPECT
      expect(result.length).toEqual(0);
    });

    it('should return all menu items if no allowForStatus param is provided ', () => {
      // GIVEN
      delete component.actionItems[0].allowForStatus;
      const result = component._createMenuItems({status: 'DISCOVERY_INPROGRESS'});

      // EXPECT
      expect(result.length).toEqual(1);
    });
  });

  describe('Config changes tests', () => {
    it('should change config to new value', () => {
      const newConfig: TableColumnData[] = [{
        attribute: 'name',
        title: 'title1'
      }];
      component.onConfigChanged(newConfig);
      expect(component.columnsConfig).toEqual(newConfig);
    });
    it('should keep change old config if changed to null', () => {
      const config: TableColumnData[] = [{
        attribute: 'name',
        title: 'title1'
      }];
      component.columnsConfig = config;
      component.onConfigChanged(null);
      expect(component.columnsConfig).toEqual(config);
    });
  });

  describe('Selection change tests', () => {
    it('should send event when row clicked', () => {
      const emitSpy = spyOn(component.selectionChanged, 'emit');

      component.onSelectionChanged([]);
      expect(emitSpy).toHaveBeenCalledWith([]);

      const rowData = { id: 1, name: "whatever" };
      component.onSelectionChanged([rowData]);

      expect(emitSpy).toHaveBeenCalledWith([rowData]);
    });

    it('should clear selected row on clear selection', () => {
      // GIVEN
      const displayData = [{ id: 1, name: "whatever" }, { id: 2, name: "bob", selected: false }];
      component.displayRows = displayData;

      // WHEN
      component.clearSelection();

      // THEN
      const selectedRows: boolean = component.displayRows.some(row => row.selected);
      expect(selectedRows).toBeFalse();
    });
  });

  describe('Sort tests', () => {
    it('should set default sort', () => {
      // GIVEN
      component.defaultSort = "+date";

      // WHEN
      component.ngOnChanges(defaultSortChange);
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.ngOnChanges(entityChange);

      // THEN
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0, sort: '+date' });
    });

    it('should reload with new sort data when sort changed', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.onSortChanged('+name');
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0, sort: '+name' });
    });

    it('should reload with descending sort data when sort changed to desc', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.onSortChanged('-name');
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0, sort: '-name' });
    });

    it("onSortChanged should update session storage with new query params", () => {
      // GIVEN
      component.pageQueryParams = {
        limit: 10,
        offset: 0,
      };
      component.localStorageKey = localStorageKeys.JUNIT1;

      // WHEN
      component.onSortChanged("+name");

      // THEN
      const storedParams = retrieveLocalStoreObject(component.localStorageKey);
      expect(storedParams.queryParams.sort).toBe("+name");
    });
  });

  describe('Search click tests', () => {
    it('should reload the table with changed queryParams', () => {
      // GIVEN
      spyOn(component, 'reloadTableItems').and.callThrough();
      component.entity = EntityType.JBS;
      component.filter = { name: "*test*" };

      const searchChange: SimpleChanges = {
        'filter': {
          'currentValue': { name: "*test*" },
          'firstChange': true,
          previousValue: false,
          isFirstChange() { return true }
        }
      }
      component.pageQueryParams  = {
        limit: 10,
        offset: 0
      };
      // WHEN
      component.ngOnChanges(searchChange);

      // THEN
      expect(component.pageQueryParams).toEqual({
        limit: 10,
        offset: 0,
        filters: 'name==*test*'
      });
      expect(component.reloadTableItems).toHaveBeenCalled();
    });
  });

  describe('Page changed tests', () => {
    beforeEach(() => {
      spyOn(component, 'reloadTableItems').and.callThrough();

      // GIVEN
      component.tablePaginationParams = {
        currentPage: 1,
        numberOfPages: 10,
        itemsCount: 100
      };
      component.pageQueryParams = {
        limit: 10,
        offset: 40,
      };
    });

    it('should do nothing if current page set to 0', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.onPageChanged({currentPage: 0, numEntries: 20 });
      expect(loadItems).not.toHaveBeenCalled();
    });

    it('should change offset to reflect new page number', () => {
      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      component.onPageChanged({currentPage: 5, numEntries: 20 });
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith({ limit: 20, offset: 80 });
    });

    it("onPageChanged should set the pageNumber, and change pageQueryParams and call reloadTableItems", () => {

      // WHEN
      component.onPageChanged({currentPage: 6, numEntries: 20});

      // THEN
      expect(component.pageQueryParams.offset).toEqual(100);
      expect(component.pageQueryParams.limit).toEqual(20);
      expect(component.tablePaginationParams.currentPage).toEqual(6);
      expect(component.reloadTableItems).toHaveBeenCalled();
    });
  });

  describe('Selection changed tests', () => {
    it('should change offset to reflect new page number', () => {
      const emit = spyOn(component.selectionChanged, 'emit');
      const selectedItems = [{ id: 1 }, { id: 3 }];
      component.onSelectionChanged(selectedItems);
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith(selectedItems);
    });
  });

  describe('Action clicked tests', () => {
    it('should change offset to reflect new page number', () => {
      const emit = spyOn(component.tableActionClick, 'emit');
      component.onActionClicked({row:1, action: {value: 'val1'}});
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith([1, 'val1']);
    });
  });

  describe('Subscription', () => {
    it('getItemsLoading, getItems and getItemsFailure of jobsFacadeService should be called on ngOnInit', () => {
      spyOn(component.appItemsFacadeService, 'getItemsLoading').and.returnValue(new Observable());
      spyOn(component.appItemsFacadeService, 'getItems').and.returnValue(new Observable());
      spyOn(component.appItemsFacadeService, 'getItemsFailure').and.returnValue(new Observable());

      component.ngOnInit();

      expect(component.appItemsFacadeService.getItemsLoading).toHaveBeenCalled();
      expect(component.appItemsFacadeService.getItems).toHaveBeenCalled();
      expect(component.appItemsFacadeService.getItemsFailure).toHaveBeenCalled();
    });
  });

  describe('loading tests', () => {

    it("should set isLoading prop true when loading", fakeAsync(() => {
      spyOn(component.appItemsFacadeService, 'getItemsLoading').and.returnValue(of(true));
      component._initSubscriptions();
      tick();
      expect(component.loading).toBeTrue();
    }));
  });

  describe('appItemsFacadeService response tests', () => {
    it("should set itemCount when getItemsTotalCount responds", () => {
      spyOn(component.appItemsFacadeService, 'getItemsTotalCount').and.returnValue(of(10));
      component._initSubscriptions();
      expect(component.tablePaginationParams.itemsCount).toBe(10);
    });

    it("should set pageNumber to first page", () => {
      component.tablePaginationParams.currentPage = 100;
      component.pageQueryParams  = {
        limit: 10,
        offset: 0
      };

      const loadItems = spyOn(component.appItemsFacadeService, 'loadItems');
      spyOn(component.appItemsFacadeService, 'getItemsTotalCount').and.returnValue(of(40));

      component._initSubscriptions();

      expect(component.tablePaginationParams.itemsCount).toBe(40);
      expect(loadItems).toHaveBeenCalled();
      expect(loadItems).toHaveBeenCalledWith({ limit: 10, offset: 0 });
    });

    it("should set itemCount when getItemsTotalCount responds", () => {
      spyOn(component.appItemsFacadeService, 'getItemsFailure').and.returnValue(of(failureMock));
      component._initSubscriptions();

      expect(component.failure).toEqual(failureMock);
    });

    it("should clear selection when getItems responds with no data", () => {
      const emit = spyOn(component.selectionChanged, 'emit');
      spyOn(component.appItemsFacadeService, 'getItems').and.returnValue(of([]));
      component._initSubscriptions();
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith([]);
    });

    it("should set selection when getItems returns single result AND filter set", () => {
      // GIVEN
      component.filter = { name: "*test*" };
      const emit = spyOn(component.selectionChanged, 'emit');
      spyOn(component.appItemTableViewService, 'createDisplayRow').and.returnValue({name:'name1'});
      spyOn(component.appItemsFacadeService, 'getItems').and.returnValue(of([{name:'name1'}]));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(emit).toHaveBeenCalled();
      expect(emit).toHaveBeenCalledWith([{name:'name1'}]);
    });

    it("should NOT update filter with name when getItems returns if id has specific value", () => {
      // GIVEN
      component.filter = { id: "*123*" };
      spyOn(component.appItemTableViewService, 'createDisplayRow').and.returnValue({name:'name1', id:'123'});
      spyOn(component.appItemsFacadeService, 'getItems').and.returnValue(of([{name:'name1', id:'123'}]));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(component.filter).toEqual({ id: "*123*"});
    });
  });

  describe('reloadTableItems, onReloadTableOnFail tests', () => {

    let loadItemsSpy: jasmine.Spy;
    let loadDetailSpy: jasmine.Spy;

    const currentPageQueryParams = {
      offset: 20,
      limit: 10,
      sort: '+status',
      filters: 'name=="*test*'
    };

    beforeEach(() => {
      component.pageQueryParams = currentPageQueryParams;
      loadItemsSpy = spyOn(component.appItemsFacadeService, 'loadItems');
      loadDetailSpy = spyOn(component.appItemDetailFacadeService, 'loadDetails')
    });

    it('onReloadTableOnFail should load items without clearing in memory data', () => {
      // WHEN
      component.onReloadTableOnFail ();

      // THEN
      expect(loadItemsSpy).toHaveBeenCalledWith(currentPageQueryParams);
    });

    it('reloadTableItems should load items without clearing in memory data when no parameter', () => {
      // WHEN
      component.reloadTableItems();

      // THEN
      expect(loadItemsSpy).toHaveBeenCalledWith(currentPageQueryParams);
    });

    it('reloadTableItems should call to update item detail also if single row is selected', () => {

      // GIVEN
      const displayData = [{ id: "1", name: "whatever" }, { id: "2", name: "bob", selected: false },
      { id: "3", name: "jim", selected: true }];

      component.displayRows = displayData;
      component.selectedItems = ["3"];


      // WHEN
      component.reloadTableItems();

      // THEN
      expect(loadItemsSpy).toHaveBeenCalledWith(currentPageQueryParams);
      expect(loadDetailSpy).toHaveBeenCalledWith("3");
    });

    it('reloadTableItems should call to not update item detail also if multiple rows are selected', () => {

      // GIVEN
      const displayData = [{ id: "1", name: "whatever" }, { id: "2", name: "bob", selected: true },
      { id: "3", name: "jim", selected: true }];

      component.displayRows = displayData;
      component.selectedItems = ["2", "3"];


      // WHEN
      component.reloadTableItems();

      // THEN
      expect(loadItemsSpy).toHaveBeenCalledWith(currentPageQueryParams);
      expect(loadDetailSpy).not.toHaveBeenCalledWith();
    });
  });
});
