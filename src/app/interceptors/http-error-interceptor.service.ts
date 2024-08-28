import { HttpErrorResponse, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { ConfigLoaderService } from '@erad/core';
import { Injectable } from '@angular/core';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptorService {

    constructor(private notificationV2Service: NotificationV2Service,
        public translateService: TranslateService,
        public configLoaderService?: ConfigLoaderService,
    ) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                catchError((err: any) => {
                    if (err instanceof HttpErrorResponse) {
                        const runtimeProperties = this.configLoaderService.getRuntimePropertiesInstant();

                        if (!(runtimeProperties && runtimeProperties?.ignoredUrlForNotification)
                            || runtimeProperties?.ignoredUrlForNotification.filter((url) => err.url.match(url)).length === 0) {
                            if (err.status >= 500 && err.status < 600) {
                                this.buildAndShowErrorTitleAndDescription(err, '500');
                            } else if (err.status === 404) {
                                this.buildAndShowErrorTitleAndDescription(err, '404');
                            } else if (err.status === 403) {
                                this.buildAndShowErrorTitleAndDescription(err, '403');
                            } else if (err.status === 400 || (err.status >= 405 && err.status < 452)) {
                                this.buildAndShowErrorTitleAndDescription(err, '400');
                            }
                        }
                    }
                    return throwError(() => new Error(err));
                }));
    }

    private buildAndShowErrorTitleAndDescription(errorObj: any, errStatus) {
        setTimeout(() => {
            let description = '';
            let title = '';
            if (errorObj?.error && errorObj?.error?.code) {
                title = errorObj.error.code;
                description = this.translateService.instant('' + errorObj.error.code);
                if (description == errorObj.error.code) {
                    description = errorObj.error.message || errorObj.error.code;
                }
            } else {
                description = this.translateService.instant(errStatus);
                title = this.translateService.instant(errStatus + '_Error_Title');
            }

            this.notificationV2Service.error({ title, description });
        },0);
    }
}
