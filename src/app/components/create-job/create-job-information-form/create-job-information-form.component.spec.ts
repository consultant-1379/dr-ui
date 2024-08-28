import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CreateJobInformationFormComponent } from './create-job-information-form.component';
import { DynamicInputsDisplayComponent } from '../../dynamic-inputs-display/dynamic-inputs-display.component';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

describe('CreateJobInformationFormComponent', () => {
  let component: CreateJobInformationFormComponent;
  let fixture: ComponentFixture<CreateJobInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateJobInformationFormComponent,
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
    fixture = TestBed.createComponent(CreateJobInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.discoveryInputsDisplay).toBeTruthy();
  });

  it('should call expected methods from ngOnInit', () => {
    spyOn(component, '_subscribeToAllFeaturePacks');
    spyOn(component, '_subscribeToFeaturePackDetails');
    spyOn(component, '_subscribeToInputConfigs');
    spyOn(component, '_subscribeToInputConfigDetails');
    spyOn(component, '_updateForContextParams');

    component.ngOnInit();

    expect(component._subscribeToAllFeaturePacks).toHaveBeenCalled();
    expect(component._subscribeToFeaturePackDetails).toHaveBeenCalled();
    expect(component._subscribeToInputConfigs).toHaveBeenCalled();
    expect(component._subscribeToInputConfigDetails).toHaveBeenCalled();
    expect(component._updateForContextParams).toHaveBeenCalled();
  });

  it('should loadFeatureAllPacks from ngAfterViewInit', () => {
    spyOn(component, '_loadFeatureAllPacks');
    component.preSelectedFeaturePackId = '123';

    component.ngAfterViewInit();

    expect(component._loadFeatureAllPacks).toHaveBeenCalled();
  });

  // Tests requiring dynamicInputsDisplay for super class (CreateJobComponent) will be here
  describe('shouldDisable button tests', () => {

    const _createValidComponent = () => {
      spyOn(component.discoveryInputsDisplay, 'isFormValid').and.returnValue(true);
      component.onNameChangedText({ target: { value: "valid name", checkValidity: () => true } });
      component.onDescriptionChangedText({ target: { value: "valid description", checkValidity: () => true } });
      component.featurePackSelected = { label: 'test1', value: 'test' };
      component.applicationSelected = { label: 'test2', value: 'test' };
      component.inputConfigSelected = { label: 'test3', value: 'test' };
      component.appJobNameSelected = { label: 'test4', value: 'test' };
      component.applicationsLoading = false;
      component.createJobLoading = false;
      component.featurePacksLoading = false;
      component.inputConfigLoading = false;
    }

    it('should return false component is valid', () => {
      // GIVEN
      _createValidComponent();

      // WHEN
      const result = component.shouldDisableButton();
      // THEN
      expect(result).toBeFalse();
    });

    it('should return true if any component is loading', () => {
      // GIVEN
      _createValidComponent();
      component.inputConfigLoading = true;

      // WHEN
      const result = component.shouldDisableButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return true if any component is invalid', () => {
      // GIVEN
      _createValidComponent();
      component.onDescriptionChangedText({ target: { value: "invalid<>description", checkValidity: () => false } });

      // WHEN
      const result = component.shouldDisableButton();
      // THEN
      expect(result).toBeTrue();
    });

    it('should return true if any dropdown value has not been selected', () => {
      // GIVEN
      _createValidComponent();
      component.appJobNameSelected = { label: "null", value: null };

      // WHEN
      const result = component.shouldDisableButton();
      // THEN
      expect(result).toBeTrue();
    });
  });

  it('onCreate should call expected methods with expected values', () => {
    // GIVEN
    const subscribeSpy = spyOn(component, '_subscribeToJobServices');

    spyOn(component.discoveryInputsDisplay, 'getFormValues').and.returnValue(
      { vimZone: "cork", vimProjectName: "erad", userName: "joe", stepValue: "2" });

    spyOn(component.jobDetailsFacadeService, 'clearFailureState');
    spyOn(component.jobDetailsFacadeService, 'createJob');


    component.featurePackSelected = { value: 'featurePackId', label: 'my feature pack' };
    component.jobNameValue = 'my job name';
    component.jobDescriptionValue = 'my job description';
    component.applicationSelected = { value: 'myApplicationId', label: 'my application' };
    component.appJobNameSelected = { value: 'enm_cts', label: 'enm_cts_label' }; /* value and label same in production code (i.e. in get applications call)*/

    // WHEN
    component.onCreate();

    // THEN
    expect(subscribeSpy).toHaveBeenCalled();
    expect(component.jobDetailsFacadeService.clearFailureState).toHaveBeenCalled();
    expect(component.jobDetailsFacadeService.createJob).toHaveBeenCalledWith(
      {
        "name": "my job name",
        "description": "my job description",
        "featurePackId": "featurePackId",
        "featurePackName": "my feature pack",
        "applicationId": "myApplicationId",
        "applicationName": "my application",
        "applicationJobName": "enm_cts",
        "inputs": { vimZone: "cork", vimProjectName: "erad", userName: "joe", stepValue: "2" },
        "executionOptions": { autoReconcile: false }
      }
    );
  });

  it('onCreate should call expected methods with expected values with autoReconcile true', () => {
    // GIVEN
    component.autoReconcile = true;

    const subscribeSpy = spyOn(component, '_subscribeToJobServices');

    spyOn(component.discoveryInputsDisplay, 'getFormValues').and.returnValue(
      { vimZone: "cork", vimProjectName: "erad", userName: "joe", stepValue: "2" });

    const spy = jasmine.createSpyObj('reconcileInputsDisplay', ['getFormValues']);
    component.reconcileInputsDisplay = spy;
    spy.getFormValues.and.returnValue({ reconcileInput1: "r1" });

    spyOn(component.jobDetailsFacadeService, 'clearFailureState');
    spyOn(component.jobDetailsFacadeService, 'createJob');

    component.featurePackSelected = { value: 'featurePackId', label: 'my feature pack' };
    component.jobNameValue = 'my job name';
    component.jobDescriptionValue = 'my job description';
    component.applicationSelected = { value: 'myApplicationId', label: 'my application' };
    /* value and label same in production code (i.e. in get applications call)*/
    component.appJobNameSelected = { value: 'enm_cts', label: 'enm_cts_label' };

    // WHEN
    component.onCreate();

    // THEN
    expect(subscribeSpy).toHaveBeenCalled();
    expect(component.jobDetailsFacadeService.clearFailureState).toHaveBeenCalled();
    expect(component.jobDetailsFacadeService.createJob).toHaveBeenCalledWith(
      {
        "name": "my job name",
        "description": "my job description",
        "featurePackId": "featurePackId",
        "featurePackName": "my feature pack",
        "applicationId": "myApplicationId",
        "applicationName": "my application",
        "applicationJobName": "enm_cts",
        "inputs": { reconcileInput1: "r1", vimZone: "cork", vimProjectName: "erad", userName: "joe", stepValue: "2" },
        "executionOptions": { autoReconcile: true }
      });
    });
});
