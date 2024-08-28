import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  ConfigLoaderService,
  ConfigLoaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import {
  CreateJob,
  CreateJobSuccess,
  DeleteFilteredJobs,
  DeleteJob,
  DuplicateJob,
  LoadJobDetails,
  LoadJobDetailsSuccess,
  ReconcileAllJob,
  ReconcileJob,
  ReconcileJobSuccess
} from './job-details.actions';
import {
  EffectsHelperService,
  EffectsHelperServiceMock
} from '@erad/smart-components/effects-helper';
import { JobReconcileAllData, JobReconcileData } from 'src/app/models/job-reconcile.model';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { ExecutionJob } from 'src/app/models/execute-job.model';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Job } from 'src/app/models/job.model';
import { JobDetailsEffects } from './job-details.effects';
import { JobsService } from 'src/app/rest-services/jobs.service';
import { JobsServiceMock } from 'src/app/rest-services/jobs.service.mock';
import { QueryParams } from 'src/app/models/query.params.model';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { marbles } from 'rxjs-marbles/marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const responseMock: Job = {
  id: 'id',
  name: 'name',
  description: 'description',
};

const id = 'c3026cc7-8436-46a9-98e7-8c78e8b828be';

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: JobDetailsEffects;
  let jobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobDetailsEffects,
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
          provide: JobsService,
          useClass: JobsServiceMock,
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
    effects = TestBed.inject(JobDetailsEffects);
    TestBed.inject(MockStore);
    jobsService = TestBed.inject(JobsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call job service "getDiscoveryJobById"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadJobDetails({ id });
      const completion = new LoadJobDetailsSuccess({
        response: responseMock,
      });

      spyOn(jobsService, 'getDiscoveryJobById').and.returnValue(of(responseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
      effects.loadAssociationTypes$.subscribe(() => {
        expect(jobsService.getDiscoveryJobById).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "createJob"`,
    marbles((m) => {
      // GIVEN
      const data: ExecutionJob = {
        featurePackId: 'fp-id',
        applicationId: 'app-id',
        applicationJobName: 'app-name',
      };
      const action = new CreateJob({ data });
      const completion = new CreateJobSuccess({
        response: { id },
      });

      spyOn(jobsService, 'createJob').and.returnValue(of({ id }));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.createJob$).toBeObservable(expected);
      effects.createJob$.subscribe(() => {
        expect(jobsService.createJob).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "reconcileAllJob"`,
    marbles((m) => {
      // GIVEN
      const data: JobReconcileAllData = {
        inputs: { input1: "1" },
      };
      const action = new ReconcileAllJob({ id, data });
      const completion = new ReconcileJobSuccess({ id });

      spyOn(jobsService, 'reconcileAllJob').and.returnValue(of({ id }));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.reconcileAllJob$).toBeObservable(expected);
      effects.reconcileAllJob$.subscribe(() => {
        expect(jobsService.reconcileAllJob).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "reconcileJob"`,
    marbles((m) => {
      // GIVEN
      const data: JobReconcileData = {
        inputs: { input1: "1" },
        objects: []
      };
      const action = new ReconcileJob({ id, data });
      const completion = new ReconcileJobSuccess({ id });

      spyOn(jobsService, 'reconcileJob').and.returnValue(of({ id }));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.reconcileJob$).toBeObservable(expected);
      effects.reconcileJob$.subscribe(() => {
        expect(jobsService.reconcileJob).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "deleteJob"`,
    marbles((m) => {
      // GIVEN
      const action = new DeleteJob({ id: "--deleteJob", name: "my job name"});

      spyOn(jobsService, 'deleteJob').and.returnValue(of("-service-delete-jbo"));

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.deleteJob$.subscribe(() => {
        expect(jobsService.deleteJob).toHaveBeenCalled();
      });
    })
  );

  it(`should call job service "deleteFilteredJobs"`,
    marbles((m) => {
      // GIVEN
      const data: QueryParams = { filters: `jobScheduleId==55` };
      const action = new DeleteFilteredJobs({query: data, showSuccessMessage: true });

      spyOn(jobsService, 'deleteFilteredJobs').and.returnValue(of({deleted: 3}));

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.deleteFilteredJobs$.subscribe(() => {
        expect(jobsService.deleteFilteredJobs).toHaveBeenCalled();
      });
    })
  );


  it(`should call job service "duplicateJob"`,
    marbles((m) => {
      // GIVEN
      const action = new DuplicateJob({ id: "--duplicateJob", name: "my job name" });

      spyOn(jobsService, 'duplicateJob').and.returnValue(of("-service-duplicate-jbo"));

      // WHEN
      actions$ = m.hot('a', { a: action });

      // THEN
      effects.duplicateJob$.subscribe(() => {
        expect(jobsService.duplicateJob).toHaveBeenCalled();
      });
    })
  );
});
