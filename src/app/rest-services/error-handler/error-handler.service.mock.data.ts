import { HttpErrorResponse, HttpEventType, HttpHeaders } from "@angular/common/http";
import { DnrFailure } from "src/app/models/dnr-failure.model";
import { ErrorType } from '../../models/enums/error-type.enum';

export const connectionRefusedFailureMock: DnrFailure = {
  type: ErrorType.Connection,
  errorMessage: 'messages.CONNECTION_REFUSED_ERROR',
  errorCode: '0'
};

export const defaultFailureMock: DnrFailure = {
  type: ErrorType.Default,
  errorMessage: 'messages.NO_INFO_AVAILABLE',
  errorCode: ''
};

export const internalServerErrorFailureMock: DnrFailure = {
  type: ErrorType.BackEnd,
  errorMessage: 'messages.INTERNAL_SERVER_ERROR',
  errorCode: '500'
};

export const failureWithErrorCodeMock: DnrFailure = {
  errorMessage: 'Test error message with code',
  errorCode: '0',
  type: ErrorType.Default
};

export const gatewayTimeoutFailureMock: DnrFailure = {
  type: ErrorType.Connection,
  errorMessage: 'messages.GATEWAY_TIMEOUT_ERROR',
  errorCode: '504'
};

export const serviceUnavailableFailureMock: DnrFailure = {
  type: ErrorType.Connection,
  errorMessage: 'messages.SERVICE_UNAVAILABLE_ERROR',
  errorCode: '503'
};

export const badRequestFailureMock: DnrFailure = {
  type: ErrorType.FrontEnd,
  errorMessage: 'messages.BAD_REQUEST',
  errorCode: '400'
};

export const unauthorizedExceptionFailureMock: DnrFailure = {
  type: ErrorType.BackEnd,
  errorMessage: 'messages.UNAUTHORIZED_ERROR',
  errorCode: '401'
};

export const forbiddenExceptionFailureMock: DnrFailure = {
  type: ErrorType.BackEnd,
  errorMessage: 'messages.FORBIDDEN_ERROR',
  errorCode: '403'
};

export const notFoundExceptionFailureMock: DnrFailure = {
  type: ErrorType.BackEnd,
  errorMessage: 'Feature pack 122 does not exist.',
  errorCode: 'DR-01'
};


export const failureWithoutErrorCodeMock: DnrFailure = {
  errorMessage: 'Test error message without code',
  type: ErrorType.Default
};

export const failureInternalErrorResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 500,
  'statusText': 'Internal Server Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 500 Internal Server Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const connectionRefusedFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 0,
  'statusText': 'Connection Refused Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 0 Connection Refused Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const serviceUnavailableFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 503,
  'statusText': 'Service Unavailable Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 503 Service Unavailable Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const gatewayTimeoutFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 504,
  'statusText': 'Gateway Timeout Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 504 Gateway Timeout Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const badRequestFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 400,
  'statusText': 'Bad Request Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 400 Bad Request Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const unauthorizedExceptionFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 401,
  'statusText': 'Unauthorized Exception Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 401 Unauthorized Exception Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const forbiddenExceptionFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  'status': 403,
  'statusText': 'Forbidden Exception Error',
  'url': 'http://localhost:4200/discovery-and-reconciliation/v1/feature-packs',
  'ok': false,
  'name': 'HttpErrorResponse',
  'message': 'Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs: 403 Forbidden Exception Error',
  'error': 'Error',
  'type': HttpEventType.Response
};

export const notFoundExceptionFailureResponseMock: HttpErrorResponse = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'X-Custom-Header': 'Custom-Value',
  }),
  "status": 404,
  "statusText": "Not Found",
  "url": "http://localhost:4200/discovery-and-reconciliation/v1/feature-packs/1w36",
  "ok": false,
  "name": "HttpErrorResponse",
  "message": "Http failure response for http://localhost:4200/discovery-and-reconciliation/v1/feature-packs/1w36: 404 Not Found",
  "error": {
    "httpStatusCode": 404,
    "errorCode": "DR-01",
    "errorMessage": "Feature pack 122 does not exist."
  },
  'type': HttpEventType.Response
}
