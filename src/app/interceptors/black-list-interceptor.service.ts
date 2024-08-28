
import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, EMPTY } from 'rxjs';
import { blackListUrls } from './black-list.url';

@Injectable()
export class BlackListInterceptorService {

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.isBlacklisted(request.url)) {
            return EMPTY;
        }
        return next.handle(request);
    }

    isBlacklisted(apiUrl: string): boolean {
        for (const url of blackListUrls) {
            if (apiUrl.includes(url)) {
                return true;
            }
        }
        return false;
    }
}
