import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({providedIn: 'any'})
export class TranslateViewResolverService implements Resolve<any> {
    constructor(readonly translateService: TranslateService) { }

    resolve(_route: ActivatedRouteSnapshot) {
        this.translateService.use(this.translateService.getDefaultLang())
    }
}
