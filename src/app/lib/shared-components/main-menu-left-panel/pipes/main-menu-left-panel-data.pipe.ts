import { ListInfoData } from 'src/app/models';
import { TranslateService } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Translate values in ListInfoData and add translated name and label to items.
 * The full string value (e.g. "navigation.MENU") should be in the input data.
 */
@Pipe({
  name: 'mainMenuLeftPanelDataPipe'
})
export class MainMenuLeftPanelDataPipe implements PipeTransform {
  constructor(
    readonly translateService: TranslateService
  ) {}

  transform(data?: ListInfoData): ListInfoData {
    const result: ListInfoData = {};

    Object.keys(data).forEach(key => {
      const localizedKey = this.translateService.instant(key);
      result[localizedKey] = this._translateItem(data[key]);
    });

    return result;
  }

  _translateItem(dataValue): any {
    dataValue.items.forEach(item => {
      const localizedLabel = this.translateService.instant(item.label);
      item.label = localizedLabel;
      item.name = localizedLabel;
    });

    return dataValue;
  }
}
