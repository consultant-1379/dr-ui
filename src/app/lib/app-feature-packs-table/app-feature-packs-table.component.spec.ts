import { ActivatedRoute, Router } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { applicationDetailMock, featurePackMock, tableActionUninstallMock, tableActionUpdateMock } from './feature-pack-table.mock.data';

import { AppFeaturePacksTableComponent } from './app-feature-packs-table.component';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { DeleteFeaturePackHandlerService } from 'src/app/services/delete-feature-pack-handler.service';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { FeaturePackFacadeService } from '../feature-packs/services/feature-packs-facade.service';
import { FeaturePackFileHandlerService } from 'src/app/services/feature-pack-file-handler.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { jobMock } from '../app-jobs-table/app-job-table.mock.data';
import { provideMockStore } from '@ngrx/store/testing';
import { sessionStorageKeys } from 'src/app/constants';
import { applicationDataMock } from 'src/app/rest-services/feature-pack.service.mock';

describe('FeaturePacksTableComponent', () => {
  let component: AppFeaturePacksTableComponent;
  let fixture: ComponentFixture<AppFeaturePacksTableComponent>;
  let router: Router;
  let featurePackFileHandler: FeaturePackFileHandlerService;
  let deleteFeaturePackHandlerService: DeleteFeaturePackHandlerService;
  let featurePackFacadeService: FeaturePackFacadeService;
  let tabsService: TabsService;

  let createJobMock;
  let matDialog;

  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppFeaturePacksTableComponent],
      imports: [
        MatDialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        }),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ type: EntityType.FP })
          }
        },
        { provide: TabsService },
        {
          provide: TranslateService,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
          ,
        },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({})
          }
        },
        {
          provide: CreateJobInformationFormComponent,
          useValue: jasmine.createSpyObj('CreateJobInformationFormComponent', ['isDirty'])
        },
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFeaturePacksTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    TestBed.inject(ActivatedRoute);
    router = TestBed.inject(Router);
    featurePackFileHandler = TestBed.inject(FeaturePackFileHandlerService);
    deleteFeaturePackHandlerService = TestBed.inject(DeleteFeaturePackHandlerService);
    featurePackFacadeService = TestBed.inject(FeaturePackFacadeService);
    matDialog = TestBed.inject(MatDialog);
    tabsService = TestBed.inject(TabsService);
    spyOn(matDialog, 'open');
    createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
    component.createJobInformationForm = createJobMock;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onLinkAwayClick tests', () => {

    it('should navigate to feature pack details when onLinkAwayToFeaturePackDetails clicked', () => {
      // GIVEN
      component.selectedJob = jobMock;
      component.selectedFp = featurePackMock;
      const spyNavigate = spyOn(router, 'navigate');
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      // WHEN
      component.onLinkAwayToFeaturePackDetails('APPLICATIONS');

      // THEN
      expect(spyNavigate).toHaveBeenCalled();
      expect(spyNavigate).toHaveBeenCalledWith(['feature-pack-detail'],
        Object({ queryParams: Object({ id: '691fd10c-ff9b-11ed-be56-0242ac120002', linkAwaySection: 'APPLICATIONS' }) }));
    });
  });

  describe('Filter tests', () => {
    it('should set filter id when session key set ', () => {
      // GIVEN
      window.sessionStorage.setItem(sessionStorageKeys.featurePackId, JSON.stringify({featurePackId: '123'}));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.filter).toEqual({ id: '123' });
      expect(window.sessionStorage.getItem(sessionStorageKeys.featurePackId)).toBeNull();
    });
  });

  describe('Search tests', () => {

    it('search place holder text should be set on page load', () => {
      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.fpTableConfig.searchPlaceholder).toEqual('FEATURE_PACK_SEARCH_PLACEHOLDER');
    });

    it('should reset component setting on onSearchFilterChanged', () => {
      // WHEN
      component.onSearchFilterChanged();

      // THEN
      expect(component.isLeftMenuShown).toBeTrue;
      expect(component.isFirstRightPanelShown).toBeFalse();
    });
  });

  describe('Panel visibility tests', () => {
    it('Left Panel should be shown once page is fully initialized', () => {
      // WHEN
      component.ngAfterViewInit();

      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
    });

    it('second panel and third panel should be closed initially on page load', () => {
      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.isSecondPanelShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });

    it('should set isLeftMenuShown to false when onMainMenuLeftPanelCloseButtonClicked called', () => {
      // GIVEN
      expect(component.isLeftMenuShown).toBeTrue();

      // WHEN
      component.onMainMenuLeftPanelCloseButtonClicked();

      // THEN
      expect(component.isLeftMenuShown).toBeFalse();
    });

    it('should set isLeftMenuShown to true when onExpandMainMenuLeftPanelButtonClicked called', () => {
      // GIVEN
      expect(component.isLeftMenuShown).toBeTrue();

      // WHEN
      component.onExpandMainMenuLeftPanelButtonClicked();

      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isSecondPanelShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });

    it('should set panel visibility on table action', () => {
      // WHEN
      component.fpTableConfig.iconButtonActions[0].actionHandler();

      // THEN
      expect(component.isSecondPanelShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isCreateJobShown).toBeFalse();
    });

    it('should change panels visibility WHEN create job clicked', () => {
      // GIVEN
      component.selectedFp = featurePackMock;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      // WHEN
      component.onCreateJobClickedHandler();

      // THEN
      expect(component.isThirdRightPanelShown).toBeTrue();
      expect(component.isCreateJobShown).toBeTrue();
    });

    it('should change panels visibility WHEN second pane closed', () => {
      // GIVEN
      component.selectedFp = featurePackMock;
      component.isLeftMenuShown = false;
      component.isSecondPanelShown = true;
      component.isThirdRightPanelShown = true;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      // WHEN
      component.onCloseSecondRightPanel();

      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isSecondPanelShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });
  });

  describe('Action tests', () => {
    it('install feature pack should be called on onFeaturePackActionHandler', () => {
      // GIVEN
      spyOn(featurePackFileHandler, 'installFeaturePack');

      // WHEN
      component._onFeaturePackActionHandler();

      // THEN
      expect(featurePackFileHandler.installFeaturePack).toHaveBeenCalled();
    });

    it('deleteFeaturePack should be called on uninstall action in table', () => {
      // GIVEN
      const spyUninstallAction = spyOn(deleteFeaturePackHandlerService, 'deleteFeaturePack');

      // WHEN
      component.onTableActionClick(tableActionUninstallMock);

      // THEN
      expect(spyUninstallAction).toHaveBeenCalled();
    });

    it('deleteFeaturePack should be called on uninstall context action', () => {
      // GIVEN
      const spyUninstallAction = spyOn(deleteFeaturePackHandlerService, 'deleteFeaturePack');
      component.selectedFp = featurePackMock;

      // WHEN
      component.fpTableConfig.actionItems[1].handler('UNINSTALL');

      // THEN
      expect(spyUninstallAction).toHaveBeenCalled();
    });

    it('uninstallSuccessEvent should cause selection to be cleared', async () => {
      // GIVEN
      component.selectedFp = featurePackMock;
      const uninstallSuccessEvent = spyOn(deleteFeaturePackHandlerService.uninstallSuccessEvent, 'pipe').and.returnValue(
        // Simulate the event emission using a Subject
        // This will trigger the subscription in the component
        new Subject<void>()
      );
      component.ngOnInit();

      uninstallSuccessEvent.calls.mostRecent().returnValue.subscribe(() => {
        expect(component.forceReloadTable).toBeTruthy(); // Should become true after event emission
        expect(component.selectedFp).toBeNull();
      });

      // Emit the event (simulate the event being triggered)
      deleteFeaturePackHandlerService.uninstallSuccessEvent.next(undefined);
    });

    it('fileUploadSuccessEvent should cause selection to be cleared', async () => {
      // GIVEN
      component.selectedFp = featurePackMock;
      component.forceReloadTable = true;
      const fileUploadSuccessEvent = spyOn(featurePackFileHandler.fileUploadSuccessEvent, 'pipe').and.returnValue(
        // Simulate the event emission using a Subject
        // This will trigger the subscription in the component
        new Subject<void>()
      );
      component.ngOnInit();

      fileUploadSuccessEvent.calls.mostRecent().returnValue.subscribe(() => {
        expect(component.forceReloadTable).toBeTruthy(); // Should become true after event emission
      });

      // Emit the event (simulate the event being triggered)
      featurePackFileHandler.fileUploadSuccessEvent.next(undefined);
    });

    it('updateFeaturePack should be called on update action in table', () => {
      // GIVEN
      const spyUpdateAction = spyOn(featurePackFileHandler, 'updateFeaturePack');

      // WHEN
      component.onTableActionClick(tableActionUpdateMock);

      // THEN
      expect(spyUpdateAction).toHaveBeenCalled();
    });

    it('updateFeaturePack should be called on update action context action', () => {
      // GIVEN
      const spyUpdateAction = spyOn(featurePackFileHandler, 'updateFeaturePack');
      component.selectedFp = featurePackMock;

      // WHEN
      component.fpTableConfig.actionItems[0].handler('UPDATE');

      // THEN
      expect(spyUpdateAction).toHaveBeenCalled();
    });
  });

  describe('onApplicationSelection tests', () => {
    it('should open second panel when Application Card Selected', () => {
      // GIVEN
      component.selectedFp = featurePackMock;
      component.isLeftMenuShown = true;
      component.isSecondPanelShown = false;
      component.isThirdRightPanelShown = true;

      // WHEN
      component.onApplicationSelection(applicationDetailMock);

      // THEN
      expect(component.isLeftMenuShown).toBeFalse();
      expect(component.isSecondPanelShown).toBeTrue();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });
  });

  describe('onSelectionChanged tests', () => {
    it('when FP selection is cleared should close context flyout panels', () => {
      // GIVEN
      spyOn(component, 'onCloseFirstRightSidePanel').and.callThrough();
      component.isLeftMenuShown = false;
      component.isFirstRightPanelShown = true;
      component.isSecondPanelShown = true;
      component.isThirdRightPanelShown = true;

      // WHEN
      component.onFpSelectionChanged([]);

      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isFirstRightPanelShown).toBeFalse();
      expect(component.isSecondPanelShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });

    it('should call loadApplications on Feature Pack selection', () => {
      // GIVEN
      const spyLoadApplications = spyOn(featurePackFacadeService, 'loadApplications');

      // WHEN
      component.onFpSelectionChanged([featurePackMock]);

      // THEN
      expect(spyLoadApplications).toHaveBeenCalled();
    });

    it('when Job selection is cleared then close panels when no create job values input', () => {
      // GIVEN
      spyOn(component, 'onCloseFirstRightSidePanel').and.callThrough();
      component.isCreateJobShown = true;

      // WHEN
      component.onJobSelectionFromJobsList(undefined);

      // THEN
      expect(component.isCreateJobShown).toBeFalse();
    });
  });

  describe('cancel job tests', () => {

    it('should show confirm dialog and close panels when job cancel and form is dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      createJobMock.isDirty.and.returnValue(true);

      component.isCreateJobShown = true;
      component.isThirdRightPanelShown = true;

      // WHEN
      component._cancelJob(true);

      // THEN
      expect(showSpy).toHaveBeenCalled();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });

    it('should NOT show confirm dialog when job not cancelled', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      createJobMock.isDirty.and.returnValue(true);

      component.isCreateJobShown = true;

      // WHEN
      component._cancelJob(false);

      // THEN
      expect(showSpy).not.toHaveBeenCalled();
    });

    it('should NOT show confirm dialog and close panels when job cancel and form is NOT dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      createJobMock.isDirty.and.returnValue(false);

      component.isCreateJobShown = true;
      component.isThirdRightPanelShown = true;

      // WHEN
      component._cancelJob(true);

      // THEN
      expect(showSpy).not.toHaveBeenCalled();
      expect(component.isCreateJobShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });
  });

  describe('getApplications tests', () => {
    it('should update fp applications when getApplications returns', () => {
      // GIVEN
      component.selectedFp = { ...featurePackMock };
      component.selectedFp.applications = null;

      spyOn(component.featurePackFacadeService, 'getApplications')
        .and.returnValue(of([applicationDataMock]));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.selectedFp.applications).toEqual([applicationDataMock]);
      expect(component.fpDetailsConfig.selectableItems.length).toEqual(2);
    });

    it('should NOT update fp applications when getApplications returns and no FP selected', () => {
      // GIVEN
      component.selectedFp = null;

      spyOn(component.featurePackFacadeService, 'getApplications')
        .and.returnValue(of([applicationDataMock]));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.selectedFp).toBeNull();
    });
  });

  describe('create job tests', () => {

    it('should show create job panel when create job clicked', () => {
      // GIVEN
      component.isCreateJobShown = false;
      component.isThirdRightPanelShown = false;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      // WHEN
      component.onCreateJobClickedHandler();

      // THEN
      expect(component.isCreateJobShown).toBeTrue();
      expect(component.isThirdRightPanelShown).toBeTrue();
    });

    it('should NOT show create job panel when create job clicked and canCreateNewTab returns false', () => {
      // GIVEN
      component.isCreateJobShown = false;
      component.isThirdRightPanelShown = false;
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(false);

      // WHEN
      component.onCreateJobClickedHandler();

      // THEN
      expect(component.isCreateJobShown).toBeFalse();
      expect(component.isThirdRightPanelShown).toBeFalse();
    });
  });
});