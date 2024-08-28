import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import { DISCOVERED_OBJECTS_URL, DISCOVERY_JOBS_URL, DISCOVERY_JOB_WITH_ID_URL, DUPLICATE_JOB_WITH_ID_URL, RECONCILE_WITH_ID_URL } from '../constants/UrlConstants';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { discoveryJobsList, jobMock, payloadCreateJobMock, payloadDeleteJobMock, payloadDuplicateJobMock, payloadJobReconcileAllDataMock, payloadJobReconcileMock, payloadReconcileMock } from './jobs.service.mock';

import { JobsService } from './jobs.service';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { addQueryParamsToUrl } from './query-utils';

describe('JobsService', () => {
  let service: JobsService;
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
    service = TestBed.inject(JobsService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('getDiscoveryJobs() - should get with the correct url', done => {
      // GIVEN
      const expectedUrl = addQueryParamsToUrl(DISCOVERY_JOBS_URL, {});

      // WHEN
      service.getDiscoveryJobs().subscribe(response => {
        expect(response).toEqual(discoveryJobsList);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(discoveryJobsList);
    });

    it('getDiscoveryJobById() - should get with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = DISCOVERY_JOB_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.getDiscoveryJobById(idMock).subscribe(response => {
        expect(response).toEqual(jobMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(jobMock);
    });

    it('getDiscoverdObjects() - should get with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      let expectedUrl = addQueryParamsToUrl(DISCOVERED_OBJECTS_URL, {});
      expectedUrl = expectedUrl.replace('{0}', idMock);

      // WHEN
      service.getDiscoverdObjects(idMock).subscribe(response => {
        expect(response).toEqual(null);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(null);
    });
  });

  describe('post', () => {

    it('createJob() - should post with the correct url', done => {
      // GIVEN
      const expectedResponse = { id: '101' };

      // WHEN
      service.createJob(payloadCreateJobMock).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      // THEN
      const req = http.expectOne(DISCOVERY_JOBS_URL);

      expect(req.request.method).toEqual('POST');
      req.flush(expectedResponse);
    });

    it('reconcileJob() - should post with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = RECONCILE_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.reconcileJob(idMock, payloadReconcileMock).subscribe(response => {
        expect(response).toEqual(payloadJobReconcileMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      req.flush(payloadJobReconcileMock);
    });

    it('reconcileAllJob() - should post with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = RECONCILE_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.reconcileAllJob(idMock, payloadJobReconcileAllDataMock).subscribe(response => {
        expect(response).toEqual(payloadJobReconcileMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      req.flush(payloadJobReconcileMock);
    });
  });

  describe('delete', () => {
    it('deleteJob() - should Delete with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = DISCOVERY_JOB_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.deleteJob(idMock).subscribe(response => {
        expect(response).toEqual(payloadDeleteJobMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('DELETE');
      req.flush(payloadDeleteJobMock);
    });

    it('deleteFilteredJobs() - should Delete with the correct url', done => {
      // GIVEN
      const queryMock = { filters: 'id==55,id==32' };
      const expectedUrl = DISCOVERY_JOBS_URL + "?filters=id==55,id==32";

      // WHEN
      service.deleteFilteredJobs(queryMock).subscribe(response => {
        expect(response).toEqual(payloadDeleteJobMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);
      expect(req.request.method).toEqual('DELETE');
      req.flush(payloadDeleteJobMock);
    });

  });

  describe('duplicate', () => {
    it('duplicateJob() - should Duplicate with the correct url', done => {
      // GIVEN
      const idMock = '12345';
      const expectedUrl = DUPLICATE_JOB_WITH_ID_URL.replace('{0}', idMock);

      // WHEN
      service.duplicateJob(idMock).subscribe(response => {
        expect(response).toEqual(payloadDuplicateJobMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('POST');
      req.flush(payloadDuplicateJobMock);
    });

  });
});
