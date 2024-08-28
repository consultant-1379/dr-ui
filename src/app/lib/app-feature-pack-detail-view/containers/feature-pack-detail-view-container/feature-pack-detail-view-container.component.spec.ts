import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock, ConfigThemeService, ConfigThemeServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { Observable, of } from 'rxjs';
import { TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { applicationDataMock, mockFeaturePack } from './feature-pack-detail-view-container.component.mock.data';

import { ActivatedRoute } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Application } from 'src/app/models/application.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { ErrorType } from 'src/app/models/enums/error-type.enum';
import { FeaturePackDetailViewContainerComponent } from './feature-pack-detail-view-container.component';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { TranslateService } from '@ngx-translate/core';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { jobMock } from 'src/app/rest-services/jobs.service.mock';

const fakeActivatedRoute = { snapshot: { queryParams: { linkAwaySection: 'APPLICATIONS', applicationId: 'appId1', type: EntityType.JBS } } };

const mockApplication: Application = applicationDataMock[0];

describe('FeaturePackDetailViewContainerComponent', () => {
  let component: FeaturePackDetailViewContainerComponent;
  let fixture: ComponentFixture<FeaturePackDetailViewContainerComponent>;
  let actions$: Observable<any>;
  let tabsService: TabsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FeaturePackDetailViewContainerComponent
      ],
      imports: [
        BrowserAnimationsModule,
        TranslateModuleMock,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: CreateJobInformationFormComponent,
          useValue: jasmine.createSpyObj('CreateJobInformationFormComponent', ['isDirty'])
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        { provide: ActivatedRoute, useValue: fakeActivatedRoute },
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: ConfigLoaderService, useValue: ConfigLoaderServiceMock },
        { provide: ConfigThemeService, useValue: ConfigThemeServiceMock },
        TabsService,
        AppComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturePackDetailViewContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tabsService = TestBed.inject(TabsService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit tests', () => {
    let subscribeFeaturePackSpy : jasmine.Spy;
    let onCancelSpy: jasmine.Spy;

    beforeEach(() => {
      spyOn(tabsService, 'maxTabsOpened').and.returnValue(false);
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      subscribeFeaturePackSpy =  spyOn(component, 'subscribeToFeaturePackById').and.callThrough();
      onCancelSpy = spyOn(component, '_onCancel').and.callThrough();

      component.ngOnInit();

    });
    it("should call subscribeToFeaturePackById when ngOnInit called", () => {
      expect(subscribeFeaturePackSpy).toHaveBeenCalled();
    });

    it("should listen to onCancelEvent when ngOnInit called", fakeAsync(() => {
      component.createJobProcessingService.onCancel(true);
      tick();
      expect(onCancelSpy).toHaveBeenCalled();
    }));
  });

  describe('FeaturePackDetailFacadeService response tests', () => {

    beforeEach(() => {
      spyOn(tabsService, 'maxTabsOpened').and.returnValue(false);
    });

    it("should set downloadURL when feature pack read ", () => {
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      component.subscribeToFeaturePackById();
      expect(component.downloadURL).toBe('/discovery-and-reconciliation/v1/feature-packs/id1/files');
    });

    it("should set generalFeaturePackInfo when feature pack read ", () => {
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      component.subscribeToFeaturePackById();
      expect(component.generalFeaturePackInfo).toEqual([
        { "label": "featurePack.FP_NAME", "value": "name1" },
        { "label": "featurePack.ID", "value": "id1" },
        { "label": "featurePack.DESCRIPTION", "value": "desc1" },
        { "label": "featurePack.CREATED_AT", "value": "123", "isDate": true },
        { "label": "featurePack.ASSET", "value": "asset1" }
      ]);
    });

    it("should handle case of null returned by getFeaturePackDetailSuccess", () => {
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(null));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      component.subscribeToFeaturePackById();
      expect(component.downloadURL).toBeUndefined();  // in reality it could still be last set value ? (but not displaying widget anyway at this point)
    })

    it("should set featurePackInfo (response) to null for case of feature pack not found (failure case)", () => {
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(null));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of({
        type: ErrorType.BackEnd,
        errorCode: 'DR-01',
        errorMessage: 'Feature pack not found'
      }));

      component.featurePackInfo = mockFeaturePack
      component.featurePackInfoId = mockFeaturePack.id;

      component.subscribeToFeaturePackById();
      expect(component.featurePackInfo).toEqual(null);
      expect(component.featurePackInfoId).toEqual(null);
    });

    it( "should set isFeaturePackDetailsLoading flag for case of feature pack details being loaded)", () => {
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(null));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(true));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));
      component.isFeaturePackDetailsLoading = false;

      component.subscribeToFeaturePackById();
      expect(component.isFeaturePackDetailsLoading).toEqual(true);
    });

    it("should open left panel, close right flyOut and clear selected application card selection when feature pack updates (tab press)", () => {

      // GIVEN
      spyOn(component, 'onCloseFirstRightPanel').and.callThrough();
      component.applicationsCardViewComponent = jasmine.createSpyObj('ApplicationsCardViewComponent', ['clearSelection']);

      component.isRightPanelShown = true;
      component.isSecondRightPanelShown = false;
      component.isLeftPanelShown = false;
      component.featurePackInfoId = 'id999'; // changing existing feature pack in response

      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      // WHEN
      component.subscribeToFeaturePackById();

      // THEN
      expect(component.onCloseFirstRightPanel).toHaveBeenCalled();
      expect(component.applicationsCardViewComponent.clearSelection).toHaveBeenCalled();
      expect(component.isLeftPanelShown).toBeTrue(); /* reopens left panel */
    });

    it("should open left panel only when feature pack updates with same feature pack id (tab press)", () => {

      // GIVEN
      spyOn(component, 'onCloseFirstRightPanel').and.callThrough();
      component.applicationsCardViewComponent = jasmine.createSpyObj('ApplicationsCardViewComponent', ['clearSelection']);

      component.isRightPanelShown = true;
      component.isSecondRightPanelShown = false;
      component.isLeftPanelShown = false;
      component.featurePackInfoId = mockFeaturePack.id; // same id as existing feature pack in response

      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      // WHEN
      component.subscribeToFeaturePackById();

      // THEN
      expect(component.onCloseFirstRightPanel).not.toHaveBeenCalled();
      expect(component.selectedApplicationId).not.toBeUndefined();
      expect(component.applicationsCardViewComponent.clearSelection).not.toHaveBeenCalled();
      expect(component.isLeftPanelShown).toBeTrue(); /* reopens left panel */
    });

    it("should not open left panel when two panels already open on the right", () => {

      // GIVEN
      spyOn(component, 'onCloseFirstRightPanel').and.callThrough();
      component.applicationsCardViewComponent = jasmine.createSpyObj('ApplicationsCardViewComponent', ['clearSelection']);

      component.isRightPanelShown = true;
      component.isSecondRightPanelShown = true;
      component.isLeftPanelShown = false;
      component.featurePackInfoId = mockFeaturePack.id; // same id as existing feature pack in response

      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(mockFeaturePack));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(null));

      // WHEN
      component.subscribeToFeaturePackById();

      // THEN
      expect(component.onCloseFirstRightPanel).not.toHaveBeenCalled();
      expect(component.selectedApplicationId).not.toBeUndefined();
      expect(component.applicationsCardViewComponent.clearSelection).not.toHaveBeenCalled();
      expect(component.isLeftPanelShown).toBeFalse(); /* does not reopen left panel */
    });

    it("should open left panel on error  (and rest flags for isRightPanelShown, isSecondRightPanelShown)", () => {

      // GIVEN
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailSuccess').and.returnValue(of(null));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));
      spyOn(component.featurePackDetailFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of({
        type: ErrorType.BackEnd,
        errorCode: 'DR-01',
        errorMessage: 'Feature pack not found'
      }));

      component.isRightPanelShown = true;
      component.isSecondRightPanelShown = true;
      component.isLeftPanelShown = false;

       // WHEN
      component.subscribeToFeaturePackById();

      // THEN
      expect(component.isLeftPanelShown).toBeTrue(); /* reopens left panel */
      expect(component.isRightPanelShown).toBeFalse();
      expect(component.isSecondRightPanelShown).toBeFalse();
    });

  });

  describe('onCloseFirstRightPanel tests', () => {
    it("should set isLeftPanelShown to true, and others to false", () => {
      component.isRightPanelShown = true;
      component.isSecondRightPanelShown = true;
      component.isLeftPanelShown = false;

      component.onCloseFirstRightPanel();

      expect(component.isRightPanelShown).toBeFalse();
      expect(component.isSecondRightPanelShown).toBeFalse();
      expect(component.isLeftPanelShown).toBeTrue();
    });

    it("should call confirmation show when closing panel when dirty", () => {
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();

      const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createJobInformationForm = createJobMock;
      createJobMock.isDirty.and.returnValue(true);

      component.featurePackInfo = mockFeaturePack;
      component.application = mockApplication;

      component.onCloseFirstRightPanel();

      expect(showSpy).toHaveBeenCalled();
    });
  });

  describe('onCloseSecondRightPanel tests', () => {
    it("should set isSecondRightPanelShown to false", () => {
      component.isSecondRightPanelShown = true;

      component.onCloseSecondRightPanel();

      expect(component.isSecondRightPanelShown).toBeFalse();
    });
  });

  describe('onCloseEntityDetailButtonClicked tests', () => {
    it("should set isLeftPanelShown to false", () => {
      component.isLeftPanelShown = true;

      component.onCloseEntityDetailButtonClicked();

      expect(component.isLeftPanelShown).toBeFalse();
    });
  });

  describe('onApplicationCardSelected tests', () => {
    it("should set isLeftPanelShown to false", () => {
      component.isSecondRightPanelShown = true;

      component.onApplicationCardSelected(mockApplication);

      expect(component.isSecondRightPanelShown).toBeFalse();
    });
    it("should set isRightPanelShown to true", () => {
      component.isRightPanelShown = false;

      component.onApplicationCardSelected(mockApplication);

      expect(component.isRightPanelShown).toBeTrue();
    });
    it("should set selectedApplicationId to event application id", () => {
      component.selectedApplicationId = '1';

      component.onApplicationCardSelected(mockApplication);

      expect(component.selectedApplicationId).toBe(mockApplication.id);
      expect(component.application).toEqual(mockApplication);
    });
  });

  describe('onCreateJobFromPanelAction tests', () => {
    it("should show job creation form when canCreateNewTab is true", () => {
      //GIVEN
      component.featurePackInfo = mockFeaturePack;
      component.application = mockApplication;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      //WHEN
      component.onCreateJobFromPanelAction();

      //THEN
      expect(component.isSecondRightPanelShown).toBeTrue();
      expect(component.showCreateJobForm).toBeTrue();
    });

    it("should show right/create job panel canCreateNewTab is true", () => {
      //GIVEN
      component.featurePackInfo = mockFeaturePack;
      component.application = mockApplication;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      //WHEN
      component.onCreateJobFromPanelAction();

      //THEN
      expect(component.isSecondRightPanelShown).toBeTrue();
      expect(component.showCreateJobForm).toBeTrue();
      expect(component.isLeftPanelShown).toBeFalse();
    });
  });

  describe('Cancel event handling', () => {
    it('close second panel when job create cancelled', () => {
      component.isSecondRightPanelShown = true;

      component._onCancel(true);

      expect(component.isSecondRightPanelShown).toBeFalse();
    });

    it('close left panel when job create cancelled and showCreateJobForm true', () => {
      component.showCreateJobForm = true;
      component.selectedEntity === EntityType.JBS;
      component.isLeftPanelShown = true;

      component._onCancel(true);

      expect(component.isLeftPanelShown).toBeFalse();
    });

    it('close NOT second panel when job create NOT cancelled', () => {
      component.isSecondRightPanelShown = true;
      component._onCancel(false);
      expect(component.isSecondRightPanelShown).toBeTrue();
    });
  });

  describe('onJobSelection tests', () => {
    it("should show open isSecondRightPanelShown and close isLeftPanelShown", () => {
      component.isSecondRightPanelShown = false;
      component.isLeftPanelShown = true;

      component.onJobSelectionFromJobsList(jobMock);

      expect(component.isSecondRightPanelShown).toBeTrue();
      expect(component.isLeftPanelShown).toBeFalse();
    });

    it("should show open selectedJobDetail to job", () => {
      component.isSecondRightPanelShown = false;
      component.isLeftPanelShown = true;

      component.onJobSelectionFromJobsList(jobMock);

      expect(component.job).toEqual(jobMock);
    });
  });

  describe('onAccordionHeaderClicked tests', () => {
    it("should show close isRightPanelShown", () => {
      component.isRightPanelShown = true;

      component.onAccordionHeaderClicked('id1');

      expect(component.isRightPanelShown).toBeFalse();
    });
  });
});