import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { NotificationMode, NotificationV2ModuleMock, NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateModuleMock } from '@erad/utils';
import { ErrorHandlerService } from './error-handler.service';
import { TranslateService } from '@ngx-translate/core';
import {
  badRequestFailureMock,
  badRequestFailureResponseMock,
  connectionRefusedFailureMock,
  connectionRefusedFailureResponseMock,
  defaultFailureMock,
  failureInternalErrorResponseMock,
  failureWithErrorCodeMock,
  failureWithoutErrorCodeMock,
  forbiddenExceptionFailureMock,
  forbiddenExceptionFailureResponseMock,
  gatewayTimeoutFailureMock,
  gatewayTimeoutFailureResponseMock,
  internalServerErrorFailureMock,
  notFoundExceptionFailureMock,
  notFoundExceptionFailureResponseMock,
  serviceUnavailableFailureMock,
  serviceUnavailableFailureResponseMock,
  unauthorizedExceptionFailureMock,
  unauthorizedExceptionFailureResponseMock
} from './error-handler.service.mock.data';

describe('ErrorHandlerService', () => {

  let service: ErrorHandlerService;
  let notificationV2Service: NotificationV2Service;
  let translateService: TranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NotificationV2ModuleMock,
        TranslateModuleMock
      ]
    });
    service = TestBed.inject(ErrorHandlerService);
    notificationV2Service = TestBed.inject(NotificationV2Service);
    translateService = TestBed.inject(TranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('handleError', () => {

    it('should return connection refused failure if the status of the response is 0',
      (done: DoneFn) => {
        // WHEN
        service.handleError(connectionRefusedFailureResponseMock).subscribe({
          error: err => {
            // THEN
            expect(err).toEqual(connectionRefusedFailureMock);
            done();
          }
        });
      });

    it(`should return internal server error failure if the status of the response is 500
      with custom message`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(failureInternalErrorResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(internalServerErrorFailureMock);
            done();
          }
        });
      });

    it(`should return service unavailable error failure if the status of the response is 503`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(serviceUnavailableFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(serviceUnavailableFailureMock);
            done();
          }
        });
      });

    it(`should return gateway timeout error failure if the status of the response is 504`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(gatewayTimeoutFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(gatewayTimeoutFailureMock);
            done();
          }
        });
      });

    it(`should return bad request error failure if the status of the response is 400`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(badRequestFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(badRequestFailureMock);
            done();
          }
        });
      });

    it(`should return unauthorized exception error failure if the status of the response is 401`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(unauthorizedExceptionFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(unauthorizedExceptionFailureMock);
            done();
          }
        });
      });

    it(`should return forbidden exception error failure if the status of the response is 403`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(forbiddenExceptionFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(forbiddenExceptionFailureMock);
            done();
          }
        });
      });

    it(`should return not found error failure if the status of the response is 404`,
      (done: DoneFn) => {

        // WHEN
        service.handleError(notFoundExceptionFailureResponseMock).subscribe({
          error: err => {

            // THEN
            expect(err).toEqual(notFoundExceptionFailureMock);
            done();
          }
        });
      });

    it('should return default failure if response is null', (done: DoneFn) => {
      // WHEN
      service.handleError(null).subscribe({
        error: err => {
          // THEN
          expect(err).toEqual(defaultFailureMock);
          done();
        }
      });
    });

    it('should return server side error messages over client side if present', (done: DoneFn) => {
      // WHEN
      service.handleError(notFoundExceptionFailureResponseMock).subscribe({
        error: err => {
          // THEN
          expect(err).toEqual(notFoundExceptionFailureMock);
          done();
        }
      });
    });
  });

  it('should show an error notification on showNotification', () => {

    const commonErrorTitleMock = 'Test error title';
    const errorSpy = spyOn(notificationV2Service, 'error');
    spyOn(service, '_getCommonErrorTitle').and.returnValue(commonErrorTitleMock);

    //WHEN
    service.showNotification(forbiddenExceptionFailureMock);

    //THEN
    expect(errorSpy).toHaveBeenCalledOnceWith({
      mode: NotificationMode.Error,
      description: 'messages.FORBIDDEN_ERROR',
      title: commonErrorTitleMock,
    });
  });

  describe('_getCommonErrorTitle', () => {
    it('_getCommonErrorTitle should return the expected title when errorCode is present on _getCommonErrorTitle', () => {

      //GIVEN
      spyOn(service, '_translateByKey').and.returnValue('Error message');

      //WHEN
      const result = service._getCommonErrorTitle(failureWithErrorCodeMock);

      //THEN
      expect(result).toBe('Error message: 0');
    });

    it('_getCommonErrorTitle should return the expected title when errorCode is not present on _getCommonErrorTitle', () => {

      //GIVEN
      spyOn(service, '_translateByKey').and.returnValue('Error message');

      //WHEN
      const result = service._getCommonErrorTitle(failureWithoutErrorCodeMock);

      //THEN
      expect(result).toBe('Error message');
    });
  });

  describe('_getErrorCode', () => {
    it('_getErrorCode should return the errorCode from HttpErrorResponse if present', () => {

      //GIVEN
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { errorCode: '500' },
        status: 500,
        statusText: 'Internal Server Error',
      });

      //WHEN
      const result = service._getErrorCode(errorResponse);

      //THEN
      expect(result).toBe('500');
    });

    it('_getErrorCode should return the status code as a string if errorCode is not present in HttpErrorResponse', () => {

      //GIVEN
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 504,
        statusText: 'Gateway Timeout',
      });

      //WHEN
      const result = service._getErrorCode(errorResponse);

      //THEN
      expect(result).toBe('504');
    });
  });

  describe('_getErrorMessage', () => {
    it('should return the errorMessage from HttpErrorResponse if present on _getErrorMessage', () => {

      //GIVEN
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        error: { errorMessage: 'Test error message' },
        status: 500,
        statusText: 'Internal Server Error',
      });

      //WHEN
      const result = service._getErrorMessage(errorResponse);

      //THEN
      expect(result).toBe('Test error message');
    });

    it('should return undefined if errorMessage is not present in HttpErrorResponse on _getErrorMessage', () => {

      //GIVEN
      const errorResponse: HttpErrorResponse = new HttpErrorResponse({
        status: 504,
        statusText: 'Gateway Timeout',
      });

      //WHEN
      const result = service._getErrorMessage(errorResponse);

      //THEN
      expect(result).toBeUndefined();
    });
  });

  it('_translateByKey should call translateService.instant with the provided key', () => {

    //GIVEN
    const keyMock = 'ERROR_CODE';
    spyOn(translateService, 'instant').and.returnValue('Translated test message');

    //WHEN
    const result = service._translateByKey(keyMock);

    //THEN
    expect(result).toBe('Translated test message');
    expect(translateService.instant).toHaveBeenCalledWith(keyMock);
  });

});
