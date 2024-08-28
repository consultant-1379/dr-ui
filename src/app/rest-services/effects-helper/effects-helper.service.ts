import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';
import { catchError, map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

import { ErrorHandlerService } from '../error-handler/error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class EffectsHelperService {

  constructor(
    readonly notificationV2Service: NotificationV2Service,
    readonly errorHandlerService: ErrorHandlerService,
    readonly translateService: TranslateService,
  ) { }

  showErrorMessage() {
    return tap({
      error: error => {
        this.errorHandlerService.handleError(error);
      }
    });
  }

  showSuccessMessage(title: string, description:string = '', interpolateParams?:Object ) {

    const i18nTitle = this.translateService.instant(title) || title;
    const i18nDescription = this.translateService.instant(description, interpolateParams) || description;
    this.notificationV2Service.success({
      title: i18nTitle,
      description: i18nDescription});
  }

  handleSuccess(Action, key) {
    return map(response => new Action({ [key]: response }));
  }

  handleFailure(Action, partial = { }) {
    return catchError(error => {
      const failure = this.errorHandlerService.getFailure(error);

      // eslint-disable-next-line no-console
      console.error(error);
      // eslint-disable-next-line no-console
      console.error('Failure (with errorCode): ', failure);

      return of(new Action({
        ...partial,
        failure
      }));
    });
  }

}
