import { TableColumnData } from '../dnr-table/table-view.model';
import { html } from '@eui/lit-component';
import { tooltipCell } from '../dnr-table/table-view.component.config';

enum ColumnTitle {
  OBJECT_ID = 'discoveredObjects.OBJECT_ID',
  DISCREPANCIES = 'discoveredObjects.DISCREPANCIES',
  STATUS = 'discoveredObjects.STATUS',
}

export enum DiscoveredObjectsActionsType {
  RECONCILE = 'RECONCILE',
}

export const ColumnsConfig: TableColumnData[] = [
  {
    title: ColumnTitle.OBJECT_ID,
    attribute: 'objectId',
    sortable: true,
    width: '150px',
    mandatory: true,
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell" id="${row[column.attribute]}">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50" class="tooltip-cell">
          <span
            part="item-id"
            class="item-id table__cell-content">
            ${row[column.attribute]}
          </span>
        </eui-tooltip>
      </div>
    `
  },
  {
    title: ColumnTitle.STATUS,
    attribute: 'status',
    sortable: true,
    width: '200px',  /* more room for pill if SDK kebab menu is present in cell */
    hidden: false,
    cell: (row, column) => html`
      <div class="table__cell state__cell">
        <eui-tooltip message="${row[column.attribute]}" position="top" delay="50">
          <eui-pill icon="alarm-level5" color="${row.statusColor}" class="state-badge tooltip-cell" disabled>
            ${row[column.attribute]}
          </eui-pill>
        </eui-tooltip>
      </div>
    `
  },
  {
    title: ColumnTitle.DISCREPANCIES,
    attribute: 'discrepancies',
    width: '300px',
    mandatory: true,
    hidden: false,
    cell: tooltipCell
  }

];
