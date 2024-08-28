import { EntityType } from 'src/app/enums/entity-type.enum';
import { TableColumnData } from '../dnr-table/table-view.model';
import { html } from '@eui/lit-component';
import { tooltipCell } from '../dnr-table/table-view.component.config';

// TODO EEIBKY put these in the the tables themselves...
// app-item-table should be generic and care not one wit about
// what table it is displaying...

enum ColumnJobAppItem {
  ID = 'job.ID',
  NAME = 'job.NAME',
  STATUS = 'job.STATUS',
  DESCRIPTION = 'job.DESCRIPTION',
  FEATURE_PACK = 'job.FEATURE_PACK',
  FEATURE_PACK_ID = 'job.FEATURE_PACK_ID',
  APPLICATION = 'job.APPLICATION',
  APPLICATION_ID = 'job.APPLICATION_ID',
  JOB_DEFINITION = 'job.JOB_DEFINITION',
  START_DATE = 'job.START_DATE',
  SCHEDULE_ID = 'job.SCHEDULE_ID',
  // TODO eeicmsy  - swagger says JobSummaryDto will have "completedDate" but not seeing it in JobListDto response for jobs table
  // (is swagger wrong and completedDate is only in the JobDto - used for job details on an individual job id lookup?)
}

enum ColumnScheduleAppItem {
  ID = 'schedule.ID',
  NAME = 'schedule.NAME',
  DESCRIPTION = 'schedule.DESCRIPTION',
  CRON = 'schedule.CRON',
  EXECUTION = 'schedule.EXECUTION',
  JOB_DEFINITION = 'schedule.JOB_DEFINITION',
  CREATED_AT = 'schedule.CREATED_AT',
  AUTO_RECONCILE = 'schedule.AUTO_RECONCILE',
  JOB_NAME = 'schedule.JOB_NAME',
  JOB_DESCRIPTION = 'schedule.JOB_DESCRIPTION',
  FEATURE_PACK_ID = 'job.FEATURE_PACK_ID',
  FEATURE_PACK = 'job.FEATURE_PACK',
  APPLICATION = 'job.APPLICATION',
  APPLICATION_ID ='job.APPLICATION_ID',
}

enum ColumnFPAppItem {
  ID = 'featurePack.ID',
  NAME = 'featurePack.NAME',
  DESCRIPTION = 'featurePack.DESCRIPTION',
  CREATED_AT = 'featurePack.CREATED_AT', // not showing 'modifiedAt' value from server as always same as 'createdAt'
}

export enum AppItemTableButton {
  DELETE = 'DELETE',
  DUPLICATE = 'DUPLICATE',
  UPDATE = 'UPDATE',
  UNINSTALL = 'UNINSTALL',
}

export const ColumnsConfigJobEntity: TableColumnData[] = [
  {
    title: ColumnJobAppItem.ID,
    attribute: 'id',
    sortable: true,
    width: '200px',
    mandatory: true,
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell" id="${row[column.attribute]}">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50" class="tooltip-cell">
          <span part="item-id" class="item-id table__cell-content"> ${row[column.attribute]} </span>
        </eui-tooltip>
      </div>
    `,
  },
  {
    title: ColumnJobAppItem.NAME,
    attribute: 'name',
    sortable: true,
    width: '200px',
    mandatory: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.STATUS,
    attribute: 'status',
    sortable: true,
    width: '200px',
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell state__cell">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50">
          <eui-pill icon="alarm-level5" color="${row.statusColor}" class="state-badge tooltip-cell" disabled> ${row[column.attribute]} </eui-pill>
        </eui-tooltip>
      </div>
    `,
  },
  {
    title: ColumnJobAppItem.DESCRIPTION,
    attribute: 'description',
    width: '300px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.FEATURE_PACK,
    attribute: 'featurePackName',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.FEATURE_PACK_ID,
    attribute: 'featurePackId',
    width: '200px',
    sortable: true,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.APPLICATION,
    attribute: 'applicationName',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.APPLICATION_ID,
    attribute: 'applicationId',
    width: '200px',
    sortable: true,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.JOB_DEFINITION,
    attribute: 'applicationJobName',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.START_DATE,
    attribute: 'startDate',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnJobAppItem.SCHEDULE_ID,
    attribute: 'jobScheduleId',
    width: '150px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  }

];

export const ColumnsConfigFPEntity: TableColumnData[] = [
  {
    title: ColumnFPAppItem.ID,
    attribute: 'id',
    sortable: true,
    width: '200px',
    mandatory: true,
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell" id="${row[column.attribute]}">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50" class="tooltip-cell">
          <span part="item-id" class="item-id table__cell-content"> ${row[column.attribute]} </span>
        </eui-tooltip>
      </div>
    `,
  },
  {
    title: ColumnFPAppItem.NAME,
    attribute: 'name',
    sortable: true,
    width: '250px',
    mandatory: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnFPAppItem.DESCRIPTION,
    attribute: 'description',
    width: '400px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnFPAppItem.CREATED_AT,
    attribute: 'createdAt',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
];

/**
 * @see AppItemTableViewService #createDisplayRow  which changes attributes names
 */
export const ColumnsConfigSchedulesEntity: TableColumnData[] = [
  {
    title: ColumnScheduleAppItem.ID,
    attribute: 'id',
    sortable: true,
    width: '150px',
    mandatory: true,
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell" id="${row[column.attribute]}">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50" class="tooltip-cell">
          <span part="item-id" class="item-id table__cell-content"> ${row[column.attribute]} </span>
        </eui-tooltip>
      </div>
    `,
  },
  {
    title: ColumnScheduleAppItem.NAME,
    attribute: 'name',
    sortable: true,
    width: '250px',
    mandatory: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.DESCRIPTION,
    attribute: 'description',
    width: '300px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.CRON,
    attribute: 'expression',
    width: '175px',
    sortable: false,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.EXECUTION,
    attribute: 'enabled',
    width: '130px',
    sortable: false, // server does not support to date
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.CREATED_AT,
    attribute: 'createdAt',
    width: '200px',
    sortable: true,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.JOB_NAME,
    attribute: 'jobSpecification.name',
    width: '200px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.JOB_DESCRIPTION,
    attribute: 'jobSpecification.description',
    width: '200px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.FEATURE_PACK,
    attribute: 'jobSpecification.featurePackName',
    width: '200px',
    sortable: false,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.FEATURE_PACK_ID,
    attribute: 'jobSpecification.featurePackId',
    width: '200px',
    sortable: false,
    hidden: false,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.APPLICATION,
    attribute: 'jobSpecification.applicationName',
    width: '200px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.APPLICATION_ID,
    attribute: 'jobSpecification.applicationId',
    width: '200px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.JOB_DEFINITION,
    attribute: 'jobSpecification.applicationJobName',
    width: '200px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
  {
    title: ColumnScheduleAppItem.AUTO_RECONCILE,
    attribute: 'executionOptions.autoReconcile',
    width: '150px',
    sortable: false,
    hidden: true,
    cell: tooltipCell,
  },
];

export const TableColumnsConfig = {
  [EntityType.FP]: ColumnsConfigFPEntity,
  [EntityType.JBS]: ColumnsConfigJobEntity,
  [EntityType.SCHEDULES]: ColumnsConfigSchedulesEntity,
};
