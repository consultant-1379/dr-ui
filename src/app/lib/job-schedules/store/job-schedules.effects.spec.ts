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
import {
  LoadJobSchedules,
  LoadJobSchedulesSuccess
} from './job-schedules.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { JobSchedulesEffects } from './job-schedules.effects';
import { JobScheduleService } from 'src/app/rest-services/job-schedule.service';
import { JobScheduleServiceMock, jobScheduleItemsResponseMock } from 'src/app/rest-services/job-schedule.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParams } from 'src/app/models/query.params.model';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { marbles } from 'rxjs-marbles/marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const query: QueryParams = {
  offset: 10,
  limit: 20
  /* no sort provided */
}

describe('Job Schedules Effects', () => {
  let actions$: Observable<any>;
  let effects: JobSchedulesEffects;
  let jobScheduleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobSchedulesEffects,
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
    effects = TestBed.inject(JobSchedulesEffects);
    TestBed.inject(MockStore);
    jobScheduleService = TestBed.inject(JobScheduleService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call job schedule service "LoadJobSchedules"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadJobSchedules({ query });
      const completion = new LoadJobSchedulesSuccess({
        response: jobScheduleItemsResponseMock,
      });

      spyOn(jobScheduleService, 'getJobSchedules').and.returnValue(of(jobScheduleItemsResponseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadJobSchedules$).toBeObservable(expected);
      effects.loadJobSchedules$.subscribe(() => {
        expect(jobScheduleService.getJobSchedules).toHaveBeenCalledWith({
          limit: 20,
          offset: 10,
          sort: '-id',  /* default sort when none is provided */
          filters: undefined
        });
      });
    })
  );
});
