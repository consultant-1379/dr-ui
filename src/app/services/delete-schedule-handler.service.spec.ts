import { ErrorType, TranslateServiceMock } from '@erad/utils';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogMock, Spies } from '../mock-data/testbed-module-mock';
import { TranslateModule, TranslatePipe, TranslateService } from '@ngx-translate/core';

import { DeleteScheduleConfirmDialogComponent } from '../components/delete-schedule-confirm-dialog/delete-schedule-confirm-dialog.component';
import { DeleteScheduleHandlerService } from './delete-schedule-handler.service';
import { DeleteScheduleHandlerServiceMock } from './delete-schedule-handler.service.mock';
import { DnrFailure } from '../models/dnr-failure.model';
import { Job } from '../models/job.model';
import { JobDetailsFacadeService } from '../lib/job-detail/services/job-details-facade.service';
import { JobDetailsFacadeServiceMock } from '../lib/job-detail/services/job-details-facade.service.mock';
import { JobScheduleDetailsFacadeService } from '../lib/job-schedule-details/services/job-schedule-details-facade.service';
import { JobScheduleDetailsFacadeServiceMock } from '../lib/job-schedule-details/services/job-schedule-facade.service.mock';
import { JobsFacadeService } from '../lib/jobs/services/jobs-facade.service';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

describe('DeleteScheduleHandlerService', () => {
  let serviceToTest: DeleteScheduleHandlerService;
  let scheduleDetailsService: JobScheduleDetailsFacadeService;
  let jobDetailsService: JobDetailsFacadeService;
  let jobsService: JobsFacadeService<Job>;

  const MatDialogRefSpy = {
    close: () => { /* empty */ },
    afterClosed: () => of(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provider: DeleteScheduleHandlerService,
          useClass: DeleteScheduleHandlerServiceMock
        },
        {
          provide: MatDialog,
          useClass: MatDialogMock
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        {
          provide: MatDialogRef,
          useValue: MatDialogRefSpy
        },
        {
          provider: JobScheduleDetailsFacadeService,
          useClass: JobScheduleDetailsFacadeServiceMock
        },
        {
          provider: JobDetailsFacadeService,
          useClass: JobDetailsFacadeServiceMock
        },
        {
          provider: DeleteScheduleConfirmDialogComponent,
          useClass: DeleteScheduleConfirmDialogComponent
        },
        { provide: TranslatePipe, useValue: { transform: (value: any) => value } },
        {
          provide: Store,
          useValue: Spies.StoreSpy
        },
      ]
    });

    serviceToTest = TestBed.inject(DeleteScheduleHandlerService);
    scheduleDetailsService = TestBed.inject(JobScheduleDetailsFacadeService);
    jobDetailsService = TestBed.inject(JobDetailsFacadeService);
    jobsService = TestBed.inject(JobsFacadeService);

  });

  it('should be created', () => {
    expect(serviceToTest).toBeTruthy();
  });

  describe('deleteSchedule', () => {
    it('should call jobsFacadeService loadItem and subscribe for a jobs count', () => {
      serviceToTest.jobsCountSuccess$ = of(4);
      serviceToTest.jobsCountFailure$ = of({ errorMessage: 'error', type: ErrorType.BackEnd } as DnrFailure);

      const jobsFacadeSpy = spyOn(serviceToTest.jobsFacadeService, 'loadItems').and.callThrough();
      const jobsSubscription = spyOn(serviceToTest, '_subscribeToJobsCountEvents').and.callThrough();

      // WHEN
      serviceToTest.deleteSchedule('id', 'name');

      // THEN
      expect(jobsFacadeSpy).toHaveBeenCalledWith({ filters: `jobScheduleId==id` })
      expect(jobsSubscription).toHaveBeenCalled();
    });

    it('should subscribe to scheduleDeleteFailure$ and show error dialog on failure', () => {
      //GIVEN
      const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
      const showErrorDialogSpy = spyOn(serviceToTest, '_showErrorDialog');
      serviceToTest.scheduleDeleteFailure$ = of(mockFailure);

      //WHEN
      serviceToTest._subscribeDeleteScheduleFailure();

      //THEN
      expect(showErrorDialogSpy).toHaveBeenCalledWith(mockFailure, 'FAILED_TO_DELETE_SCHEDULE_HEADER');
    });

    it('_subscribeDeleteScheduleSuccess should handle success and emit delete success event', () => {
      //GIVEN
      serviceToTest.scheduleDeleteSuccess$ = of(true);
      const emitSpy = spyOn(serviceToTest.deleteScheduleSuccessEvent, 'emit');

      // WHEN
      serviceToTest._subscribeDeleteScheduleSuccess();

      // THEN
      serviceToTest.scheduleDeleteSuccess$.subscribe();
      expect(emitSpy).toHaveBeenCalledWith(serviceToTest.jobScheduleId);
    });

    it ('_launchConfirmDeleteScheduleDialog should unsubscribe from jobs count and launch confirm dialog', () => {
      //GIVEN
      const unsubscribeSpy = spyOn(serviceToTest, '_unsubscribeFromJobsCountStore');
      const dialogRefSpy = spyOn(serviceToTest.dialog, 'open').and.callThrough();

      //WHEN
      serviceToTest._launchConfirmDeleteScheduleDialog(4);

      //THEN
      expect(unsubscribeSpy).toHaveBeenCalled();
      expect(dialogRefSpy).toHaveBeenCalled();
    });
  });

  describe('_onConfirmDeleteSchedule', () => {

    beforeEach(() => {
      spyOn(serviceToTest, '_subscribeToScheduleStoreEvents').and.callThrough();
      spyOn(serviceToTest, '_subscribeToFilterJobsDeleteEvents').and.callThrough();
      spyOn(scheduleDetailsService, 'deleteJobSchedule').and.callThrough();
      spyOn(jobDetailsService, 'deleteFilteredJobs').and.callThrough();
      spyOn(jobsService, 'getItemsTotalCount').and.callThrough();

    });

    it('should call to delete schedule only when "deleteJobsSelected" is not set', () => {
      // GIVEN
      serviceToTest.deleteJobsSelected = false;
      serviceToTest.jobScheduleId = 'jobScheduleId';
      serviceToTest.scheduleName = 'jobScheduleName';

      // WHEN
      serviceToTest._onConfirmDeleteSchedule();

      // THEN
      expect(scheduleDetailsService.deleteJobSchedule).toHaveBeenCalled();
      expect(serviceToTest._subscribeToScheduleStoreEvents).toHaveBeenCalled();

      expect(jobDetailsService.deleteFilteredJobs).not.toHaveBeenCalled();
      expect(serviceToTest._subscribeToFilterJobsDeleteEvents).not.toHaveBeenCalled();
    });

    it('should call to delete both jobs and schedule when "deleteJobsSelected" is set ', () => {
      // GIVEN
      serviceToTest.deleteJobsSelected = true;
      serviceToTest.jobScheduleId = 'jobScheduleId';
      serviceToTest.scheduleName = 'jobScheduleName';

      // WHEN
      serviceToTest._onConfirmDeleteSchedule();

      // THEN
      expect(scheduleDetailsService.deleteJobSchedule).toHaveBeenCalled();
      expect(serviceToTest._subscribeToScheduleStoreEvents).toHaveBeenCalled();

      expect(jobDetailsService.deleteFilteredJobs).toHaveBeenCalled();
      expect(serviceToTest._subscribeToFilterJobsDeleteEvents).toHaveBeenCalled();
    });
  });

  it('_subscribeJobsCountSuccess should launch the confirm schedule delete with job count', () => {
    //GIVEN
    serviceToTest.jobsCountSuccess$ = of(-1, 4);
    const launchSpy = spyOn(serviceToTest, '_launchConfirmDeleteScheduleDialog');

    // WHEN
    serviceToTest._subscribeJobsCountSuccess();

    // THEN
    expect(launchSpy).toHaveBeenCalledWith(4);
  });

  it('_subscribeJobsCountFailure should launch the confirm schedule delete but without a job count', () => {
    //GIVEN
    serviceToTest.jobsCountFailure$ = of({ errorMessage: 'error', type: ErrorType.BackEnd } as DnrFailure);
    const launchSpy = spyOn(serviceToTest, '_launchConfirmDeleteScheduleDialog');

    // WHEN
    serviceToTest._subscribeJobsCountFailure();

    // THEN
    expect(launchSpy).toHaveBeenCalledWith(null);
  });

  it('_subscribeDeleteFilterJobsSuccess should emit deleteFilteredJobsSuccessEvent', () => {
    //GIVEN
    serviceToTest.filteredJobsDeleteSuccess$ = of(4);
    const emitSpy = spyOn(serviceToTest.deleteFilteredJobsSuccessEvent, 'emit');

    // WHEN
    serviceToTest._subscribeDeleteFilterJobsSuccess();

    // THEN
    serviceToTest.filteredJobsDeleteSuccess$.subscribe();
    expect(emitSpy).toHaveBeenCalledWith(serviceToTest.jobScheduleId);
  });


  it('should subscribe to scheduleDeleteFailure$ and show error dialog on failure', () => {
    //GIVEN
    const mockFailure: DnrFailure = { errorMessage: "error message2", type: ErrorType.BackEnd };
    const showErrorDialogSpy = spyOn(serviceToTest, '_showErrorDialog');
    serviceToTest.filteredJobsDeleteFailure$ = of(mockFailure);

    //WHEN
    serviceToTest._subscribeDeleteFilterJobsFailure();

    //THEN
    expect(showErrorDialogSpy).toHaveBeenCalledWith(mockFailure, 'FAILED_TO_DELETE_FILTERED_JOBS_HEADER');
  });

  it('_unsubscribeFromFailureStore should remove subscriptions', () => {
    //GIVEN
    serviceToTest._subscribeToScheduleStoreEvents();
    expect(serviceToTest.scheduleSubscriptions.length).toEqual(2);

    serviceToTest._subscribeToFilterJobsDeleteEvents();
    expect(serviceToTest.jobDetailSubscriptions.length).toEqual(2);

    //WHEN
    serviceToTest._unsubscribeFromStore();

    //THEN
    expect(serviceToTest.scheduleSubscriptions.length).toEqual(0);
    expect(serviceToTest.jobDetailSubscriptions.length).toEqual(0);
  });
});
