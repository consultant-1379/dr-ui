import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { ErrorType, TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatDialogRefSpy, discoveredObjectsMock, jobDetailsMock, jobMock, mockDynamicInputsDisplay, mockResponse, selectedItemsMock } from './reconcile-job-dialog.component.mock.data';
import { Observable, of } from 'rxjs';

import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { JobDetailsFacadeServiceMock } from 'src/app/lib/job-detail/services/job-details-facade.service.mock';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { ReconcileJobDialogComponent } from './reconcile-job-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { failureMock } from 'src/app/shared/common.mock';
import { provideMockStore } from "@ngrx/store/testing";

describe('ReconcileJobDialogComponent', () => {
  let component: ReconcileJobDialogComponent;
  let fixture: ComponentFixture<ReconcileJobDialogComponent>;
  let jobDetailsFacadeService: JobDetailsFacadeService;
  let appsFacadeService: ApplicationDetailsFacadeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReconcileJobDialogComponent],
      imports: [TranslateModuleMock],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: MatDialogMock },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: JobDetailsFacadeService,
          useClass: JobDetailsFacadeServiceMock
        },
        provideMockStore({})
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconcileJobDialogComponent);
    component = fixture.componentInstance;
    spyOn(component.reconcileLoadingFailure, 'emit');
    jobDetailsFacadeService = TestBed.inject(JobDetailsFacadeService);
    appsFacadeService = TestBed.inject(ApplicationDetailsFacadeService);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should only enable button if the form is valid', () => {
    //GIVEN
    component.loading = true;

    //WHEN
    const shouldDisableButton = component.shouldDisableButton();

    //THEN
    expect(shouldDisableButton).toBeTruthy();
  });

  it('should disable button when dynamicInputsDisplay is present but form is invalid', () => {
    //GIVEN
    component.dynamicInputsDisplay = mockDynamicInputsDisplay;
    component.loading = false;

    //WHEN
    const shouldDisableButton = component.shouldDisableButton();

    //THEN
    expect(shouldDisableButton).toBe(false);
  });

  it('should emit reconcileLoadingFailure and call close dialog on handleFailure', fakeAsync(() => {

    // WHEN
    spyOn(component, 'closeDialog');
    component._handleFailure(failureMock);

    // THEN
    expect(component.reconcileLoadingFailure.emit).toHaveBeenCalled();
    expect(component.closeDialog).toHaveBeenCalled();
  }));


  it('should call close dialog and getJobReconciled service on subscribeToReconcileSuccess', fakeAsync(() => {
    //GIVEN
    spyOn(component, 'closeDialog');
    const getJobReconciledSpy = spyOn(jobDetailsFacadeService, 'getJobReconciled').and.returnValue(of(true));

    // WHEN
    component._subscribeToReconcileSuccess();

    // THEN
    expect(component.closeDialog).toHaveBeenCalled();
    expect(getJobReconciledSpy).toHaveBeenCalled();
  }));


  it('should load job details on loadDetails', fakeAsync(() => {
    //GIVEN
    const loadJobDetailsSpy = spyOn(jobDetailsFacadeService, 'loadDetails');

    // WHEN
    component._loadJobDetails();

    // THEN
    expect(loadJobDetailsSpy).toHaveBeenCalled();
  }));

  it('should subscribe to job details and handle success', () => {
    //GIVEN
    const jobDetailsFacadeServiceSpy = spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(of(jobDetailsMock));
    spyOn(component, '_loadApplicationDetails');

    // WHEN
    component._subscribeForJobDetails();

    // THEN
    expect(jobDetailsFacadeServiceSpy).toHaveBeenCalled();
    expect(component.applicationId).toEqual(jobDetailsMock.applicationId);
    expect(component.applicationJobName).toEqual(jobDetailsMock.applicationJobName);
    expect(component.featurePackId).toEqual(jobDetailsMock.featurePackId);
    expect(component._loadApplicationDetails).toHaveBeenCalled();
  });

  it('should subscribe to job details and handle failure', () => {
    // GIVEN
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    const jobDetailsFacadeServiceSpy = spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(of(mockFailure));

    spyOn(component, '_handleFailure');

    // WHEN
    component._subscribeForJobDetails();

    // THEN
    expect(jobDetailsFacadeServiceSpy).toHaveBeenCalled();
    expect(component._handleFailure).toHaveBeenCalledWith(mockFailure);
  });


  it('should get job details on subscribeForJobDetails', fakeAsync(() => {
    //GIVEN
    const getJobDetailsSpy = spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(new Observable);

    // WHEN
    component._subscribeForJobDetails();

    // THEN
    expect(getJobDetailsSpy).toHaveBeenCalled();
  }));

  it('should get job details failure on subscribeForJobDetails', fakeAsync(() => {
    //GIVEN
    const getJobDetailsFailureSpy = spyOn(jobDetailsFacadeService, 'getJobDetailsFailure').and.returnValue(new Observable);

    // WHEN
    component._subscribeForJobDetails();

    // THEN
    expect(getJobDetailsFailureSpy).toHaveBeenCalled();
  }));

  it('should call getJobDetails, loadApplicationDetails on subscribeForJobDetails', () => {
    //GIVEN
    const getJobDetailsFailureSpy = spyOn(jobDetailsFacadeService, 'getJobDetails').and.returnValue(new Observable);
    const appsFacadeServiceSpy = spyOn(appsFacadeService, 'loadApplicationDetails');
    appsFacadeService

    //WHEN
    component._subscribeForJobDetails();

    //THEN
    expect(getJobDetailsFailureSpy).toHaveBeenCalled();

    jobDetailsFacadeService.getJobDetails().subscribe((jobDetail) => {
      expect(jobDetail).toEqual(jobMock);

      expect(appsFacadeServiceSpy).toHaveBeenCalledWith('', jobDetail.name);
    });

  });

  it('should emit reconcileOngoing event, subscribe to reconcile success, and reconcile selected items on reconcileJob', () => {
    // GIVEN
    spyOn(component.reconcileOngoing, 'emit');
    spyOn(component, '_subscribeToReconcileSuccess');
    spyOn(component, '_reconcileSelectedItems');
    spyOn(component, '_reconcileAll');

    // WHEN
    component.reconcileJob();

    // THEN
    expect(component.reconcileOngoing.emit).toHaveBeenCalled();
    expect(component._subscribeToReconcileSuccess).toHaveBeenCalled();
    expect(component._reconcileSelectedItems).not.toHaveBeenCalled();
    expect(component._reconcileAll).toHaveBeenCalled();
  });


  it('should reconcile selected items when selectedItems has items on reconcileJob', () => {
    // GIVEN
    spyOn(component.reconcileOngoing, 'emit');
    spyOn(component, '_subscribeToReconcileSuccess');
    spyOn(component, '_reconcileSelectedItems');
    spyOn(component, '_reconcileAll');

    component.selectedItems = discoveredObjectsMock.items;

    // WHEN
    component.reconcileJob();

    // THEN
    expect(component.reconcileOngoing.emit).toHaveBeenCalled();
    expect(component._subscribeToReconcileSuccess).toHaveBeenCalled();
    expect(component._reconcileSelectedItems).toHaveBeenCalled();
    expect(component._reconcileAll).not.toHaveBeenCalled();
  });


  it('should call loadApplicationDetails with the correct parameters', () => {
    // GIVEN
    component.featurePackId = '456';
    component.applicationId = '123';
    const appsFacadeServiceSpy = spyOn(appsFacadeService, 'loadApplicationDetails');

    // WHEN
    component._loadApplicationDetails();

    // THEN
    expect(appsFacadeServiceSpy).toHaveBeenCalledWith('456', '123');
  });


  it('should call reconcileAllJob with the correct parameters', () => {
    //GIVEN
    component.jobId = '123';
    component.dynamicInputsDisplay = mockDynamicInputsDisplay;
    const reconcileAllJobSpy = spyOn(jobDetailsFacadeService, 'reconcileAllJob');

    // WHEN
    component._reconcileAll();

    // THEN
    expect(reconcileAllJobSpy).toHaveBeenCalledWith('123', { inputs: {} }, true);
  });

  it('should call reconcileJob with the correct parameters for selected items', () => {
    // GIVEN
    component.jobId = '123';
    component.selectedItems = selectedItemsMock;

    component.jobId = '123';
    component.dynamicInputsDisplay = mockDynamicInputsDisplay;
    const reconcileJobSpy = spyOn(jobDetailsFacadeService, 'reconcileJob');


    // WHEN
    component._reconcileSelectedItems();

    // THEN
    const expectedObjects = component.selectedItems.map(item => ({ objectId: item.objectId }));
    expect(reconcileJobSpy).toHaveBeenCalledWith('123', { inputs: {}, objects: expectedObjects }, true);
  });


  it('should subscribe to application details and handle success', () => {
    // GIVEN
    component.applicationJobName = 'job1-definition';

    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    const getApplicationDetailsSpy = spyOn(appsFacadeService, 'getApplicationDetails').and.returnValue(of(mockResponse));
    spyOn(appsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(mockFailure));

    // WHEN
    component._subscribeForReconcileInputs();

    // THEN
    expect(getApplicationDetailsSpy).toHaveBeenCalled();
    expect(component.reconcileInputs).toEqual([{ name: 'reconcileInput1', mandatory: true, description: 'Help message for input1' }]);
    expect(component.loading).toBe(false);
  });

  it('should subscribe to application details and handle failure', () => {
    // GIVEN
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    spyOn(appsFacadeService, 'getApplicationDetails').and.returnValue(of(mockResponse));
    const getApplicationDetailsFailureSpy = spyOn(appsFacadeService, 'getApplicationDetailsFailure').and.returnValue(of(mockFailure));

    spyOn(component, '_handleFailure');

    // WHEN
    component._subscribeForReconcileInputs();

    // THEN
    expect(getApplicationDetailsFailureSpy).toHaveBeenCalled();
    expect(component._handleFailure).toHaveBeenCalledWith(mockFailure);
  });

  it('should close the dialog when closeDialog is called', () => {
    // GIVEN
    spyOn(component.dialogRef, 'close');

    // WHEN
    component.closeDialog();

    // THEN
    expect(component.dialogRef.close).toHaveBeenCalled();
  })
});
