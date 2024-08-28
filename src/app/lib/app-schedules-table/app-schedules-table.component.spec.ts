import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject, of } from 'rxjs';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { AppItemTableButton } from 'src/app/components/app-item-table-view/app-item-table-view.component.config';
import { AppSchedulesTableComponent } from './app-schedules-table.component';
import { CreateJobInformationFormComponent } from 'src/app/components/create-job/create-job-information-form/create-job-information-form.component';
import { CreateScheduleFormComponent } from 'src/app/components/create-schedule/create-schedule-form/create-schedule-form.component';
import { DeleteScheduleHandlerService } from 'src/app/services/delete-schedule-handler.service';
import { JobSchedulesFacadeService } from '../job-schedules/services/job-schedules-facade.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TabsService } from 'src/app/services/tabs/tabs.service';
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';
import { provideMockStore } from '@ngrx/store/testing';
import { sessionStorageKeys } from 'src/app/constants';
import { jobMock } from '../app-jobs-table/app-job-table.mock.data';

describe('AppScheduleTableComponent', () => {
  let component: AppSchedulesTableComponent;
  let fixture: ComponentFixture<AppSchedulesTableComponent>;
  let deleteScheduleHandlerService: DeleteScheduleHandlerService;

  let matDialog;
  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppSchedulesTableComponent ],
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
          provide: CreateScheduleFormComponent,
          useValue: jasmine.createSpyObj('CreateScheduleFormComponent', ['isDirty'])
        },
        {
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: JobSchedulesFacadeService,
          useClass: JobSchedulesFacadeService
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppSchedulesTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    deleteScheduleHandlerService = TestBed.inject(DeleteScheduleHandlerService);
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
    expect(component.schedulesTableConfig.searchPlaceholder).toEqual('SCHEDULE_SEARCH_PLACEHOLDER');
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

  it('should set isSecondRightPanelShown to false when onCloseSecondRightPanel called', () => {
    // GIVEN
    component.isSecondRightPanelShown = true;

    // WHEN
    component.onCloseSecondRightPanel();

    // THEN
    expect(component.isSecondRightPanelShown).toBeFalse();
  });

  it('should reset component setting on onSearchFilterChanged', () => {
    // WHEN
    component.onSearchFilterChanged();

    // THEN
    expect(component.isLeftMenuShown).toBeTrue;
    expect(component.isFirstRightPanelShown).toBeFalse();
  });

  it('should set forceReloadTable to true on Schedule Updated', () => {
    // GIVEN

    component.forceReloadTable = false;
    // WHEN
    component.onScheduleUpdated();

    // THEN
    expect(component.forceReloadTable).toBeTrue;
  });

  describe('Filter tests', () => {
    it('should set filter id when session key set ', () => {
      // GIVEN
      window.sessionStorage.setItem(sessionStorageKeys.jobScheduleId, JSON.stringify({jobScheduleId: '123'}));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.filter).toEqual({ id: '123' });
      expect(window.sessionStorage.getItem(sessionStorageKeys.jobScheduleId)).toBeNull();
    });
  });

  describe('createSchedule tests', () => {
    it('should show create schedule in right panel when create schedules pressed', () => {
      //WHEN
      component.schedulesTableConfig.iconButtonActions[0].actionHandler();

      //THEN
      expect(component.isFirstRightPanelShown).toBeTrue();
      expect(component.isCreateScheduleShown).toBeTrue();
    });

    it('should set forceReloadTable to true WHEN create schedule success', () => {
      //WHEN
      component.onCreateScheduleSuccess();

      //THEN
      expect(component.forceReloadTable).toBeTrue();
    });

    it('should set isCreateScheduleShown to false WHEN create schedule success', () => {
      // GIVEN
      component.isCreateScheduleShown = true;
      component.rightPanelTitle = "abc";

      //WHEN
      component.onCreateScheduleSuccess();

      //THEN
      expect(component.isCreateScheduleShown).toBeFalse();
      expect(component.rightPanelTitle).toEqual("navigation.SCHEDULE_DETAILS");

    });

  });

  describe('cancel Schedule tests', () => {
    it('should show confirm dialog and close panels when schedule cancel and form is dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      const createScheduleMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createScheduleForm = createScheduleMock;
      createScheduleMock.isDirty.and.returnValue(true);

      component.isCreateScheduleShown = true;
      component.isFirstRightPanelShown = true;

      // WHEN
      component.onCancelSchedule();

      // THEN
      expect(showSpy).toHaveBeenCalled();
      expect(component.isFirstRightPanelShown).toBeFalse();
    });
  });

  describe('create schedule plus icon enabling tests for schedules table', () => {
    beforeEach(() => {
      const createScheduleMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      createScheduleMock.isDirty.and.returnValue(false);  // open but not dirty (changing row will remove it)
    });

    it('closing schedule form on change of row selection, should not make create schedule plus icon disabled', () => {
      // GIVEN
      component.isCreateScheduleShown = true;
      component.schedulesTableConfig.iconButtonActions[0].disabled = true;
      // WHEN
      component._handleSingleRowSelect(jobScheduleDetailsMock);

      // THEN
      expect(component.isCreateScheduleShown).toBeFalse();
      expect(component.schedulesTableConfig.iconButtonActions[0].disabled).toBeFalse();
      expect(component.schedulesTableConfig.iconButtonActions[0].iconPath).toEqual('./assets/icons/add-sign-icon.svg');
    });

    it("create schedule plus icon should be disabled when a create schedule form is already open", () => {
       // GIVEN
      component.isCreateScheduleShown = false;
      component.schedulesTableConfig.iconButtonActions[0].disabled = false;
      spyOn(component.tabsService, 'canCreateNewTab').and.returnValue(true);

       // WHEN
      component._onCreateScheduleButtonClick();

      // THEN
      expect(component.isCreateScheduleShown).toBeTrue();
      expect(component.schedulesTableConfig.iconButtonActions[0].disabled).toBeTrue();
      expect(component.schedulesTableConfig.iconButtonActions[0].iconPath).toEqual('./assets/icons/add-sign-icon-active.svg');
    });

    it("_onCreateScheduleButtonClick should clear the row selection", () => {
      // GIVEN
      component.isCreateScheduleShown = false;
      component.schedulesTableConfig.iconButtonActions[0].disabled = false;
      spyOn(component.tabsService, 'canCreateNewTab').and.returnValue(true);
      component.selectedSchedule = jobScheduleDetailsMock;

      // WHEN
      component._onCreateScheduleButtonClick();

      // THEN
      expect(component.selectedSchedule).toBeFalsy();
    });

    it('should NOT show confirm dialog when schedule cancel and form is NOT dirty', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.callThrough();
      const createScheduleMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      createScheduleMock.isDirty.and.returnValue(false);
      component.isCreateScheduleShown = true;

      // WHEN
      component.onCancelSchedule();

      // THEN
      expect(showSpy).not.toHaveBeenCalled();
    });

    it('canceling confirm leave dialog (for create job being dirty) should clear selected row', () => {
      // GIVEN
      const showSpy = spyOn(component.confirmationService, 'show').and.returnValue(of(false));
      spyOn(component, '_clearRowSelection').and.callThrough();

      const createScheduleMock = jasmine.createSpyObj(CreateJobInformationFormComponent, ['isDirty']);
      component.createScheduleForm = createScheduleMock;
      createScheduleMock.isDirty.and.returnValue(true);

      component.isCreateScheduleShown = true;

      // WHEN
      component.onSelectionChanged([{ id: 2, name: 'two' }]);

      // THEN
      expect(showSpy).toHaveBeenCalled();
      expect(component._clearRowSelection).toHaveBeenCalled();
    });
  });


  describe('onJobSelection tests', () => {

    it('should set selected job and open second pane when job selected', () => {
      // GIVEN
      component.isSecondRightPanelShown = false;

      // WHEN
      component.onJobSelection(jobMock);

      // THEN
      expect(component.selectedJob).toBe(jobMock);
      expect(component.isSecondRightPanelShown).toBeTrue();
    });

    it('should NOT open second pane if job selected is null', () => {
      // GIVEN
      component.isSecondRightPanelShown = false;

      // WHEN
      component.onJobSelection(null);

      // THEN
      expect(component.isSecondRightPanelShown).toBeFalse();
    });
  });

  describe('deleteSchedule tests', () => {

    it('should call deleteSchedule on delete action in table', () => {
      // GIVEN
      const spyDeleteAction = spyOn(deleteScheduleHandlerService, 'deleteSchedule');
      component.selectedSchedule = jobScheduleDetailsMock;

      // WHEN
      component.schedulesTableConfig.actionItems[0].handler(AppItemTableButton.DELETE);

      // THEN
      expect(spyDeleteAction).toHaveBeenCalled();
    });

    it('should NOT call deleteSchedule on delete action in table when NO selected schedule', () => {
      // GIVEN
      const spyDeleteAction = spyOn(deleteScheduleHandlerService, 'deleteSchedule');
      component.selectedSchedule = undefined;

      // WHEN
      component.schedulesTableConfig.actionItems[0].handler(AppItemTableButton.DELETE);

      // THEN
      expect(spyDeleteAction).not.toHaveBeenCalled();
    });

    it('should set forceReloadTable to true when deleteScheduleSuccessEvent is emitted', () => {
      // Create a spy object for the deleteScheduleSuccessEvent
      const deleteSuccessEventSpy = spyOn(deleteScheduleHandlerService.deleteScheduleSuccessEvent, 'pipe').and.returnValue(
        // Simulate the event emission using a Subject
        // This will trigger the subscription in the component
        new Subject<void>()
      );

      // Call the function in your component that subscribes to the event
      component.ngOnInit();

      // Verify that forceReloadTable is set to true after the event is emitted
      expect(component.forceReloadTable).toBeFalsy(); // Initial value should be false
      deleteSuccessEventSpy.calls.mostRecent().returnValue.subscribe(() => {
        expect(component.forceReloadTable).toBeTruthy(); // Should become true after event emission
      });

      // Emit the event (simulate the event being triggered)
      deleteScheduleHandlerService.deleteScheduleSuccessEvent.next(undefined);
    });

    it('should remove navigation tab when schedule job deleted', () => {

      spyOn(component.tabsService, 'removeAllTabsWithJobScheduleId').and.callThrough();

      // WHEN
      component.ngOnInit(); // init subscriptions
      component.deleteScheduleHandlerService.deleteFilteredJobsSuccessEvent.emit('2');

      // THEN
      expect(component.tabsService.removeAllTabsWithJobScheduleId).toHaveBeenCalledWith('2');
    });
  });

  describe('onSelectionChanged tests', () => {
    it('should close context right panel when selection is cleared', () => {
      // GIVEN
      component.isLeftMenuShown = false;
      component.isFirstRightPanelShown = true;

      // WHEN
      component.onSelectionChanged([]);

      // THEN
      expect(component.isLeftMenuShown).toBeTrue();
      expect(component.isFirstRightPanelShown).toBeFalse();
      expect(component.isSecondRightPanelShown).toBeFalse();
    });

    it('when selection is cleared should not close default flyout panel - i.e. schedules table create schedule form panel', () => {
      // GIVEN
      spyOn(component, 'onCloseFirstRightSidePanel').and.callThrough();

      component.isLeftMenuShown = false;
      component.isFirstRightPanelShown = true;
      component.isCreateScheduleShown = true;

      // WHEN
      component.onSelectionChanged([]);

      // THEN
      expect(component.isLeftMenuShown).toBeFalse();
      expect(component.isFirstRightPanelShown).toBeTrue();
      expect(component.onCloseFirstRightSidePanel).not.toHaveBeenCalled();
    });
  });
});
