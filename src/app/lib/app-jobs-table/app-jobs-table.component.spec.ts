import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppItemTableButton } from 'src/app/components/app-item-table-view/app-item-table-view.component.config';
import { AppJobsTableComponent } from './app-jobs-table.component';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { DeleteJobHandlerService } from 'src/app/services/delete-job-handler.service';
import { JobDetailsFacadeService } from '../job-detail/services/job-details-facade.service';
import { JobDetailsFacadeServiceMock } from '../job-detail/services/job-details-facade.service.mock';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { jobMock } from './app-job-table.mock.data';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('AppJobsTableComponent', () => {
  let component: AppJobsTableComponent;
  let fixture: ComponentFixture<AppJobsTableComponent>;
  let jobDetailsFacadeService: JobDetailsFacadeService;
  let deleteJobHandlerService: DeleteJobHandlerService;
  let tabsService: TabsService;

  let matDialog;
  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppJobsTableComponent ],
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
        { provide: TabsService },
        {
          provide: TranslateService,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
,       },
        {
          provide: MatDialogRef,
          useValue: MatDialogRefSpy
        },
        {
          provide: CreateJobInformationFormComponent,
          useValue: jasmine.createSpyObj('CreateJobInformationFormComponent', ['isDirty'])
        },
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: JobDetailsFacadeService,
          useClass: JobDetailsFacadeServiceMock
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppJobsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);
    deleteJobHandlerService = TestBed.inject(DeleteJobHandlerService);
    tabsService = TestBed.inject(TabsService);
    matDialog = TestBed.inject(MatDialog);
    spyOn(matDialog, 'open');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('search place holder text should be set on page load', () => {
    // WHEN
    component.ngOnInit();

    // THEN
    expect(component.jobsTableConfig.searchPlaceholder).toEqual('JOB_SEARCH_PLACEHOLDER');
  });

  it('should show Left Panel when page is fully initialized', () => {
    // GIVEN
    component.ngAfterViewInit();

    expect(component.isLeftMenuShown).toBeTruthy();
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
  });

  it('should reset component setting on onSearchFilterChanged', () => {
    // WHEN
    component.onSearchFilterChanged();

    // THEN
    expect(component.isLeftMenuShown).toBeTrue;
    expect(component.isFirstRightPanelShown).toBeFalse();
  });

  describe('getJobDuplicated tests', () => {
    it('should set forceReloadTable to true when duplicate success', () => {
      // GIVEN
      spyOn(jobDetailsFacadeService, 'getJobDuplicated').and.returnValue(of(true));
      component.selectedJobs = [jobMock];

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.forceReloadTable).toBeTrue();
    });
  });

  describe('createJob tests', () => {

    it('should show create job in right panel when create jobs pressed and canCreateNewTab is true', () => {
      //GIVEN
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(true);

      //WHEN
      component.jobsTableConfig.iconButtonActions[0].actionHandler();

      //THEN
      expect(component.isFirstRightPanelShown).toBeTrue();
      expect(component.isCreateJobShown).toBeTrue();
    });

    it('should NOT show create job in right panel when create jobs pressed and canCreateNewTab is false', () => {
      //GIVEN
      spyOn(tabsService, 'canCreateNewTab').and.returnValue(false);

      //WHEN
      component.jobsTableConfig.iconButtonActions[0].actionHandler();

      //THEN
      expect(component.isCreateJobShown).toBeFalse();
    });
  });

  describe('cancel Job tests', () => {
    it('should NOT show confirm dialog when job not cancelled',async () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
     const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createJobInformationForm = createJobMock;
     createJobMock.isDirty.and.returnValue(true);

      component.isCreateJobShown = true;

      // WHEN
      component._cancelJob(false);

      // THEN
      expect(showSpy).not.toHaveBeenCalled();
    });

    it('should show confirm dialog and close panels when job cancel and form is dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createJobInformationForm = createJobMock;
      createJobMock.isDirty.and.returnValue(true);

      component.isCreateJobShown = true;
      component.isFirstRightPanelShown = true;

      // WHEN
      component._cancelJob(true);

      // THEN
      expect(showSpy).toHaveBeenCalled();
      expect(component.isFirstRightPanelShown).toBeFalse();
    });
  });

  describe('create job plus icon enabling tests for jobs table', () => {

    beforeEach(() => {
      const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      createJobMock.isDirty.and.returnValue(false);  // open but not dirty (changing row will remove it)
    });

    it('closing job form on change of row selection, should not make create job plus icon disabled', () => {
      // GIVEN
      component.isCreateJobShown = true;
      component.jobsTableConfig.iconButtonActions[0].disabled = true;
      // WHEN
      component._onSelectionChanged([jobMock]);

      // THEN
      expect(component.isCreateJobShown).toBeFalse();
      expect(component.jobsTableConfig.iconButtonActions[0].disabled).toBeFalse();
      expect(component.jobsTableConfig.iconButtonActions[0].iconPath).toEqual('./assets/icons/add-sign-icon.svg');
    });

    it("create job plus icon should be disabled when a create job form is already open", () => {
       // GIVEN
      component.isCreateJobShown = false;
      component.jobsTableConfig.iconButtonActions[0].disabled = false;
      spyOn(component.tabsService, 'canCreateNewTab').and.returnValue(true);

       // WHEN
      component._onCreateJobButtonClick();

      // THEN
      expect(component.isCreateJobShown).toBeTrue();
      expect(component.jobsTableConfig.iconButtonActions[0].disabled).toBeTrue();
      expect(component.jobsTableConfig.iconButtonActions[0].iconPath).toEqual('./assets/icons/add-sign-icon-active.svg');
    });

    it("_onCreateJobButtonClick should clear the row selection", () => {
      // GIVEN
      component.isCreateJobShown = false;
      component.jobsTableConfig.iconButtonActions[0].disabled = false;
      spyOn(component.tabsService, 'canCreateNewTab').and.returnValue(true);
      component.selectedJobs = [jobMock];

      // WHEN
      component._onCreateJobButtonClick();

      // THEN
      expect(component.selectedJobs.length).toEqual(0);
    });

    it('should NOT show confirm dialog when job cancel and form is NOT dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      createJobMock.isDirty.and.returnValue(false);
      component.isCreateJobShown = true;

      // WHEN
      component._cancelJob(true);

      // THEN
      expect(showSpy).not.toHaveBeenCalled();
    });

    it('canceling confirm leave dialog (for create job being dirty) should clear selected row', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.returnValue(of(false));
      spyOn(component, '_clearRowSelection').and.callThrough();

      const createJobMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createJobInformationForm = createJobMock;
      createJobMock.isDirty.and.returnValue(true);

      component.isCreateJobShown = true;

      // WHEN
      component._onSelectionChanged([{ id: 2, name: 'two' }]);

      // THEN
      expect(showSpy).toHaveBeenCalled();
      expect(component._clearRowSelection).toHaveBeenCalled();
    });
  });

  describe('deleteJob tests', () => {

    it('should call deleteJobs on delete action in table for single row select', () => {
      // GIVEN
      const spyDeleteAction = spyOn(deleteJobHandlerService, 'deleteJobs');
      component.selectedJobs = [{ id: '1', name: 'n1', status: JobStatus.COMPLETED }];

      // WHEN
      component.jobsTableConfig.actionItems[1].handler(AppItemTableButton.DELETE);

      // THEN
      expect(spyDeleteAction).toHaveBeenCalled();
    });

    it('should NOT call deleteJobs on delete action in table when NO selected job', () => {
      // GIVEN
      const spyDeleteAction = spyOn(deleteJobHandlerService, 'deleteJobs');
      component.selectedJobs = [];

      // WHEN
      component.jobsTableConfig.actionItems[1].handler(AppItemTableButton.DELETE);

      // THEN
      expect(spyDeleteAction).not.toHaveBeenCalled();
    });

    it('should  call deleteJobs on delete action when multiple selected jobs', () => {
      // GIVEN
      const spyDeleteAction = spyOn(deleteJobHandlerService, 'deleteJobs');
      component.selectedJobs = [
        { id: '1', name: 'n1', status: JobStatus.COMPLETED },
        { id: '2', name: 'n2', status: JobStatus.RECONCILE_INPROGRESS },
        { id: '3', name: 'n3', status: JobStatus.DISCOVERY_INPROGRESS }
      ];

      // WHEN
      component.jobsTableConfig.actionItems[1].handler(AppItemTableButton.DELETE);

      // THEN
      expect(spyDeleteAction).toHaveBeenCalled();
    });

    it('should call to clear row selection on single delete success and remove navigation tab', () => {

      spyOn(component.tabsService, 'removeTab').and.callThrough();

      component.selectedJobs = [
        { id: '2', name: 'n2', status: JobStatus.RECONCILE_INPROGRESS }
      ];
      component.forceReloadTable = false;
      component.isFirstRightPanelShown = true;

      // WHEN
      component.ngOnInit(); // init subscriptions
      component._contextButtonHandler("DELETE");
      component.deleteJobHandlerService.deleteSuccessEvent.emit('2');

      // THEN
      expect(component.forceReloadTable).toBe(true);
      expect(component.isFirstRightPanelShown).toBe(false);
      expect(component.selectedJobs).toEqual([]);
      expect(component.tabsService.removeTab).toHaveBeenCalledWith('2', false);
    });

    it('should call to clear row selection on filtered Jobs Delete Success Event', () => {

      spyOn(component.tabsService, 'removeTab').and.callThrough();

      component.selectedJobs = [
        { id: '2', name: 'n2', status: JobStatus.RECONCILE_INPROGRESS }
      ];
      component.forceReloadTable = false;
      component.isFirstRightPanelShown = true;

      // WHEN
      component.ngOnInit(); // init subscriptions
      component._contextButtonHandler("DELETE");
      component.deleteJobHandlerService.filteredJobsDeleteSuccessEvent.emit(4);

      // THEN
      expect(component.forceReloadTable).toBe(true);
      expect(component.isFirstRightPanelShown).toBe(false);
      expect(component.selectedJobs).toEqual([]);
      expect(component.tabsService.removeTab).toHaveBeenCalledWith('2', false);
    });
  });

  describe('duplicateJob tests', () => {
    it('should call duplicateJob on duplicate action in table', () => {
      // GIVEN
      const spyDuplicateAction = spyOn(jobDetailsFacadeService, 'duplicateJob');
      component.selectedJobs = [{ id: '1', name: 'n1', status: JobStatus.COMPLETED }];

      // WHEN
      component.jobsTableConfig.actionItems[0].handler(AppItemTableButton.DUPLICATE);

      // THEN
      expect(spyDuplicateAction).toHaveBeenCalled();
    });

    it('should NOT call duplicateJob on duplicate action in table when NO selected job', () => {
      // GIVEN
      const spyDuplicateAction = spyOn(jobDetailsFacadeService, 'duplicateJob');
      component.selectedJobs = [];

      // WHEN
      component.jobsTableConfig.actionItems[0].handler(AppItemTableButton.DUPLICATE);

      // THEN
      expect(spyDuplicateAction).not.toHaveBeenCalled();
    });
  });

  describe('onSelectionChanged tests', () => {
    it('should close context right panel when selection is cleared', () => {
      // GIVEN
      component.isLeftMenuShown = false;
      component.isFirstRightPanelShown = true;

      // WHEN
      component._onSelectionChanged([]);
      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isFirstRightPanelShown).toBeFalse();
    });

    it('when selection is cleared should not close default flyout panel - i.e. jobs table create job form panel', () => {
      // GIVEN
      spyOn(component, 'onCloseFirstRightSidePanel').and.callThrough();
      component.isLeftMenuShown = false;
      component.isFirstRightPanelShown = true;
      component.isCreateJobShown = true;

      // WHEN
      component.onSelectionChanged([]);

      // THEN
      expect(component.isLeftMenuShown).toBeFalse();
      expect(component.isFirstRightPanelShown).toBeTrue();
      expect(component.onCloseFirstRightSidePanel).not.toHaveBeenCalled();
    });

    it('should show delete all button when more than 1 row selected', () => {
      // GIVEN
      spyOn(component, 'onCloseFirstRightSidePanel').and.callThrough();

      // WHEN
      component._onSelectionChanged([jobMock, jobMock]);

      // THEN
      expect(component.actionItems.length).toBe(1);
      expect(component.actionItems[0].id).toEqual('delete-job-button-id');
    });
  });
});
