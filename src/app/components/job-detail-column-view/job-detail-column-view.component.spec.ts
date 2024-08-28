import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { JobDetailColumnViewComponent } from './job-detail-column-view.component';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { SimpleChanges } from '@angular/core';
import { TranslateServiceMock } from '@erad/utils';
import { jobDetailMock } from 'src/app/lib/app-job-detail-view/containers/app-job-detail-view-container/job-detail-view-container.component.mock.data';
import { provideMockStore } from '@ngrx/store/testing';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { failureMock } from 'src/app/shared/common.mock';
import { of } from 'rxjs';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

describe('JobDetailColumnViewComponent', () => {
  let component: JobDetailColumnViewComponent;
  let fixture: ComponentFixture<JobDetailColumnViewComponent>;
  let translateService: TranslateService;
  let applicationDetailsFacadeService: ApplicationDetailsFacadeService;

  const jobChange: SimpleChanges = {
    'job': {
      'currentValue': jobDetailMock,
      'firstChange': true,
      previousValue: undefined,
      isFirstChange() { return true }
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobDetailColumnViewComponent],
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
          provide: Router,
          useValue: RouterSpy
        },
        provideMockStore(),
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent
    (JobDetailColumnViewComponent);
    component = fixture.componentInstance;
    component.job = jobDetailMock;
    translateService = TestBed.inject(TranslateService);
    applicationDetailsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Feature Pack failure tests', () => {

    it('should set fpReadFailure to true if read details fails', () => {
      // GIVEN
      spyOn(applicationDetailsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(failureMock));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.fpReadFailure).toBeTrue();
    });

    it('should NOT set fpReadFailure to true if read details does not fail', () => {
      // GIVEN
      spyOn(applicationDetailsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(null));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.fpReadFailure).not.toBeTrue();
    });
  });

  it('should navigate to FeaturePack table for Feature Pack type', () => {
    //GIVEN
    component.ngOnChanges(jobChange);
    spyOn(component, '_navigateAway').and.callThrough();

    //WHEN
    component.onHyperlinkClicked({label: "job.FEATURE_PACK"});

    //THEN
    expect(component._navigateAway).toHaveBeenCalledWith({}, RoutingPathContent.FeaturePacks);
    expect(RouterSpy.navigate).toHaveBeenCalledWith([RoutingPathContent.FeaturePacks], {
      queryParams: {},
    });
  });

  it('should navigate to FeaturePackDetail with proper query params for Application type', () => {

    //GIVEN
    component.ngOnChanges(jobChange);
    spyOn(component, '_navigateAway').and.callThrough();

    //WHEN
    component.onHyperlinkClicked({label: "job.APPLICATION"});

    //THEN
    expect(component._navigateAway).toHaveBeenCalledWith({
      id: jobDetailMock.featurePackId,
      applicationId: jobDetailMock.applicationId,
      linkAwaySection: "APPLICATIONS"
    });
    expect(RouterSpy.navigate).toHaveBeenCalledWith([RoutingPathContent.FeaturePackDetail], {
      queryParams: {
        id: jobDetailMock.featurePackId,
        applicationId: jobDetailMock.applicationId,
        linkAwaySection: "APPLICATIONS"
      },
    });
  });

  it('should navigate to Schedules table with a persisted jobSheduleId ', () => {

    //GIVEN
    spyOn(component, '_navigateAway').and.callThrough();

    component.job.jobScheduleId = "test_1234";

    //WHEN
    component.onHyperlinkClicked({label: "job.SCHEDULE_ID"});

    //THEN
    expect(component._navigateAway).toHaveBeenCalledWith({}, RoutingPathContent.SchedulesTable );
    expect(RouterSpy.navigate).toHaveBeenCalledWith([RoutingPathContent.SchedulesTable], {queryParams: {}});

    expect(sessionStorage.getItem('jobScheduleId')).toBe('{"jobScheduleId":"test_1234"}');

    sessionStorage.removeItem('jobScheduleId');
  });

  it('should add description if skipDescription false (default value)', () => {

    //WHEN
    component.ngOnChanges(jobChange);

    //THEN
    expect(_isLabelInInformationItems("job.DESCRIPTION")).toBeTrue();
  });

  it('should not add description if skipDescription set', () => {

    //GIVEN
    component.skipDescription = true;

    //WHEN
    component.ngOnChanges(jobChange);

    //THEN
    expect(_isLabelInInformationItems("job.DESCRIPTION")).toBeFalse();
  });

  it('should not add discovered object counts if discoveredObjectsCount == 0', () => {

    //GIVEN
    const testMock = { ...jobDetailMock };
    testMock.discoveredObjectsCount = 0;

    //WHEN
    component._setJobDetails(testMock);

    //THEN
    expect(_isLabelInInformationItems("job.DISCOVERED_OBJECTS_COUNT")).toBeFalse();
    expect(_isLabelInInformationItems("job.RECONCILED_OBJECTS_COUNT")).toBeFalse();
    expect(_isLabelInInformationItems("job.RECONCILED_OBJECTS_ERROR_COUNT")).toBeFalse();
  });

  it('should add discovered object counts if discoveredObjectsCount != 0', () => {

    //GIVEN
    const testMock = { ...jobDetailMock };
    testMock.discoveredObjectsCount = 10;
    testMock.reconciledObjectsCount = 8;
    testMock.reconciledObjectsErrorCount = 2;

    //WHEN
    component._setJobDetails(testMock);

    //THEN
    expect(_isLabelInInformationItems("job.DISCOVERED_OBJECTS_COUNT")).toBeTrue();
    expect(_isLabelInInformationItems("job.RECONCILED_OBJECTS_COUNT")).toBeTrue();
    expect(_isLabelInInformationItems("job.RECONCILED_OBJECTS_ERROR_COUNT")).toBeTrue();
  });

  it('should add Error if errorMessage set', () => {

    //GIVEN
    const testMock = { ...jobDetailMock };
    testMock.errorMessage = "MyError";

    //WHEN
    component._setJobDetails(testMock);

    //THEN
    const error = component.informationItems.find((item) => item.label === "ERROR");
    expect(error.value).toBe("MyError");
  });

  it('should translate the status if translation exists', () => {

    //GIVEN
    const reconcileInProgressStatus = 'RECONCILE_INPROGRESS';
    const reconcileInProgressTranslatedStatus = 'Reconcile in progress';

    spyOn(translateService, 'instant').withArgs('state.RECONCILE_INPROGRESS').and.returnValue(reconcileInProgressTranslatedStatus);

    //WHEN
    const result = component._translateStatus(reconcileInProgressStatus);

    //THEN
    expect(result).toEqual(reconcileInProgressTranslatedStatus);
  });

  function _isLabelInInformationItems(label) {
    return component.informationItems.some((item) => item.label === label);
  }
});
