import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { allFeaturePacksMockData, applicationDropdownMockData, featureDetailMockData, inputConfigDetailsMockData, inputConfigDropdownMockData, inputConfigsMockData } from './create-job-component.mock.data';

import { CreateJobComponent } from './create-job.component';
import { CreateJobInformationFormComponent } from './create-job-information-form/create-job-information-form.component';
import { CreateJobProcessingService } from 'src/app/lib/create-job/services/create-job-processing.service';
import { DynamicInputsDisplayComponent } from '../dynamic-inputs-display/dynamic-inputs-display.component';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackFacadeService } from 'src/app/lib/feature-packs/services/feature-packs-facade.service';
import { InputConfigDetailsFacadeService } from 'src/app/lib/input-configuration-details/service/input-configuration-details-facade.service';
import { InputConfigsFacadeService } from 'src/app/lib/input-configurations/services/input-configurations-facade.service';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

const RouterSpy = jasmine.createSpyObj(
  'Router',
  ['navigate']
);

let createJobProcessingService: CreateJobProcessingService;

// Remaining tests are in CreateJobInformationFormComponent
// sub class component which had access to DynamicInputsDisplayComponent child

describe('CreateJobComponent', () => {
  let component: CreateJobComponent;
  let fixture: ComponentFixture<CreateJobComponent>;

  let featurePackDetailsFacadeService: FeaturePackDetailsFacadeService;
  let featurePackFacadeService: FeaturePackFacadeService;
  let inputConfigsFacadeService: InputConfigsFacadeService;
  let inputConfigDetailsFacadeService: InputConfigDetailsFacadeService;
  let jobDetailsFacadeService: JobDetailsFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateJobComponent,
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
        {
          provide: Router,
          useValue: RouterSpy
        },
        {
          provide: TranslateService,
        },
        {
          provide: CreateJobProcessingService,
          useValue: jasmine.createSpyObj('CreateJobProcessingService', ['onCancel']),
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateJobComponent);
    component = fixture.componentInstance;
    createJobProcessingService = TestBed.inject(CreateJobProcessingService);

    featurePackDetailsFacadeService = TestBed.inject(FeaturePackDetailsFacadeService);
    featurePackFacadeService = TestBed.inject(FeaturePackFacadeService);
    inputConfigsFacadeService = TestBed.inject(InputConfigsFacadeService);
    inputConfigDetailsFacadeService = TestBed.inject(InputConfigDetailsFacadeService);
    jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);
    TestBed.inject(NotificationV2Service);
    fixture.detectChanges();

    spyOn(featurePackDetailsFacadeService, 'getFeaturePackDetails').and.returnValue(of(featureDetailMockData));
    spyOn(featurePackDetailsFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
    spyOn(featurePackDetailsFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

    spyOn(featurePackFacadeService, 'getAllFeaturePacks').and.returnValue(of(allFeaturePacksMockData));
    spyOn(featurePackFacadeService, 'getAllFeaturePacksLoading').and.returnValue(of(false));
    spyOn(featurePackFacadeService, 'getAllFeaturePacksFailure').and.returnValue(of(null));

    spyOn(inputConfigsFacadeService, 'getInputConfigurations').and.returnValue(of(inputConfigsMockData));
    spyOn(inputConfigsFacadeService, 'getInputConfigurationsLoading').and.returnValue(of(false));

    spyOn(inputConfigDetailsFacadeService, 'getInputConfigDetails').and.returnValue(of(inputConfigDetailsMockData));

    spyOn(jobDetailsFacadeService, 'getJobId').and.returnValue(of("4", "5")); // 4 will be ignored due to getJobId skip.
    spyOn(jobDetailsFacadeService, 'getJobDetailsLoading').and.returnValue(of(false));

  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  it('should reset all selections on destroy', () => {
    // GIVEN
    component.featurePackSelected = { label: 'test1', value: 'test' };
    component.applicationSelected = { label: 'test2', value: 'test' };
    component.inputConfigSelected = { label: 'test3', value: 'test' };
    component.appJobNameSelected = { label: 'test4', value: 'test' };
    component.applicationOptions = [{ label: 'test5', value: 'test' }];
    component.inputConfigOptions = [{ label: 'test6', value: 'test' }];
    component.configInputValues = [{ name: 'test7', value: 'test' }];
    component.appDiscoverInputs = [{ name: 'test8', mandatory: true }];

    // WHEN
    component.ngOnDestroy();

    // THEN
    expect(component.featurePackSelected).toBeNull();
    expect(component.applicationSelected).toBeNull();
    expect(component.inputConfigSelected).toBeNull();
    expect(component.appJobNameSelected).toBeNull();
    expect(component.applicationOptions).toEqual([]);
    expect(component.inputConfigOptions).toEqual([]);
    expect(component.configInputValues).toEqual([]);
    expect(component.appDiscoverInputs).toEqual([]);
  });

  describe("dropdown option change tests", () => {

    it('onFeaturePackOptionChange should reset selections and load feature pack details and input configs', () => {
      // GIVEN
      const event = {
        value: {
          label: "my feature pack",
          value: 'featurePackId',
        },
      };
      spyOn(component, 'resetAllSelections');
      spyOn(component.featurePackDetailsFacadeService, 'loadDetails');
      spyOn(component.inputConfigsFacadeService, 'loadInputConfigurations');

      // WHEN
      component.onFeaturePackOptionChange(event);

      // THEN
      expect(component.resetAllSelections).toHaveBeenCalled();
      expect(component.applicationSelected).toEqual(component.selectDropDownPlaceholder);

      expect(component.featurePackSelected).toEqual({
        label: "my feature pack",
        value: 'featurePackId',
      });
      expect(component.featurePackDetailsFacadeService.loadDetails).toHaveBeenCalledWith('featurePackId');
      expect(component.inputConfigsFacadeService.loadInputConfigurations).toHaveBeenCalledWith('featurePackId');
    });

    it('onApplicationsOptionChange should make job definitions selectable and load application details', () => {
      //GIVEN
      component.featurePackSelected = { value: 'featurePackId', label: 'my feature pack' };
      const event = {
        value: {
          label: "my application",
          value: 'applicationId',
        },
      };

      // WHEN
      component.onApplicationsOptionChange(event);

      // THEN
      expect(component.appJobNameSelected).toEqual(component.selectDropDownPlaceholder);
      expect(component.appDiscoverInputs).toEqual([]);
    });

    it('onJobDefinitionsChange should make job input configs (if present) say "select" if not previously selected', () => {
      //GIVEN
      const event = {
        selectedDropdown: {
          label: "my job definition",
          value: 'jobDefinitionId',
        },
        discoverInputs: [
          {
            name: 'input1',
            mandatory: true,
          }
        ],
        reconcileInputs: [
          { name: 'input2'}
        ]
      };

      // WHEN
      component.onJobDefinitionsChange(event);

      // THEN
      expect(component.appJobNameSelected).toEqual({
        label: "my job definition",
        value: 'jobDefinitionId',
      });
      expect(component.appDiscoverInputs).toEqual([
        {
          name: 'input1',
          mandatory: true,
        }
      ]);
      expect(component.inputConfigSelected).toEqual(component.selectDropDownPlaceholder);

    });


    it('onJobDefinitionsChange should change current input configs if they contain a previous selection', () => {
      //GIVEN
      const event = {
        selectedDropdown: { label: "my job definition", value: 'jobDefinitionId' },
        discoverInputs: [{ name: 'input1', mandatory: true }, { name: 'input2' }],
        reconcileInputs: [{ name: 'input3'}]
      };
      component.inputConfigSelected = { label: "my input config", value: 'inputConfigId' };
      spyOn(component, 'onInputConfigChange');

      // WHEN
      component.onJobDefinitionsChange(event);

      // THEN
      expect(component.appJobNameSelected).toEqual({
        label: "my job definition",
        value: 'jobDefinitionId',
      });
      expect(component.appDiscoverInputs).toEqual([
        {
          name: 'input1',
          mandatory: true,
        },
        { name: 'input2' }
      ]);
      expect(component.appReconcileInputs).toEqual([
        { name: 'input3' }
      ]);
      expect(component.onInputConfigChange).toHaveBeenCalled();
    });

    it('onInputConfigChange should load input config details', () => {
      //GIVEN
      const event = { value: { value: 'inputConfigId', label: 'my input config', description: "hello" } };
      component.featurePackSelected = { value: 'featurePackId', label: 'my feature pack' };
      spyOn(component.inputConfigDetailsFacadeService, 'loadInputConfigDetails');

      // WHEN
      component.onInputConfigChange(event);

      // THEN
      expect(component.inputConfigDetailsFacadeService.loadInputConfigDetails).toHaveBeenCalledWith('featurePackId', 'inputConfigId');
    });
  });

  // onCreate is tested in CreateJobInformationFormComponent

  describe("isDirty tests", () => {

    const _setPristine = () => {
      component.resetAllSelections();
    }

    beforeEach(() => {
      _setPristine();
    });

    it("should return true if job name is dirty", () => {
      component.jobNameValue = "my job name";
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if job description is dirty", () => {
      component.jobDescriptionValue = "my job description";
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if a feature pack is selected", () => {
      component.featurePackSelected = { label: 'test1', value: 'test' };
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if a application is selected", () => {
      component.applicationSelected = { label: 'test1', value: 'test' };
      expect(component.isDirty()).toBeTrue();
    });
    it("should return true if a job definition is selected", () => {
      component.appJobNameSelected = { label: 'test1', value: 'test' };
      expect(component.isDirty()).toBeTrue();
    });

    it("should return false if component is pristine", () => {
      expect(component.isDirty()).toBeFalse();
    });
  });

  it("onCancel should delegate to the createJobProcessingService", () => {
    component.onCancel();
    expect(createJobProcessingService.onCancel).toHaveBeenCalledWith(true);
  });

  describe("should throw an error if context inputs are inconsistent", () => {

    const errorMessage = `Internal UI Error: CreateJobComponents created with "featurePackSelected" or "applicationOptionSelected" inputs, would require both inputs not just one as we want to pre-populate both dropdowns when launching contextually`;

    it("should throw an error if have a featurePackSelected but no applicationSelected input", () => {
      component.preSelectedFeaturePackId = '123';
      component.applicationSelected = null;
      expect(() => component._updateForContextParams()).toThrowError(errorMessage);
    });
    it("should throw an error if have an applicationSelected but no featurePackSelected input", () => {
      component.preSelectedFeaturePackId = null;
      component.preSelectedApplicationId = '456';
      expect(() => component._updateForContextParams()).toThrowError(errorMessage);
    });
    it("should not have any issue if not launched contextually (no values set)", () => {
      component.featurePackSelected = null;
      component.applicationSelected = null;
      expect(() => component._updateForContextParams()).not.toThrowError(errorMessage);
    });
  });

  describe("successful subscription method tests", () => {

    it('_subscribeToAllFeaturePacks should update featurePackOptions (and add Select) on successful service call', (() => {

      component._subscribeToAllFeaturePacks();
      expect(featurePackFacadeService.getAllFeaturePacks).toHaveBeenCalled();
      expect(component.featurePackOptions).toEqual([component.selectDropDownPlaceholder, ...allFeaturePacksMockData]);
    }));

    it('_subscribeToFeaturePackDetails should update application dropdown options on success', (() => {

      component._subscribeToFeaturePackDetails();
      expect(featurePackDetailsFacadeService.getFeaturePackDetails).toHaveBeenCalled();
      expect(component.applicationOptions).toEqual([component.selectDropDownPlaceholder, ...applicationDropdownMockData]);
    }));

    it('_subscribeToInputConfigs should update inputConfigOptions  on success', (() => {

      component._subscribeToInputConfigs();
      expect(inputConfigsFacadeService.getInputConfigurations).toHaveBeenCalled();
      expect(component.inputConfigOptions).toEqual([component.selectDropDownPlaceholder, ...inputConfigDropdownMockData]);
    }));

    it('_subscribeToInputConfigs should update configInputValues on success', (() => {

      component._subscribeToInputConfigDetails();
      expect(inputConfigDetailsFacadeService.getInputConfigDetails).toHaveBeenCalled();
      expect(component.configInputValues).toEqual(inputConfigDetailsMockData.inputs);
    }));

    it('_subscribeToJobServices should show a success notification if an id is returned', fakeAsync(() => {
      // GIVEN
      const myCallBack = jasmine.createSpy('myCallBack').and.callFake((id) => { console.log("nextPagePath id is " + id)});
      spyOn(component, '_showSuccessCreateJobNotification');
      component.nextPagePath = 'job-detail';

      // WHEN
      component._subscribeToJobServices(myCallBack);
      tick();

      // THEN
      expect(jobDetailsFacadeService.getJobId).toHaveBeenCalled();
      expect(myCallBack).toHaveBeenCalled();
      expect(component._showSuccessCreateJobNotification).toHaveBeenCalledWith("5");
    }));
  });

});
