import { AppConstants } from 'src/app/constants/app.constants';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { EntityType } from 'src/app/enums/entity-type.enum';
import { Injectable } from '@angular/core';
import { StateColors } from 'src/app/models/enums/state-colors.enum';
import { TableColumnData } from '../../dnr-table/table-view.model';
import { TableColumnsConfig } from '../app-item-table-view.component.config';
import { TableUtilsService } from 'src/app/services/table-utils.service';

@Injectable({
  providedIn: 'root',
})
export class AppItemTableViewService<T, StatusModel> {


  private _entityType: string;

  constructor(
    readonly tableUtils: TableUtilsService<StatusModel>,
    readonly dateUtils: DateUtilsService) {
  }

  set entityType(entityName: string) {
    this._entityType = entityName;
  }

  get entityType() {
    return this._entityType;
  }

  getColumnsConfig(): TableColumnData[] {
    return TableColumnsConfig[this._entityType];
  }

  createDisplayRow(item: T): any {

    // TODO EEIBKY - must be a better way to do this...separation of concerns...

    if (EntityType.JBS === this._entityType) {

      return this._merge(item, {
        jobScheduleId: item['jobScheduleId'] || AppConstants.undefinedDisplayValue,
        startDate: this.dateUtils.dateTimeFormat(item['startDate']),
        statusColor: StateColors[item['status']],
        status: this.tableUtils.getTranslatedStatus(item['status']),
        statusWithoutTranslation: item['status'],
      });

    }
    if (EntityType.SCHEDULES === this._entityType) {

      // see ColumnsConfigSchedulesEntity
      const jobSpec = {};
      Object.entries(item['jobSpecification']).forEach((entry) => {
        const [key, value] = entry;
        jobSpec[`jobSpecification.${key}`] = value;
      });
      item = this._merge(item, jobSpec);
      return this._merge(item, {
        enabled: this.tableUtils.getTranslatedEnabled(item['enabled']),
        createdAt: this.dateUtils.dateTimeFormat(item['createdAt']),
        "executionOptions.autoReconcile": this.tableUtils.getTranslatedEnabled(item['jobSpecification'].executionOptions.autoReconcile)
      });
    }
    return this._merge(item, {
      createdAt: this.dateUtils.dateTimeFormat(item['createdAt']),
      modifiedAt: this.dateUtils.dateTimeFormat(item['modifiedAt']),
    });
  }

  _merge(item: T, changedValues: object): T {
    return { ...item, ...changedValues };
  }

}
