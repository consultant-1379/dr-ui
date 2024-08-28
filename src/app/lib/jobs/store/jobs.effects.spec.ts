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
  LoadJobs,
  LoadJobsSuccess
} from './jobs.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { JobsEffects } from './jobs.effects';
import { JobsItemsResponse } from 'src/app/models/jobs-items-response.model';
import { JobsService } from 'src/app/rest-services/jobs.service';
import { QueryParams } from 'src/app/models/query.params.model';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { marbles } from 'rxjs-marbles/marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const responseMock: JobsItemsResponse = {
  items: [{
    id: "id",
    name: "name",
    description: "description",
  }],
  totalCount: 1
};

const query: QueryParams = {
  offset: 10,
  limit: 20
  /* no sort provided */
}

describe('JobsEffects', () => {
  let actions$: Observable<any>;
  let effects: JobsEffects;
  let jobsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        JobsEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        {
          provide: EffectsHelperService,
          useClass: EffectsHelperServiceMock
        },
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        {
          provide: FeaturePackService,
          useClass: FeaturePackServiceMock
        },
        {
          provide: ConfigCacheHeaderService,
          useClass: ConfigCacheHeaderServiceMock
        },
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        },
        {
          provide: HttpCacheService,
          useClass: HttpCacheServiceMock
        }
      ],
      imports: [
        StoreModule.forRoot({}),
        HttpClientTestingModule
      ]
    });
    effects = TestBed.inject(JobsEffects);
    TestBed.inject(MockStore);
    jobsService = TestBed.inject(JobsService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(
    `should call "getDiscoveryJobs"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadJobs({ query });
      const completion = new LoadJobsSuccess({
        response: responseMock,
      });

      spyOn(jobsService, 'getDiscoveryJobs').and.returnValue(of(responseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
      effects.loadAssociationTypes$.subscribe(() => {
        expect(jobsService.getDiscoveryJobs).toHaveBeenCalledWith({
          limit: 20,
          offset: 10,
          sort: '-id',  /* default sort when none is provided */
          filters: undefined
        });
      });
    })
  );
});
