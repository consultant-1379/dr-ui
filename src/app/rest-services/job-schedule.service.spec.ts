import {
  ConfigCacheHeaderService,
  ConfigCacheHeaderServiceMock,
  HttpCacheService,
  HttpCacheServiceMock
} from '@erad/core';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { JOB_SCHEDULES_URL, JOB_SCHEDULE_WITH_ID_URL } from '../constants/UrlConstants';
import { jobScheduleCreateMock, jobScheduleDetailsMock, jobScheduleItemsResponseMock } from './job-schedule.service.mock';

import { JobScheduleService } from './job-schedule.service';
import { StoreModule } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { addQueryParamsToUrl } from './query-utils';

describe('JobScheduleService', () => {
  let service: JobScheduleService;
  let http: HttpTestingController;

  const id = '12345';

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
    service = TestBed.inject(JobScheduleService);
    http = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('get', () => {
    it('getJobSchedules() - should get with the correct url', done => {
      // GIVEN
      const expectedUrl = addQueryParamsToUrl(JOB_SCHEDULES_URL, {});

      // WHEN
      service.getJobSchedules().subscribe(response => {
        expect(response).toEqual(jobScheduleItemsResponseMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(jobScheduleItemsResponseMock);
    });

    it('getJobScheduleById() - should get with the correct url', done => {
      // GIVEN
      const expectedUrl = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);

      // WHEN
      service.getJobScheduleById(id).subscribe(response => {
        expect(response).toEqual(jobScheduleDetailsMock);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('GET');
      req.flush(jobScheduleDetailsMock);
    });
  });

  describe('post', () => {

    it('createJobSchedule() - should post with the correct url', done => {
      // GIVEN
      const expectedResponse = { id };

      // WHEN
      service.createJobSchedule(jobScheduleCreateMock).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      // THEN
      const req = http.expectOne(JOB_SCHEDULES_URL);

      expect(req.request.method).toEqual('POST');
      req.flush(expectedResponse);
    });
  });

  describe('delete', () => {
    it('deleteJobSchedule() - should Delete with the correct url', done => {
      // GIVEN
      const expectedUrl = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);
      const expectedResponse = { id };

      // WHEN
      service.deleteJobSchedule(id).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('DELETE');
      req.flush(expectedResponse);
    });
  });

  describe('patch', () => {

    it('enableJobSchedule() - should post with the correct url', done => {
      // GIVEN
      const expectedResponse = { id };
      const expectedUrl = JOB_SCHEDULE_WITH_ID_URL.replace('{0}', id);

      // WHEN
      service.enableJobSchedule(id, true).subscribe(response => {
        expect(response).toEqual(expectedResponse);
        done();
      });

      // THEN
      const req = http.expectOne(expectedUrl);

      expect(req.request.method).toEqual('PATCH');
      req.flush(expectedResponse);
    });
  });
});
