import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock, ConfigThemeService, ConfigThemeServiceMock } from '@erad/core';
import { EventEmitter, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { discoveredObjectMock, jobDetailMock } from './job-detail-view-container.component.mock.data';

import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorType } from 'src/app/models/enums/error-type.enum';
import { Job } from 'src/app/models/job.model';
import { JobDetailViewContainerComponent } from './job-detail-view-container.component';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { TabNavigationComponent } from 'src/app/lib/shared-components/tab-navigation/tab-navigation.component';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';

const fakeActivatedRoute = { snapshot: { queryParams: { linkAwaySection: 'OBJECTS' } } };
const mockId = '12345';


describe('JobDetailViewContainerComponent', () => {
  let component: JobDetailViewContainerComponent;
  let fixture: ComponentFixture<JobDetailViewContainerComponent>;
  let actions$: Observable<any>;
  let tabsService: TabsService;
  let jobDetailsFacadeService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobDetailViewContainerComponent
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModuleMock,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: MatDialog, useValue: MatDialogMock },
        {
          provide: TabsService,
        },
        {
          provide: AppComponent,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        {
          provide: ConfigThemeService,
          useClass: ConfigThemeServiceMock
        },
        { provide: InjectionToken, useValue: {} }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobDetailViewContainerComponent);
    component = fixture.componentInstance;
    component.jobId = mockId;
    fixture.detectChanges();
    tabsService = TestBed.inject(TabsService);
    jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);

    spyOn(tabsService, 'updateTab');
    spyOn(tabsService, 'updateTabTitle');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('entity details should be hidden when close button clicked', () => {

    component.onCloseEntityDetailButtonClicked();

    expect(component.isLeftPanelShown).toBe(false);
  });

  it('right panel should be closed on click of onCloseRightPanel', () => {

    component.onCloseRightPanel();

    expect(component.isFirstRightPanelShown).toBe(false);
    expect(component.selectedObjectDetail).toBe(null);
  });

 it('right panel should be closed on click of onLeftAccordionHeaderClicked', () => {

    component.onLeftAccordionHeaderClicked(mockId);

    expect(component.isFirstRightPanelShown).toBe(false);
    expect(component.accordion).toBe(mockId);
  });

  it('right panel should be open, selectedObjectDetail be having values on click of onDiscoveredObjectSelection', () => {
    component.onDiscoveredObjectSelection([discoveredObjectMock]);

    expect(component.isFirstRightPanelShown).toBe(true);
    expect(component.selectedObjectDetail).toEqual(discoveredObjectMock);
  });

  it('right panel should be closed on multiple selection', () => {
    component.onDiscoveredObjectSelection([discoveredObjectMock, discoveredObjectMock]);
    expect(component.isFirstRightPanelShown).toBe(false);
  });

  it ('onReloadRequested should clear polling before loading job details', () => {
    spyOn(component, '_clearPolling');
    spyOn(jobDetailsFacadeService, 'loadDetails');
    component.onReloadRequested();
    expect(component._clearPolling).toHaveBeenCalled();
    expect(jobDetailsFacadeService.loadDetails).toHaveBeenCalledWith(mockId);
  });

  it ("should clear polling when job status does not require polling" , () => {
    spyOn(component, '_clearPolling');

    spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of({...jobDetailMock, status: JobStatus.COMPLETED}));
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
    spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(null));

    component.listenJobDetailById();
    expect(component._clearPolling).toHaveBeenCalled();
  });

  it('right panel should be close, selectedObjectDetail should be null on click of onDiscoveredObjectSelection', () => {
    component.onDiscoveredObjectSelection(null);

    expect(component.isFirstRightPanelShown).toBe(false);
    expect(component.selectedObjectDetail).toEqual(null);
  });


  it('jobDetailsFacadeService should load details', () => {
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
    spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(null));
    spyOn(jobDetailsFacadeService, 'loadDetails');
    component.ngOnInit();

    expect(jobDetailsFacadeService.loadDetails).toHaveBeenCalled();
  });


  it('should call getJobDetails on listenJobDetailById', () => {

    spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailMock));
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
    spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(null));

    component.listenJobDetailById();

    expect(jobDetailsFacadeService.getJobDetails).toHaveBeenCalled();

    jobDetailsFacadeService.getJobDetails().subscribe((jobDetail) => {
      expect(jobDetail).toEqual(jobDetailMock);
      expect(tabsService.updateTabTitle).toHaveBeenCalledWith(jobDetail.id, jobDetail.name, false);
    });

  });

  it("should set jobInfo (response) to null for case of Job detail not found (failure case)", () => {
    spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(null));
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));
    spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of({
      type: ErrorType.BackEnd,
      errorCode: 'DR-17',
      errorMessage: 'Job not found'
    }));

    component.jobInfo = jobDetailMock;
    component.listenJobDetailById();
    expect(component.jobInfo).toEqual(null);
  });

  it( "should set isJobDetailsLoading flag for case of job details being loaded)", () => {
    spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(null));
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(true));
    spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(null));
    component.isJobDetailsLoading = false;

    component.listenJobDetailById();
    expect(component.isJobDetailsLoading).toEqual(true);
  });

  describe ('ngAfterViewInit tests', () => {

    class PartialTabNavigationComponent {
      tabChange: EventEmitter<number> = new EventEmitter<number>();

    }
    let tabNavigationMock: PartialTabNavigationComponent;
    beforeEach(() => {
       tabNavigationMock = new PartialTabNavigationComponent();
       spyOn(component, '_subscribeToTabChange').and.callThrough();
       spyOn(window, 'setTimeout').and.callThrough();

    });

    it ('ngAfterView init would call a method (_subscribeToTabChange) after interval if tabNavigationComponent not loaded', () => {
      // GIVEN
      spyOn(component.tabsService, 'getTabNavigationComponent').and.returnValue(null);

      // WHEN
      component.ngAfterViewInit();
      expect(window.setTimeout).toHaveBeenCalled();
    });

    it ('ngAfterView init would cal _subscribeToTabChange directly if tabNavigationComponent is loaded', () => {
      // GIVEN
      spyOn(component.tabsService, 'getTabNavigationComponent').and.returnValue(tabNavigationMock as TabNavigationComponent);

      // WHEN
      component.ngAfterViewInit();
      expect(window.setTimeout).not.toHaveBeenCalled();
      expect(component._subscribeToTabChange).toHaveBeenCalled();

    });
  });

  it ('ngAfterView init would call a method after interval if tabNavigationComponent not loaded', () => {
    // GIVEN
    spyOn(component.tabsService, 'getTabNavigationComponent').and.returnValue(null);
    spyOn(window, 'setTimeout').and.callThrough();

    // WHEN
    component.ngAfterViewInit();
    expect(window.setTimeout).toHaveBeenCalled();
  });

  describe("tab change tests", () => {
    class PartialTabNavigationComponent {
      tabChange: EventEmitter<number> = new EventEmitter<number>();

    }
    let tabNavigationMock: PartialTabNavigationComponent;
    beforeEach(() => {
       tabNavigationMock = new PartialTabNavigationComponent();

        spyOn(component.tabsService, 'getTabNavigationComponent').and.returnValue(tabNavigationMock as TabNavigationComponent);

        component._subscribeToTabChange();
    });

    it("should open the left panel if was closed on tab press ", fakeAsync(() => {

      // GIVEN
      component.isLeftPanelShown = false;

      // WHEN
      component.tabNavigationComponent.tabChange.emit(3);
      tick();

      // THEN
      expect(component.isLeftPanelShown).toBeTrue();
    }));
  });

  describe("_createDetailedGeneralInfo Tests", () => {

    it("should handle undefined values", () => {
      const expectedResult = [
        { label: 'job.JOB_NAME', value: '-- --' },
        { label: 'job.STATUS', value: '-- --' },
        { label: 'job.ID', value: '-- --' },
        { label: 'job.DESCRIPTION', value: '-- --' },
        { label: 'job.DISCOVERED_OBJECTS_COUNT', value: '-- --' },
        { label: 'job.RECONCILED_OBJECTS_COUNT', value: '-- --' },
        { label: 'job.RECONCILED_OBJECTS_ERROR_COUNT', value: '-- --' },
        { label: 'featurePack.FP_NAME', value: '-- --' },
        { label: 'job.FEATURE_PACK_ID', value: '-- --' },
        { label: 'job.APPLICATION_NAME', value: '-- --' },
        { label: 'job.APPLICATION_ID', value: '-- --' },
        { label: 'job.JOB_DEFINITION', value: '-- --' },
        { label: 'job.SCHEDULE_ID', value: '-- --' },
        { label: 'job.START_DATE', value: '-- --', isDate: false },
        { label: 'job.COMPLETED_DATE', value: '-- --', isDate: false }];

      expect(component._createDetailedGeneralInfo(null)).toEqual(expectedResult);
    });


    it("should handle defined values", () => {

      // GIVEN
      const job: Job= {
        name: "job name",
        status: JobStatus.DISCOVERED,
        id: "12345",
        description: "job description",
        discoveredObjectsCount: 10,
        reconciledObjectsCount: 5,
        reconciledObjectsErrorCount: 0, // a falsy value
        featurePackName: "feature pack name",
        featurePackId: "67890",
        applicationName: "",  // empty string should be replaced
        applicationId: "54321",
        applicationJobName: "application job definition",
        jobScheduleId: "schedule id",
        startDate: new Date(0).toISOString(),
        completedDate: new Date(0).toISOString()
      };

      const expectedResult = [
        { label: 'job.JOB_NAME', value: 'job name' },
        { label: 'job.STATUS', value: '-- --' }, /* expect not to translate in test*/
        { label: 'job.ID', value: '12345' },
        { label: 'job.DESCRIPTION', value: 'job description' },
        { label: 'job.DISCOVERED_OBJECTS_COUNT', value: '10' },
        { label: 'job.RECONCILED_OBJECTS_COUNT', value: '5' },
        { label: 'job.RECONCILED_OBJECTS_ERROR_COUNT', value: '0' },
        { label: 'featurePack.FP_NAME', value: 'feature pack name' },
        { label: 'job.FEATURE_PACK_ID', value: '67890' },
        { label: 'job.APPLICATION_NAME', value: '-- --' },
        { label: 'job.APPLICATION_ID', value: '54321' },
        { label: 'job.JOB_DEFINITION', value: 'application job definition' },
        { label: 'job.SCHEDULE_ID', value: 'schedule id' },
        { label: 'job.START_DATE', value: '1970-01-01T00:00:00.000Z', isDate: true },
        { label: 'job.COMPLETED_DATE', value: '1970-01-01T00:00:00.000Z', isDate: true }];

      expect(component._createDetailedGeneralInfo(job)).toEqual(expectedResult);
    });
  });
});
