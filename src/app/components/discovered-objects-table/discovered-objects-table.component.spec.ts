import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { SimpleChanges } from '@angular/core';
import { ErrorType } from '@erad/utils';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { localStorageKeys } from 'src/app/constants';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DiscoveredObjectsFacadeService } from 'src/app/lib/discovery-objects/services/discovered-objects-facade.service';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DiscoveredObjectsStatus } from 'src/app/models/enums/discovered-objects-status.enum';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { failureMock } from 'src/app/shared/common.mock';
import { retrieveLocalStoreObject } from 'src/app/utils/local-store.utils';
import { retrieveSessionStoreObject } from 'src/app/utils/session-store.utils';
import { TableColumnData } from '../dnr-table/table-view.model';
import { ApplicationDetailsMock } from '../job-definition-dropdown/job-definition-dropdown.mock.data';
import { DiscoveredObjectsTableComponent } from './discovered-objects-table.component';
import { ColumnsConfig } from './discovered-objects-table.component.config';

describe('DiscoveredObjectsTableComponent', () => {
  let component: DiscoveredObjectsTableComponent;
  let fixture: ComponentFixture<DiscoveredObjectsTableComponent>;

  let discoveredObjectsFacadeService: DiscoveredObjectsFacadeService;
  let applicationsFacadeService: ApplicationDetailsFacadeService;

  const jobChange: SimpleChanges = {
    job: {
      currentValue: { id: "2", name: "job 2" },
      firstChange: true,
      previousValue: { id: "3", name: "job 3" },
      isFirstChange() { return true }
    }
  };

  const selectedTableRow: DiscoveredObjects = {
    discrepancies: ['missing, something'],
    errorMessage: '',
    objectId: "140",
    properties: {
      "key1": "value1",
      "key2": "value2",
      "key3": "value3",
      "key4": "value4",
      "id": "200"
    },
    status: DiscoveredObjectsStatus.DISCOVERED
  };

  const selectedTableRow2: DiscoveredObjects = {
    discrepancies: ['missing 2'],
    errorMessage: '',
    objectId: "150",
    properties: {}, // not required to  can handle undefined properties
    status: DiscoveredObjectsStatus.RECONCILED
  };

  beforeEach(async () => {
    window.sessionStorage.clear();

    await TestBed.configureTestingModule({
      declarations: [DiscoveredObjectsTableComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: TranslateService,
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoveredObjectsTableComponent);
    component = fixture.componentInstance;
    component.sessionStorageName = localStorageKeys.JUNIT1;
    fixture.detectChanges();
    discoveredObjectsFacadeService = TestBed.inject(DiscoveredObjectsFacadeService);
    applicationsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
    component.job = {
      id: "2", name: "job 2", status: JobStatus.DISCOVERED,
      applicationJobName: ApplicationDetailsMock.jobs[0].name
    };

    component.pageQueryParams = {
      limit: 10,
      offset: 0,
    };

     spyOn(discoveredObjectsFacadeService, 'getDiscoveredObjectsTotalCount').and.returnValue(of(2));
     spyOn(discoveredObjectsFacadeService, 'getDiscoveredObjectsFailure').and.returnValue(of(failureMock));
     spyOn(discoveredObjectsFacadeService, 'getDiscoveredObjectsLoading').and.returnValue(of(true));

     spyOn(applicationsFacadeService, 'getApplicationDetails').and.returnValue(of(ApplicationDetailsMock));
     spyOn(applicationsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(failureMock));
     spyOn(applicationsFacadeService, 'getApplicationDetailsLoading').and.returnValue(of(true));
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("getMenuItems function should exist (after ngInit) and create right click context menus when have selected item and showRightContextMenu is set", () => {
    // GIVEN
    component.selectedItems = ["2"];
    component.showRightContextMenu = true;

    // WHEN
    const result = component.getMenuItems();

    // THEN
    expect(result.length).toEqual(1);
    expect(result[0]).toEqual({ label: 'buttons.RECONCILE', value: 'RECONCILE' });
  });

  it("getMenuItems function should not create right click context menus when set that job is not suitable for a reconcile call", () => {
    // GIVEN
    component.selectedItems = ["2"];
    component.showRightContextMenu = false;

    // WHEN
    const result = component.getMenuItems();

    // THEN
    expect(result.length).toEqual(0);
  });

  it("onMenuClicked should emit reconcileClicked event", () => {
    // GIVEN
    spyOn(component.reconcileClicked, 'emit');

    // WHEN
    component.onMenuClicked({ action: { label: "Reconcile", value: "RECONCILE" }, row: selectedTableRow });

    // THEN
    expect(component.reconcileClicked.emit).toHaveBeenCalled();
  });

  it("onConfigChanged with parameter should update columnsConfig or set default", () => {
    const newConfig: TableColumnData[] = [{ attribute: "name", title: "Name", hidden: true, sortable: true, width: "200px" }];
    component.onConfigChanged(newConfig);

    expect(component.columnsConfig).toEqual(newConfig);
    component.onConfigChanged(null);
    expect(component.columnsConfig).toEqual(ColumnsConfig);

  });

  it("should return count on getItemCount", () => {
    // GIVEN
    component.tablePaginationParams = {
      currentPage: 3,
      numberOfPages: 1,
      itemsCount: 25
    };

    // WHEN
    const count = component.getItemsCount()

    // THEN
    expect(component.tablePaginationParams.itemsCount).toEqual(count);
  });

  describe("ngOnChanges tests", () => {

    it('should handle job changes as expected (clear previous table data)', (() => {
      // GIVEN
      component.tablePaginationParams = {
        currentPage: 3,
        numberOfPages: 1,
        itemsCount: 25
      };
      component.pageQueryParams = {
        limit: 30,
        offset: 20,
      };

      spyOn(component, 'reloadTableItems').and.callThrough();
      spyOn(component, 'clearSelection').and.callThrough();
      component.job = { id: "3", name: "job 3" };

      // WHEN
      component.ngOnChanges(jobChange);

      // THEN
      expect(component.job.id).toEqual("2");
      expect(component.job.name).toEqual("job 2");
      expect(component.reloadTableItems).toHaveBeenCalled();
      expect(component.clearSelection).toHaveBeenCalled();
    }));

    it('should load pagination/query params when changed to new', (() => {
      // GIVEN
      const tableParams = {
        currentPage: 3,
        numberOfPages: 1,
        itemsCount: 25
      };
      const queryParams = {
        limit: 30,
        offset: 30,
      };
      component.tablePaginationParams = tableParams;
      component.pageQueryParams = queryParams;
      component.sessionStorageName = "tab_job 2";
      component._persistPageData();

      // WHEN
      // change component pagination/query values but do not store them.
      component.tablePaginationParams = {
        currentPage: 1,
        numberOfPages: 1,
        itemsCount: 1
      };
      component.pageQueryParams = {
        limit: 10,
        offset: 0,
      };

      component.ngOnChanges(jobChange);

      // THEN
      // On job change, original stored pagination/query values will be loaded.
      const newValues = retrieveSessionStoreObject(component.sessionStorageName);
      const limit = retrieveLocalStoreObject(localStorageKeys.DISCOVERY_OBJECTS_LIMIT)?.limit;

      expect(newValues.tablePaginationParams).toEqual(tableParams);
      expect(newValues.queryParams).toEqual(queryParams);
      expect(limit).toEqual(queryParams.limit);
    }));
  });

  describe("onSortChanged should change pageQueryParams and call reloadTableItems", () => {

    it("onSortChanged ascending test", () => {
      // GIVEN
      spyOn(component, 'reloadTableItems').and.callThrough();

      // WHEN
      component.onSortChanged("+name");

      // THEN
      expect(component.pageQueryParams).toEqual({
        limit: 10,
        offset: 0,
        sort: "+name",

      });
      expect(component.reloadTableItems).toHaveBeenCalled();
    });

    it("onSortChanged descending test", () => {
      // GIVEN
      spyOn(component, 'reloadTableItems').and.callThrough();

      // WHEN
      component.onSortChanged("-id");

      // THEN
      expect(component.pageQueryParams).toEqual({
        limit: 10,
        offset: 0,
        sort: "-id",

      });
      expect(component.reloadTableItems).toHaveBeenCalled();
    });

    it("onSortChanged should update session storage with new query params", () => {
      // GIVEN
      spyOn(component, 'reloadTableItems').and.callThrough();

      // WHEN
      component.onSortChanged("+name");

      // THEN
      const storedParams = JSON.parse(window.sessionStorage.getItem(component.sessionStorageName));

      expect(storedParams.queryParams.sort).toBe("+name");
    });
  });

  describe("onPageChanged tests", () => {

    beforeEach(() => {
         // GIVEN
      spyOn(component, 'reloadTableItems').and.callThrough();
      component.tablePaginationParams = {
        currentPage: 5,
        numberOfPages: 10,
        itemsCount: 100
      };
      component.pageQueryParams = {
        limit: 10,
        offset: 40,
      };
    });

    it('should do nothing if current page set to 0', () => {
      component.onPageChanged({currentPage: 0, numEntries: 10});
      expect(component.reloadTableItems).not.toHaveBeenCalled();
    });

    it("onPageChanged should set the pageNumber, and change pageQueryParams and call reloadTableItems", () => {

      // WHEN
      component.onPageChanged({currentPage: 6, numEntries: 10});

      // THEN
      expect(component.pageQueryParams.offset).toEqual(50);
      expect(component.tablePaginationParams.currentPage).toEqual(6);
      expect(component.reloadTableItems).toHaveBeenCalled();
    });

    it("onPageChanged should update session storage with new pagination/query params", () => {

      // WHEN
      component.onPageChanged({currentPage: 6, numEntries: 10});

      // THEN
      const storedParams = JSON.parse(window.sessionStorage.getItem(component.sessionStorageName));
      const expected = { "tablePaginationParams": { "itemsCount": 100, "currentPage": 6, "numberOfPages": 10 }, "queryParams": { "offset": 50, "limit": 10 } };
      expect(storedParams).toEqual(expected);
    });

    it("onPageChanged should with undefined currentPage should reset the page to 1, and change pageQueryParams and call reloadTableItems", () => {

      // WHEN
      component.onPageChanged({currentPage: undefined});

      // THEN
      expect(component.pageQueryParams).toEqual({
        limit: 10,
        offset: 0,
      });
      expect(component.tablePaginationParams.currentPage).toEqual(1);
      expect(component.reloadTableItems).toHaveBeenCalled();
    });

    it("onPageChanged should with 1 currentPage should reset the page to 1, and change offset", () => {

      // WHEN
      component.onPageChanged({currentPage: 1, numEntries: 10});

      // THEN
      expect(component.pageQueryParams.offset).toEqual(0);
      expect(component.tablePaginationParams.currentPage).toEqual(1);
      expect(component.reloadTableItems).toHaveBeenCalled();
    });
  });

  it("clearSelection should set selectedItems to empty array and emit selectionChanged event", () => {
    // GIVEN
    spyOn(component.selectionChanged, 'emit');

    // WHEN
    component.clearSelection();

    // THEN
    expect(component.selectedItems).toEqual([]);
    expect(component.selectionChanged.emit).toHaveBeenCalledWith([]);
  });

  it("onSelectionChanged should set selectedItems and emit selectionChanged event", () => {
    // GIVEN
    const mockDiscoveredObjects: DiscoveredObjects[] = [selectedTableRow, selectedTableRow2];
    const expectedItemIds = ["140", "150"];
    spyOn(component.selectionChanged, 'emit');

    // WHEN
    component.clearSelection();
    component.onSelectionChanged(mockDiscoveredObjects);

    // THEN
    expect(component.selectedItems).toEqual(expectedItemIds);
    expect(component.selectionChanged.emit).toHaveBeenCalledWith(mockDiscoveredObjects);
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

  it("onRefreshClicked should emit refreshClicked event", () => {
    // GIVEN
    spyOn(component.refreshClicked, 'emit');

    // WHEN
    component.onRefreshClicked();

    // THEN
    expect(component.refreshClicked.emit).toHaveBeenCalled();
  });

  it("handleFailure should set failure prop and clear selectedItems", () => {
    // GIVEN
    const mockFailure = { errorCode: "500", errorMessage: "Server error", type: ErrorType.BackEnd };
    component.waitingForResponse = true;
    spyOn(component.dataLoaded, 'emit');

    // WHEN
    component._handleFailure(mockFailure);

    // THEN
    expect(component.failure).toEqual(mockFailure);
    expect(component.selectedItems).toEqual([]);
    expect(component.waitingForResponse).toBeFalse();
    expect(component.dataLoaded.emit).toHaveBeenCalledWith(false);
  });

  it("createDisplayRows should create table rows from discovered objects", () => {
    // GIVEN
    const mockDiscoveredObjects: DiscoveredObjects[] = [selectedTableRow, selectedTableRow2];

    // WHEN
    const result = component._createDisplayRows(mockDiscoveredObjects);
    // THEN
    expect(result.length).toEqual(2);
    expect(result[0].objectId).toEqual("140");
    expect(result[0].status).toEqual("state.DISCOVERED");
    expect(result[0].statusColor).toEqual("#878787");
    expect(result[0].statusWithoutTranslation).toEqual("DISCOVERED");
    expect(result[0].key1).toEqual("value1");
    expect(result[0].key2).toEqual("value2");
    expect(result[0].key3).toEqual("value3");
    expect(result[0].key4).toEqual("value4");
    expect(result[0].id).toEqual("200");

    expect(result[1].objectId).toEqual("150");
    expect(result[1].discrepancies).toEqual("missing 2");
    expect(result[1].status).toEqual("state.RECONCILED");
    expect(result[1].statusColor).toEqual("#329864");
    expect(result[1].statusWithoutTranslation).toEqual("RECONCILED");

    const result2 = component._createDisplayRows(null);
    expect(result2).toEqual(undefined);
  });

  it('_initSubscriptions should subscribe to discoveredObjectsService.getDiscoveredObjects and set discoveredObjects', fakeAsync(() => {
    // GIVEN
    spyOn(discoveredObjectsFacadeService, 'getDiscoveredObjects').and.returnValue(of([
      selectedTableRow, selectedTableRow2
    ]));

    spyOn(component, '_createDisplayRows').and.callThrough();
    const bob =  spyOn(component.dataLoaded, 'emit');
    component.displayRows = null;
    component.waitingForResponse = false;
    component.objectsLoading = false;
    component.appLoading = true;

    // WHEN
    component._initSubscriptions();
    tick();

    // THEN
    expect(component.waitingForResponse).toBeFalse();
    expect(component.objectsLoading).toBeTrue();
    expect(component.appLoading).toBeTrue();
    expect(component.displayRows).toBeDefined();
    expect(component.discoveredObjects).toEqual([selectedTableRow, selectedTableRow2]);
    console.log(bob);

    expect(component._createDisplayRows).toHaveBeenCalledWith([selectedTableRow, selectedTableRow2]);
    expect(component.dataLoaded.emit).toHaveBeenCalledWith(false);
  }));

  it('Should clear selections when no objects returned', fakeAsync(() => {
    // GIVEN
    spyOn(discoveredObjectsFacadeService, 'getDiscoveredObjects').and.returnValue(of([]));
    spyOn(component.selectionChanged, 'emit');

    spyOn(component, '_createDisplayRows').and.callThrough();

    // WHEN
    component._initSubscriptions();
    tick();

    // THEN
    expect(component.selectedItems).toEqual([]);
    expect(component.selectionChanged.emit).toHaveBeenCalledWith([]);
  }));
});
