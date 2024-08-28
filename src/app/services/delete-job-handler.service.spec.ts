import { ErrorType, TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { MatDialogMock, Spies } from '../mock-data/testbed-module-mock';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmationService } from '@erad/components';
import { DeleteJobHandlerService } from './delete-job-handler.service';
import { DeleteJobHandlerServiceMock } from './delete-job-handler.service.mock';
import { DnrFailure } from '../models/dnr-failure.model';
import { JobDetailsFacadeService } from '../lib/job-detail/services/job-details-facade.service';
import { JobDetailsFacadeServiceMock } from '../lib/job-detail/services/job-details-facade.service.mock';
import { JobStatus } from '../models/enums/job-status.enum';
import { MatDialog } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('DeleteJobHandlerService', () => {
  let service: DeleteJobHandlerService;
  let confirmationService: ConfirmationService;
  let jobService: JobDetailsFacadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModuleMock,
        RouterModule.forRoot([])
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provider: DeleteJobHandlerService,
          useClass: DeleteJobHandlerServiceMock
        },
        { provide: MatDialog, useClass: MatDialogMock },
        {
          provider: JobDetailsFacadeService,
          useClass: JobDetailsFacadeServiceMock
        },
        { provide: Store, useValue: Spies.StoreSpy },
      ]
    });
    service = TestBed.inject(DeleteJobHandlerService);
    confirmationService = TestBed.inject(ConfirmationService);
    jobService = TestBed.inject(JobDetailsFacadeService);

    spyOn(service.jobService, 'getJobDeleted').and.returnValue(of(true));
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    spyOn(service.jobService, 'getJobDetailsFailure').and.returnValue(of(mockFailure));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


  it('should call deleteJob on facade and show single row user confirm dialog when single job selected', waitForAsync(() => {
    //GIVEN
    spyOn(confirmationService, 'show').and.returnValue(of(true));
    spyOn(jobService, 'deleteJob');

    //WHEN
    service.deleteJobs([{ id: '123', status: JobStatus.COMPLETED, name: 'Analyst 1-0-1' }]);

    //THEN
    expect(confirmationService.show).toHaveBeenCalledOnceWith({
      header: 'DELETE_JOB_CONFIRM_HEADER',
      content: 'DELETE_JOB_CONFIRM_MESSAGE',
      cancelText: 'buttons.CANCEL',
      confirmButtonText: 'buttons.DELETE'
    });

    expect(jobService.deleteJob).toHaveBeenCalledWith('123', 'Analyst 1-0-1', true);
  }));


  it('should change confirm message when job in progress (and clear failure state)', waitForAsync(() => {
    //GIVEN
    spyOn(confirmationService, 'show').and.returnValue(of(true));
    spyOn(jobService, 'deleteJob');
    spyOn(jobService, 'clearFailureState');

    //WHEN
    service.deleteJobs([{ id: '123', status: JobStatus.RECONCILE_INPROGRESS, name: 'Analyst 1-0-1' }]);

    //THEN
    expect(confirmationService.show).toHaveBeenCalledOnceWith({
      header: 'DELETE_JOB_CONFIRM_HEADER',
      content: 'DELETE_MESSAGE_IN_PROGRESS_MANUAL_JOB' + 'DELETE_JOB_CONFIRM_MESSAGE',
      cancelText: 'buttons.CANCEL',
      confirmButtonText: 'buttons.DELETE'
    });

    expect(jobService.deleteJob).toHaveBeenCalledWith('123', 'Analyst 1-0-1', true);
    expect(jobService.clearFailureState).toHaveBeenCalled();
  }));


  it('should subscribe to jobDeleteFailure$ and show error dialog on failure', () => {
    //GIVEN
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    const showErrorDialogSpy = spyOn(service, '_showErrorDialog');
    service.jobDeleteFailure$ = of(mockFailure);

    //WHEN
    service._subscribeFailure();

    //THEN
    expect(showErrorDialogSpy).toHaveBeenCalledWith(mockFailure);
  });

  it('_subscribeSingleDeleteSuccess should handle success and emit delete success event', () => {
    //GIVEN
    service.jobDeleteSuccess$ = of(true);
    const emitSpy = spyOn(service.deleteSuccessEvent, 'emit');

    // WHEN
    service['_subscribeSingleDeleteSuccess']();

    // THEN
    service.jobDeleteSuccess$.subscribe();
    expect(emitSpy).toHaveBeenCalledWith(service.id);
  });

  it('_unsubscribeFromStore should remove subscriptions', () => {
    //GIVEN
    service._subscribeToStoreEvents();
    expect(service.subscriptions.length).toEqual(3);

    //WHEN
    service._unsubscribeFromStore();

    //THEN
    expect(service.subscriptions.length).toEqual(0);
  });

  it('deleteJobs (plural) should call filtered jobs API', () => {

    //GIVEN
    spyOn(confirmationService, 'show').and.returnValue(of(true));
    spyOn(jobService, 'deleteFilteredJobs');
    spyOn(jobService, 'clearFailureState');

    //WHEN
    service.deleteJobs([{ id: '1', status: JobStatus.DISCOVERY_INPROGRESS, name: 'Analyst 1-0-1' },
    { id: '2', status: JobStatus.COMPLETED, name: 'Analyst 1-0-2', jobScheduleId: "3" },
    { id: '3', status: JobStatus.DISCOVERY_FAILED, name: 'Analyst 1-0-3' }]);


    //THEN
    expect(confirmationService.show).toHaveBeenCalledOnceWith({
      header: 'DELETE_MULTIPLE_JOB_CONFIRM_HEADER',
      content: 'DELETE_MESSAGE_IN_PROGRESS_MANUAL_JOB'+'DELETE_MESSAGE_SCHEDULED_JOB_FOUND'+'DELETE_MULTIPLE_JOB_CONFIRM_MESSAGE',
      cancelText: 'buttons.CANCEL',
      confirmButtonText: 'buttons.DELETE'
    });

    expect(jobService.deleteFilteredJobs).toHaveBeenCalledWith({filters: "id==1,id==2,id==3"}, true);
    expect(jobService.clearFailureState).toHaveBeenCalled();
  });

  it('_subscribeMultipleDeleteSuccess should handle success and emit delete success event', () => {
    //GIVEN
    service.filteredJobsDeleteSuccess$ = of(3); // simulate 3 rows deleted
    const emitSpy = spyOn(service.filteredJobsDeleteSuccessEvent, 'emit');

    // WHEN
    service['_subscribeMultipleDeleteSuccess']();

    // THEN
    service.filteredJobsDeleteSuccess$.subscribe();
    expect(emitSpy).toHaveBeenCalledWith(3);
  });
});
