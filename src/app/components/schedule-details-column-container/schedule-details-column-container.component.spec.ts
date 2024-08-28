import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';
import { ConfirmationService, ConfirmationServiceMock } from '@erad/components';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { JobScheduleDetailsFacadeServiceMock } from 'src/app/lib/job-schedule-details/services/job-schedule-facade.service.mock';
import { RouterTestingModule } from '@angular/router/testing';
import { ScheduleDetailsColumnContainerComponent } from './schedule-details-column-container.component';
import { SimpleChanges } from '@angular/core';
import { failureMock } from 'src/app/shared/common.mock';
import { jobMock } from '../reconcile-job-dialog/reconcile-job-dialog.component.mock.data';
import { jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

describe('ScheduleDetailsColumnContainerComponent', () => {
  let component: ScheduleDetailsColumnContainerComponent;
  let fixture: ComponentFixture<ScheduleDetailsColumnContainerComponent>;
  let scheduleDetailsFacadeService: JobScheduleDetailsFacadeService;

  let matDialog;
  const MatDialogRefSpy = {
    close: () => { },
    afterClosed: () => of(true)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScheduleDetailsColumnContainerComponent ],
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
          provide: ConfirmationService,
          useClass: ConfirmationServiceMock
        },
        {
          provide: JobScheduleDetailsFacadeService,
          useClass: JobScheduleDetailsFacadeServiceMock
        },
        provideMockStore()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDetailsColumnContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    scheduleDetailsFacadeService = TestBed.inject(JobScheduleDetailsFacadeService);
    matDialog = TestBed.inject(MatDialog);
    spyOn(matDialog, 'open');
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit jobSelection on jobSelection', () => {
    // GIVEN
    spyOn(component.jobSelection, 'emit');

    // WHEN
    component.onJobSelection(jobMock);

    // THEN
    expect(component.jobSelection.emit).toHaveBeenCalled();
  });

  describe('Schedule details tests', () => {
    it('should call loadDetails when schedule Id changed', () => {
      // GIVEN
      const scheduleIdChange: SimpleChanges = {
        'scheduleId': {
          'currentValue': "123",
          'firstChange': true,
          previousValue: false,
          isFirstChange() { return true }
        }
      };
      component.scheduleId = "123";
      spyOn(scheduleDetailsFacadeService, 'loadDetails');
      // WHEN
      component.ngOnChanges(scheduleIdChange);

      // THEN
      expect(scheduleDetailsFacadeService.loadDetails).toHaveBeenCalled();
    });

    it('should load schedule details on ngOnInit', () => {
      // GIVEN
      spyOn(scheduleDetailsFacadeService, 'getJobScheduleDetails').and.returnValue(of(jobScheduleDetailsMock));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(scheduleDetailsFacadeService.getJobScheduleDetails).toHaveBeenCalled();
    });

    it('should set loading on getJobScheduleLoading', () => {
      // GIVEN
      spyOn(scheduleDetailsFacadeService, 'getJobScheduleLoading').and.returnValue(of(true));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.loading).toBeTrue();
    });

    it('should set enabled on getJobScheduleEnabledSet', () => {
      // GIVEN
      component.jobSchedule = jobScheduleDetailsMock;
      const oldEnabledValue = jobScheduleDetailsMock.enabled;
      spyOn(scheduleDetailsFacadeService, 'getJobScheduleEnabledSet').and.returnValue(of(null, true));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.jobSchedule.enabled).not.toEqual(oldEnabledValue);
    });

    it('should set failure on getJobScheduleFailure', () => {
      // GIVEN
      spyOn(scheduleDetailsFacadeService, 'getJobScheduleFailure').and.returnValue(of(failureMock));

      // WHEN
      component.ngOnInit();

      // THEN
      expect(component.failure).toEqual(failureMock);
    });
  });
});
