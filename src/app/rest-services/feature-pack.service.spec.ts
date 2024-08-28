import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import { StoreModule } from '@ngrx/store';
import { of } from 'rxjs';
import { FEATURE_PACKS_URL, FEATURE_PACK_APPLICATIONS_URL, FEATURE_PACK_APPLICATIONS_WITH_ID_URL, FEATURE_PACK_INPUT_CONFIGS_URL, FEATURE_PACK_INPUT_CONFIGS_URL_WITH_ID_URL, FEATURE_PACK_WITH_ID_URL } from '../constants/UrlConstants';
import { ApplicationItemsResponse } from '../models/application-items-response.model';
import { Application } from '../models/application.model';
import { FeaturePackDetailsResponse } from '../models/feature-pack-details-response.model';
import { FeaturePackItemsResponse } from '../models/feature-pack-items-response.model';
import { InputConfigurationDetails } from '../models/input-configuration-details.model';
import { InputConfigurationsItemsResponses } from '../models/input-configurations-items-response.model';
import { FeaturePackService } from './feature-pack.service';
import { applicationDataMock, applicationItemsResponseMock, featurePackDetailsResponseMock, featurePackItemsResponseMock, inputConfigDetailsMockData, inputConfigurationsItemsResponsesMock, payloadDeleteFeatureMock, queryMock } from './feature-pack.service.mock';
import { addQueryParamsToUrl } from './query-utils';

describe('FeaturePackService', () => {
  let service: FeaturePackService;
  let http: HttpTestingController;

  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({}), HttpClientTestingModule],
      providers: [
        {
          provide: HttpCacheService,
          useClass: HttpCacheServiceMock
        },
        {
          provide: ConfigCacheHeaderService,
          useClass: ConfigCacheHeaderServiceMock
        }
      ]
    })
  );

  beforeEach(() => {
    service = TestBed.inject(FeaturePackService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {

    it('getItems() - should get with the correct url when query params exists', done => {
      // GIVEN
      const expectedUrl = addQueryParamsToUrl(FEATURE_PACKS_URL, queryMock);

      // WHEN
      service.getItems(queryMock).subscribe(response => {
        expect(response).toEqual(featurePackItemsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(featurePackItemsResponseMock);
    });

    it('getItems() - should get with the correct url without any query params', done => {
      // GIVEN
      const query = {};
      const expectedUrl = addQueryParamsToUrl(FEATURE_PACKS_URL, query);

      // WHEN
      service.getItems(query).subscribe(response => {
        expect(response).toEqual(featurePackItemsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(featurePackItemsResponseMock);
    });

    it('getAllFeaturePacks() - should return an Observable of FeaturePackItemsResponse', () => {

      //GIVEN
      spyOn(service, 'getItems').and.returnValue(of(featurePackItemsResponseMock));

      //WHEN
      service.getAllFeaturePacks().subscribe((response: FeaturePackItemsResponse) => {

        //THEN
        expect(response).toEqual(featurePackItemsResponseMock);
      });
    });

    it('getFeaturePackById() - should get the correct url', done => {
      // GIVEN
      const idMock = '185';
      const expectedUrl = FEATURE_PACK_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.getFeaturePackById(idMock).subscribe((response: FeaturePackDetailsResponse) => {
        expect(response).toEqual(featurePackDetailsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(featurePackDetailsResponseMock);
    });

    it('getApplications() - should get the correct url', done => {
      // GIVEN
      const idMock = '185';
      const expectedUrl = FEATURE_PACK_APPLICATIONS_URL.replace('{0}', idMock);

      // WHEN
      service.getApplications(idMock).subscribe((response: ApplicationItemsResponse) => {
        expect(response).toEqual(applicationItemsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(applicationItemsResponseMock);
    });

    it('getApplication() - should get the correct url', done => {
      // GIVEN
      const featureIdMock = '185';
      const appIdMock = 'APP100001';
      const expectedUrl = FEATURE_PACK_APPLICATIONS_WITH_ID_URL.replace('{0}', featureIdMock).replace('{1}', appIdMock);

      // WHEN
      service.getApplication(featureIdMock, appIdMock).subscribe((response: Application) => {
        expect(response).toEqual(applicationDataMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(applicationDataMock);
    });


    it('getInputConfigurations() - should get the correct url without any query params', done => {
      // GIVEN
      const idMock = '1234';
      let expectedUrl = FEATURE_PACK_INPUT_CONFIGS_URL.replace('{0}', idMock);
      expectedUrl = addQueryParamsToUrl(expectedUrl, {});

      // WHEN
      service.getInputConfigurations(idMock, {}).subscribe((response: InputConfigurationsItemsResponses) => {
        expect(response).toEqual(inputConfigurationsItemsResponsesMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(inputConfigurationsItemsResponsesMock);
    });

    it('getInputConfigurations() - should get the correct url when query params exists', done => {
      // GIVEN
      const idMock = '1234';
      let expectedUrl = FEATURE_PACK_INPUT_CONFIGS_URL.replace('{0}', idMock);
      expectedUrl = addQueryParamsToUrl(expectedUrl, queryMock);

      // WHEN
      service.getInputConfigurations(idMock, queryMock).subscribe((response: InputConfigurationsItemsResponses) => {
        expect(response).toEqual(inputConfigurationsItemsResponsesMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(inputConfigurationsItemsResponsesMock);
    });

    it('getInputConfiguration() - should get the correct url', done => {
      // GIVEN
      const featureIdMock = '185';
      const appIdMock = 'APP100001';
      const expectedUrl = FEATURE_PACK_INPUT_CONFIGS_URL_WITH_ID_URL.replace('{0}', featureIdMock).replace('{1}', appIdMock);

      // WHEN
      service.getInputConfiguration(featureIdMock, appIdMock).subscribe((response: InputConfigurationDetails) => {
        expect(response).toEqual(inputConfigDetailsMockData);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(inputConfigDetailsMockData);
    });
  });

  describe('post', () => {

    it('uploadFeaturePack() - should post with the correct url', done => {
      // GIVEN
      const name = 'Name';
      const description = 'Description';
      const file = new File(['test data'], 'test-file.zip');

      // WHEN
      service.uploadFeaturePack(name, description, file).subscribe(response => {
        expect(response).toEqual(featurePackDetailsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(FEATURE_PACKS_URL);

      expect(req.request.method).toEqual('POST');
      expect(req.request.headers.has('Content-Disposition')).toBeTruthy();

      req.flush(featurePackDetailsResponseMock);
    });

    it('should create proper headers for file upload', () => {
      //GIVEN
      const file = new File(['test data'], 'test-file.zip');

      //WHEN
      const headersObj = service._createFileHeaders(file);

      //THEN
      expect(headersObj.headers.get('Content-Disposition')).toEqual('attachment; filename=test-file.zip');
    });
  });

  describe('put', () => {

    it('updateFeaturePack() - should put with the correct url', done => {
      // GIVEN
      const idMock = '101';
      const description = 'Description';
      const file = new File(['test data'], 'test-file.zip');
      const expectedUrl = FEATURE_PACK_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.updateFeaturePack(idMock, description, file).subscribe(response => {
        expect(response).toEqual(featurePackDetailsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('PUT');
      expect(req.request.headers.has('Content-Disposition')).toBeTruthy();

      req.flush(featurePackDetailsResponseMock);
    });
  });

  describe('delete', () => {
    it('deleteFeaturePack() - should Delete with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = FEATURE_PACK_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.deleteFeaturePack(idMock).subscribe(response => {
        expect(response).toEqual(payloadDeleteFeatureMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('DELETE');
      req.flush(payloadDeleteFeatureMock);
    });

  });
});
