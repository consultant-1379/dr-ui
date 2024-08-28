import { NotificationMode, NotificationV2Service } from '@erad/components/notification-v2';

import { DnrFailure } from '../../models/dnr-failure.model';
import { ErrorType } from '../../models/enums/error-type.enum';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpStatusCode } from './http-status-code';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor(
    private readonly notificationV2Service: NotificationV2Service,
    private readonly translateService: TranslateService
  ) { }

  handleError(response: HttpErrorResponse) {
    const failure = this.getFailure(response);

    this.showNotification(failure);

    return throwError(() => failure);
  }

  getFailure(response: HttpErrorResponse): DnrFailure {

    const failureMap = {
      [HttpStatusCode.ConnectionRefused]: {
        type: ErrorType.Connection,
        errorMessage: 'messages.CONNECTION_REFUSED_ERROR'
      },
      [HttpStatusCode.GatewayTimeout]: {
        type: ErrorType.Connection,
        errorMessage: 'messages.GATEWAY_TIMEOUT_ERROR'
      },
      [HttpStatusCode.ServiceUnavailable]: {
        type: ErrorType.Connection,
        errorMessage: 'messages.SERVICE_UNAVAILABLE_ERROR'
      },
      [HttpStatusCode.InternalServerError]: {
        type: ErrorType.BackEnd,
        errorMessage: 'messages.INTERNAL_SERVER_ERROR'
      },
      [HttpStatusCode.BadRequest]: {
        type: ErrorType.FrontEnd,
        errorMessage: 'messages.BAD_REQUEST'
      },
      [HttpStatusCode.UnauthorizedException]: {
        type: ErrorType.BackEnd,
        errorMessage: 'messages.UNAUTHORIZED_ERROR'
      },
      [HttpStatusCode.ForbiddenException]: {
        type: ErrorType.BackEnd,
        errorMessage: 'messages.FORBIDDEN_ERROR'
      },
      [HttpStatusCode.NotFoundException]: {
        type: ErrorType.BackEnd,
        errorMessage: 'messages.NOT_FOUND_ERROR'
      },
      default: {
        type: ErrorType.Default,
        errorMessage: 'messages.NO_INFO_AVAILABLE'
      }
    };

    const errorCode: string = this._getErrorCode(response) || '';
    const errorMessage: string = this._getErrorMessage(response);
    const value = response ? response.status : 'default';

    const failure: DnrFailure = (failureMap[value] || failureMap['default']);

    // server side error messages are not localized (but take priority over client side localized messages)
    failure.errorCode = errorCode;
    failure.errorMessage = errorMessage || this._translateByKey(failure.errorMessage);
    return failure;
  }

  showNotification(failure: DnrFailure): void {
    this.notificationV2Service.error({
      mode: NotificationMode.Error,
      description: failure?.errorMessage,
      title: this._getCommonErrorTitle(failure)
    });
  }

  _getCommonErrorTitle(failure: DnrFailure): string {
    return failure?.errorCode ? `${this._translateByKey('ERROR_CODE')}: ${failure?.errorCode}` : this._translateByKey('ERROR');
  }

  _getErrorCode(errorResponse: HttpErrorResponse): string {
    return errorResponse?.error?.errorCode || errorResponse?.status.toString();
  }

  _getErrorMessage(errorResponse: HttpErrorResponse): string {
    return errorResponse?.error?.errorMessage;
  }

  _translateByKey(key: string): string {
    return this.translateService.instant(key);
  }

}
