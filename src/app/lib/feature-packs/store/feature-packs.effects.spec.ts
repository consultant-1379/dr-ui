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
  LoadAllFeaturePacks,
  LoadAllFeaturePacksSuccess,
  LoadFeaturePackApplications,
  LoadFeaturePackApplicationsSuccess,
  LoadFeaturePacks,
  LoadFeaturePacksSuccess,
} from './feature-packs.actions';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';

import { FeaturePackEffects } from './feature-packs.effects';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParams } from 'src/app/models/query.params.model';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { marbles } from 'rxjs-marbles/marbles';
import { provideMockActions } from '@ngrx/effects/testing';

const itemsResponseMock = {
  items: [],
  totalCount: 0
}

const query: QueryParams = {
  offset: 10,
  limit: 20
  /* no sort provided */
}

const featurePackId = '2';

describe('InputConfigsEffects', () => {
  let actions$: Observable<any>;
  let effects: FeaturePackEffects;
  let featurePacksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FeaturePackEffects,
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
          provide: FeaturePackService,
          useClass: FeaturePackServiceMock,
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
    effects = TestBed.inject(FeaturePackEffects);
    TestBed.inject(MockStore);
    featurePacksService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call feature pack service "LoadFeaturePacks"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadFeaturePacks({ query });
      const completion = new LoadFeaturePacksSuccess({
        response: itemsResponseMock,
      });

      spyOn(featurePacksService, 'getItems').and.returnValue(of(itemsResponseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadFeaturePacks$).toBeObservable(expected);
      effects.loadFeaturePacks$.subscribe(() => {
        expect(featurePacksService.getItems).toHaveBeenCalledWith({
          limit: 20,
          offset: 10,
          sort: '-id',  /* default sort when none is provided */
          filters: undefined
        });
      });
    })
  );

  it(`should call feature pack service "LoadFeaturePackApplications"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadFeaturePackApplications({ featurePackId, query });
      const completion = new LoadFeaturePackApplicationsSuccess({
        featurePackId,
        response: itemsResponseMock,
      });

      spyOn(featurePacksService, 'getApplications').and.returnValue(of(itemsResponseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadFeaturePackApplications$).toBeObservable(expected);
      effects.loadFeaturePackApplications$.subscribe(() => {
        expect(featurePacksService.getApplications).toHaveBeenCalled();
      });
    })
  );

  it(`should call feature pack service "LoadAllFeaturePacks"`,
    marbles((m) => {
      // GIVEN
      const action = new LoadAllFeaturePacks();
      const completion = new LoadAllFeaturePacksSuccess({
        response: itemsResponseMock,
      });

      spyOn(featurePacksService, 'getAllFeaturePacks').and.returnValue(of(itemsResponseMock));

      // WHEN
      actions$ = m.hot('a', { a: action });
      const expected = m.cold('b', { b: completion });

      // THEN
      m.expect(effects.loadAllFeaturePackInfo$).toBeObservable(expected);
      effects.loadAllFeaturePackInfo$.subscribe(() => {
        expect(featurePacksService.getAllFeaturePacks).toHaveBeenCalled();
      });
    })
  );
});
