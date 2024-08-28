import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class TableUtilsService<T> {
  constructor(readonly translateService: TranslateService) {}

  getTranslatedStatus(state: T): string {
    return state ? this.translateService.instant('state.' + state) : '';
  }

  getTranslatedEnabled(enabled: any): string {
    const enabledString = (enabled === true || enabled === 'true') ? "ENABLED" : "DISABLED";
    return this.translateService.instant(enabledString);
  }

  getAttributeTranslationIfPresent(transPrefix: string, attribute: string): string {
    const key = `${transPrefix}.${attribute}`;
    return (this._hasTranslation(key))
      ? this.translateService.instant(key)
      : attribute;
  }

  _hasTranslation(key: string): boolean {
    const translation = this.translateService.instant(key);
    return translation !== key && translation !== '';
  }
}
