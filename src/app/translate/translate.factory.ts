import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModuleConfig } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const translateModuleConfig: TranslateModuleConfig = {
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [ HttpClient ]
  }
};
