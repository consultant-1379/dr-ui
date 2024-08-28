import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInputsComponent } from './job-inputs.component';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { of } from 'rxjs';
import { applicationDataMock } from 'src/app/rest-services/feature-pack.service.mock';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideMockStore } from '@ngrx/store/testing';
import { jobDetailMock } from 'src/app/lib/app-job-detail-view/containers/app-job-detail-view-container/job-detail-view-container.component.mock.data';
import { SimpleChanges } from '@angular/core';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { ErrorType } from '@erad/utils';

describe('JobInputsComponent', () => {
  let component: JobInputsComponent;
  let fixture: ComponentFixture<JobInputsComponent>;
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
      declarations: [ JobInputsComponent ],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        provideMockStore(),
        {
          provide: TranslateService,
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInputsComponent);
    component = fixture.componentInstance;
    applicationDetailsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
    fixture.detectChanges();

    spyOn(applicationDetailsFacadeService, 'loadApplicationDetails');

    component.job = jobDetailMock;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('load applications success', () => {
    beforeEach(() => {
      spyOn(applicationDetailsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(undefined));
    });

    it('should load Application details when job changes ', () => {
      // WHEN
      component.ngOnChanges(jobChange);

      // THEN
      expect(applicationDetailsFacadeService.loadApplicationDetails).toHaveBeenCalled();
      expect(applicationDetailsFacadeService.loadApplicationDetails).toHaveBeenCalledWith(jobDetailMock.featurePackId, jobDetailMock.applicationId);
    });

    it('should set inputs when application details found', async () => {
      // GIVEN
      applicationDataMock.jobs = [
        {
          name: "job1-definition",
          "discover": {
            "inputs": [{
              "name": "jobProp1",
            },
            {
              "name": "jobProp2",
            }]
          },
          "reconcile": {
            "inputs": [{
              "name": "jobProp3",
            }]
          }
        }
      ];
      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(applicationDataMock));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(component.discoveryInputs).toEqual(['jobProp1: value1', 'jobProp2: value2']);
      expect(component.reconcileInputs).toEqual(['jobProp3: value3']);
    });

    it('should set inputs when application details found WHEN no reconcile inputs', () => {
      // GIVEN
      applicationDataMock.jobs = [
        {
          name: "job1-definition",
          "discover": {
            "inputs": [{
              "name": "jobProp1",
            },
            {
              "name": "jobProp2",
            },
            {
              "name": "jobProp3",
            }]
          }
        }
      ];
      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(applicationDataMock));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(component.discoveryInputs).toEqual(['jobProp1: value1', 'jobProp2: value2', 'jobProp3: value3']);
      expect(component.reconcileInputs).toEqual([]);
    });

    it('should set inputs when application details found WHEN ONLY reconcile inputs', () => {
      // GIVEN
      applicationDataMock.jobs = [
        {
          name: "job1-definition",
          "reconcile": {
            "inputs": [{
              "name": "jobProp1",
            },
            {
              "name": "jobProp2",
            },
            {
              "name": "jobProp3",
            }]
          }
        }
      ];
      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(applicationDataMock));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(component.reconcileInputs).toEqual(['jobProp1: value1', 'jobProp2: value2', 'jobProp3: value3']);
      expect(component.discoveryInputs).toEqual([]);
    });

    it('should set all to job inputs when no inputs found', () => {
      // GIVEN
      applicationDataMock.jobs = [];
      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(applicationDataMock));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(component.discoveryInputs).toEqual(['jobProp1: value1', 'jobProp2: value2', 'jobProp3: value3']);
    });
  });

  describe('load applications failure', () => {

    it('should subscribe to job details and handle failure', () => {
      // GIVEN
      spyOn(applicationDetailsFacadeService, 'getApplicationDetails').and.returnValue(of(undefined));
      const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
      const jobDetailsFacadeServiceSpy = spyOn(applicationDetailsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(mockFailure));

      // WHEN
      component._initSubscriptions();

      // THEN
      expect(jobDetailsFacadeServiceSpy).toHaveBeenCalled();
      expect(component.failure).toEqual(mockFailure);
    });
  });
});
