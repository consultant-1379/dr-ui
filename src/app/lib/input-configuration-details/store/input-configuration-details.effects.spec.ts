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
import { marbles } from 'rxjs-marbles/marbles';
import { FeaturePackService } from 'src/app/rest-services/feature-pack.service';
import { FeaturePackServiceMock } from 'src/app/rest-services/feature-pack.service.mock';
import { TranslateService } from '@ngx-translate/core';
import { TranslateServiceMock } from '@erad/utils';
import { InputConfigDetailsEffects } from './input-configuration-details.effects';
import { LoadInputConfigDetails, LoadInputConfigDetailsSuccess } from './input-configuration-details.actions';
import { InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';

const responseMock: InputConfigurationDetails = {
  id: "897652",
  name: "TestName",
  description: "Test description",
  inputs: [{
    name: 'inputTestName',
    value: false,
    pickList: [false]
  }]
};

const featureMockId = '1234';
const configurationMockId = '6578';

describe('InputConfigDetailsEffects', () => {
  let actions$: Observable<any>;
  let effects: InputConfigDetailsEffects;
  let featurePackService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InputConfigDetailsEffects,
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
    effects = TestBed.inject(InputConfigDetailsEffects);
    TestBed.inject(MockStore);
    featurePackService = TestBed.inject(FeaturePackService);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });

  it(`should call "getInputConfiguration"`, marbles(m => {
    // GIVEN
    const action = new LoadInputConfigDetails({ featureId: featureMockId, configurationId: configurationMockId });
    const completion = new LoadInputConfigDetailsSuccess({
      response: responseMock
    });

    spyOn(featurePackService, 'getInputConfiguration').and.returnValue(
      of(responseMock)
    );

    // WHEN
    actions$ = m.hot('a', { a: action });
    const expected = m.cold('b', { b: completion });

    // THEN
    m.expect(effects.loadAssociationTypes$).toBeObservable(expected);
    effects.loadAssociationTypes$.subscribe(() => {
      expect(featurePackService.getInputConfiguration).toHaveBeenCalled();
    });
  })
  );

});
