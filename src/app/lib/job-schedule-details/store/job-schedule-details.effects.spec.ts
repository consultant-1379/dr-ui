import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  ConfigLoaderService,
  ConfigLoaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import {
  EffectsHelperService,
  EffectsHelperServiceMock
} from '@erad/smart-components/effects-helper';
import { provideMockActions } from '@ngrx/effects/testing';
import { StoreModule } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import {
  CreateJobSchedule,
  CreateJobScheduleSuccess,
  DeleteJobSchedule,
  EnableJobSchedule,
  LoadJobScheduleDetails,
  LoadJobScheduleDetailsSuccess
} from './job-schedule-details.actions';
import { JobScheduleDetailsEffects } from './job-schedule-details.effects';
import { marbles } from 'rxjs-marbles/marbles';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { JobScheduleService } from 'src/app/rest-services/job-schedule.service';
import { JobScheduleServiceMock, jobScheduleCreateMock, jobScheduleDetailsMock } from 'src/app/rest-services/job-schedule.service.mock';

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';
const name = "jobSchedule-name";

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: JobScheduleDetailsEffects;
  let jobScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobScheduleDetailsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: EffectsHelperService,
          useClass: EffectsHelperServiceMock,
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock,
        },
        {
          provide: JobScheduleService,
          useClass: JobScheduleServiceMock,
        },
        {
          provide: ConfigCacheHeaderService,
          useClass: ConfigCacheHeaderServiceMock,
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock,
        },
        {
          provide: HttpCacheService,
          useClass: HttpCacheServiceMock,
        },
      ],
      imports: [StoreModule.forRoot({}), HttpClientTestingModule],
    });
    effects = TestBed.inject(JobScheduleDetailsEffects);
    TestBed.inject(MockStore);
    jobScheduleService = TestBed.inject(JobScheduleService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call job schedule service "getJobScheduleById"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadJobScheduleDetails({ id });
      const completion = new LoadJobScheduleDetailsSuccess({
        response: jobScheduleDetailsMock,
      });

      spyOn(jobScheduleService, 'getJobScheduleById').and.returnValue(of(jobScheduleDetailsMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadScheduleTypes$).toBeObservable(expected);
      effects.loadScheduleTypes$.subscribe(() => {
        expect(jobScheduleService.getJobScheduleById).toHaveBeenCalled();
      });
    })
  );

  it(`should call job schedule service "createJobSchedule"`,
    marbles((m) => {
      // GIVEN
      const data = jobScheduleCreateMock;
      const action = new CreateJobSchedule({ data });
      const completion = new CreateJobScheduleSuccess({
        response: { id },
      });

      spyOn(jobScheduleService, 'createJobSchedule').and.returnValue(of({ id }));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.createJobSchedule$).toBeObservable(expected);
      effects.createJobSchedule$.subscribe(() => {
        expect(jobScheduleService.createJobSchedule).toHaveBeenCalled();
      });
    })
  );

  it(`should call job schedule service enableJobSchedule"`,
    marbles((m) => {
      // GIVEN
      const action = new EnableJobSchedule({ id: "--enableJobSchedule", name: "js1", enabled: true });

      spyOn(jobScheduleService, 'enableJobSchedule').and.returnValue(of("-service-enable-jbo"));

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.enableJobSchedule$.subscribe(() => {
        expect(jobScheduleService.enableJobSchedule).toHaveBeenCalled();
      });
    })
  );

  it(`should call job schedule service enableJobSchedule" and show success msg if showSuccessMessage is true`,
    marbles((m) => {
      // GIVEN
      const action = new EnableJobSchedule({ id: "--enableJobSchedule", name: "js1", enabled: true, showSuccessMessage: true });

      spyOn(jobScheduleService, 'enableJobSchedule').and.returnValue(of("-service-enable-jbo"));
      const helpShowMsgSpy = spyOn(effects.helper, 'showSuccessMessage');

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.enableJobSchedule$.subscribe(() => {
        expect(jobScheduleService.enableJobSchedule).toHaveBeenCalled();
        expect(helpShowMsgSpy).toHaveBeenCalledWith('SUCCESS', 'messages.JOB_SCHEDULE_ENABLE_SUCCESS', { id: action.payload.id, name: action.payload.name });
      });
    })
  );

  it(`should call job schedule service enableJobSchedule when disabling schedule`,
    marbles((m) => {
      // GIVEN
      const action = new EnableJobSchedule({ id: "--enableJobSchedule", name: "js1", enabled: false, showSuccessMessage: true });

      spyOn(jobScheduleService, 'enableJobSchedule').and.returnValue(of("-service-enable-jbo"));
      const helpShowMsgSpy = spyOn(effects.helper, 'showSuccessMessage');

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.enableJobSchedule$.subscribe(() => {
        expect(jobScheduleService.enableJobSchedule).toHaveBeenCalled();
        expect(helpShowMsgSpy).toHaveBeenCalledWith('SUCCESS', 'messages.JOB_SCHEDULE_DISABLE_SUCCESS', { id: action.payload.id, name: action.payload.name });
      });
    })
  );

  it(`should call job schedule service "deleteJobSchedule"`,
    marbles((m) => {
      // GIVEN
      const action = new DeleteJobSchedule({ id: "--deleteJobSchedule", name });

      spyOn(jobScheduleService, 'deleteJobSchedule').and.returnValue(of("-service-delete-jbo"));

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.deleteJobSchedule$.subscribe(() => {
        expect(jobScheduleService.deleteJobSchedule).toHaveBeenCalled();
      });
    })
  );

  it(`should call job schedule service "deleteJobSchedule" and show success msg if showSuccessMessage is true`,
    marbles((m) => {
      // GIVEN
      const action = new DeleteJobSchedule({ id: "--deleteJobSchedule", name, showSuccessMessage: true });

      spyOn(jobScheduleService, 'deleteJobSchedule').and.returnValue(of("-service-delete-jbo"));
      const helpShowMsgSpy = spyOn(effects.helper, 'showSuccessMessage');

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.deleteJobSchedule$.subscribe(() => {
        expect(jobScheduleService.deleteJobSchedule).toHaveBeenCalled();
        expect(helpShowMsgSpy).toHaveBeenCalledWith('SUCCESS', 'messages.DELETE_JOB_SCHEDULE_SUCCESS', { id: action.payload.id, name: action.payload.name });
      });
    })
  );
});
