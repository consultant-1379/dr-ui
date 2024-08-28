import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CreateJobInformationFormComponent } from '../../create-job/create-job-information-form/create-job-information-form.component';
import { CreateScheduleFormComponent } from './create-schedule-form.component';
import { DynamicInputsDisplayComponent } from '../../dynamic-inputs-display/dynamic-inputs-display.component';
import { ErrorType } from '@erad/utils';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

describe('CreateScheduleFormComponent', () => {
  let component: CreateScheduleFormComponent;
  let fixture: ComponentFixture<CreateScheduleFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateScheduleFormComponent,
        CreateJobInformationFormComponent,
        DynamicInputsDisplayComponent],
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
        TranslateService,
        {
          provide: Router,
          useValue: RouterSpy
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateScheduleFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
    expect(component.createJobInformationForm).toBeTruthy();
    expect(component.createJobInformationForm.discoveryInputsDisplay).toBeTruthy();
  });


  it('onCreate should call expected methods with expected values', () => {
    // GIVEN

    spyOn(component.jobScheduleDetailsFacadeService, 'clearFailureState');
    spyOn(component.jobScheduleDetailsFacadeService, 'createJobSchedule');
    const subscribeSpy = spyOn(component, '_subscribeToScheduleServices');


    component.scheduleNameValue = 'my schedule name';
    component.scheduleDescriptionValue = 'my schedule description';
    component.cronExpressionValue = '0 0/30 8-10 * * *';

    component.createJobInformationForm.featurePackSelected = { value: 'featurePackId', label: 'my feature pack' };
    component.createJobInformationForm.jobNameValue = 'my job name';
    component.createJobInformationForm.jobDescriptionValue = 'my job description';
    component.createJobInformationForm.applicationSelected = { value: 'myApplicationId', label: 'my application' };
    component.createJobInformationForm.appJobNameSelected = { value: 'enm_cts', label: 'enm_cts_label' }; /* value and label same in production code (i.e. in get applications call)*/


    // WHEN
    component.ngOnInit();
    component.onCreate();

    // THEN
    expect(subscribeSpy).toHaveBeenCalled();
    expect(component.jobScheduleDetailsFacadeService.clearFailureState).toHaveBeenCalled();
    expect(component.jobScheduleDetailsFacadeService.createJobSchedule).toHaveBeenCalledWith(
      {
        "name": "my schedule name",
        "description": "my schedule description",
        "expression": "0 0/30 8-10 * * *",
        "jobSpecification": {
          "name": "my job name",
          "description": "my job description",
          "featurePackId": "featurePackId",
          "featurePackName": "my feature pack",
          "applicationId": "myApplicationId",
          "applicationName": "my application",
          "applicationJobName": "enm_cts",
          "inputs": {},
          "executionOptions": { autoReconcile: false }
        }
      }
    );
  });

  describe("isDirty tests", () => {

    const _setPristine = () => {
      component.resetAllSelections();
    }

    beforeEach(() => {
      _setPristine();
    });

    it("should return true if schedule name is dirty", () => {
      component.scheduleNameValue = "my schedule name";
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if schedule description is dirty", () => {
      component.scheduleDescriptionValue = "my schedule description";
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if a cron expression is dirty", () => {
      component.cronExpressionValue = '0 0 6,19 * * *';
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if job specification is dirty", () => {
      spyOn(component.createJobInformationForm, 'isDirty').and.returnValue(true);
      expect(component.isDirty()).toBeTrue();
    });

    it("should return false if component is pristine", () => {
      spyOn(component.createJobInformationForm, 'isDirty').and.returnValue(false);
      expect(component.isDirty()).toBeFalse();
    });

    it("should return false if createJobInformationForm is somehow undefined (untouched)", () => {
      component.createJobInformationForm = null;
      expect(component.isDirty()).toBeFalse();
    });
  });

  describe('shouldDisableCreate button tests', () => {

    const _createValidComponent = () => {
      component.onScheduleNameChanged({ target: { value: "valid name", checkValidity: () => true } });
      component.onCronExpressionChanged({ target: { value: "0 0 9-17 * * MON-FRI" } });
      component.onScheduleDescriptionChanged({ target: { value: "valid description" } });
    }

    it('should return false component is valid', () => {
      // GIVEN
      _createValidComponent();
      spyOn(component.createJobInformationForm, 'shouldDisableButton').and.returnValue(false);

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeFalse();
    });

    it('should return true if any component is loading', () => {
      // GIVEN
      _createValidComponent();
      component.createScheduleLoading = true;

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return true if any component is invalid', () => {
      // GIVEN
      _createValidComponent();
      component.onScheduleNameChanged({ target: { value: "invalid<>name", checkValidity: () => false } });

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return false if job specification component is invalid', () => {
      // GIVEN
      _createValidComponent();
      spyOn(component.createJobInformationForm, 'shouldDisableButton').and.returnValue(true);

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return false if job specification component is somehow undefined', () => {
      // GIVEN
      _createValidComponent();
      component.createJobInformationForm = null;

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return false if chron expression is not defined', () => {
      // GIVEN
      _createValidComponent();
      component.onCronExpressionChanged({ target: { value: undefined } });

      // WHEN
      const result = component.shouldDisableCreateButton();
      // THEN
      expect(result).toBeTrue();
    });
  });


  it('onCancel should emit cancelClicked', () => {
    spyOn(component.cancelClicked, 'emit');
    component.onCancel();
    expect(component.cancelClicked.emit).toHaveBeenCalled();
  });

  it('resetAllSelections should reset all fields and call createJobInformationForm.resetAllSelections', () => {
    spyOn(component.createJobInformationForm, 'resetAllSelections');
    component.scheduleNameValue = "my schedule name";
    component.scheduleDescriptionValue = "my schedule description";
    component.cronExpressionValue = "0 0 9-17 * * MON-FRI";
    component.resetAllSelections();
    expect(component.scheduleNameValue).toBe('');
    expect(component.scheduleDescriptionValue).toBe('');
    expect(component.cronExpressionValue).toBe('');
  });

  it('_showSuccessCreateJobNotification should send expected notification', () => {

    spyOn(component.notificationV2Service, 'success');

    component._showSuccessCreateJobNotification('106');

    expect(component.notificationV2Service.success).toHaveBeenCalledWith({
      title: 'createSchedule.TITLE',
      description: 'messages.JOB_SCHEDULE_CREATED_SUCCESS'
    });
  });


  describe("_subscribeToScheduleServices", () => {

    it('_subscribeToScheduleServices should subscribe to jobScheduleDetailsFacadeService', () => {
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(new Observable());
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleId').and.returnValue(new Observable());
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(new Observable());

      component._subscribeToScheduleServices();

      expect(component.jobScheduleDetailsFacadeService.getJobScheduleLoading).toHaveBeenCalled();
      expect(component.jobScheduleDetailsFacadeService.getJobScheduleId).toHaveBeenCalled();
      expect(component.jobScheduleDetailsFacadeService.getJobScheduleFailure).toHaveBeenCalled();
    });

    it('jobDetailsFacadeService should change createScheduleLoading to true', () => {
      // GIVEN
      component.createScheduleLoading = false;

      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(of(true));
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleId').and.returnValue(new Observable());
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(new Observable());
      // WHEN
      component.ngOnInit();
      // THEN
      expect(component.createScheduleLoading ).toBe(true);
    });

    it('jobDetailsFacadeService should change createScheduleLoading to false', () => {
      // GIVEN
      component.createScheduleLoading = true;

      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(of(false));
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleId').and.returnValue(new Observable());
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(new Observable());
      // WHEN
      component.ngOnInit();
      // THEN
      expect(component.createScheduleLoading ).toBe(false);
    });


    it('jobDetailsFacadeService should change failedToCreateJobSchedule  to true', () => {
      // GIVEN
      component.failedToCreateJobSchedule  = false;

      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(of(false));
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleId').and.returnValue(new Observable());
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(of({
        type: ErrorType.BackEnd,
        errorCode: 'DR-17',
        errorMessage: 'Job not found'
      }));
      // WHEN
      component.ngOnInit();
      // THEN
      expect(component.failedToCreateJobSchedule ).toBe(true);
    });

    it('jobDetailsFacadeService should emit success for id when not failedToCreateJobSchedule', () => {
      // GIVEN
      component.failedToCreateJobSchedule  = false;
      spyOn(component.createScheduleSuccess, 'emit');
      spyOn(component, '_showSuccessCreateJobNotification');


      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(of(false));
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleId').and.returnValue(of(null, "schedule_id"));
      spyOn(component.jobScheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(new Observable());
      // WHEN
      component.ngOnInit();
      // THEN
      expect(component.failedToCreateJobSchedule ).toBe(false);
      expect(component.createScheduleSuccess.emit).toHaveBeenCalledWith("schedule_id");
      expect(component._showSuccessCreateJobNotification).toHaveBeenCalledWith("schedule_id");
    });
  });
});
