import { AppConstants } from 'src/app/constants';
import { html } from '@eui/lit-component';

export const emptyField = AppConstants.undefinedDisplayValue;

export const tooltipCell = (row, column) => html`
  <div class="table__cell ${emptyFieldClass(row[column.attribute])}">
    <eui-tooltip message="${row[column.attribute]}" position="top" delay="48" class="tooltip-cell">
      <span class="table__cell-content">
        ${row[column.attribute]}
      </span>
    </eui-tooltip>
  </div>
`;

export const ListTableStyles = `
  <style>
    tr[data-index] .multi-select-control {
      z-index: 10!important;
    }
    table:focus, tbody:focus, tr:focus-visible {
      outline: none!important;
    }
    table, tbody > tr {
      background-color: var(--feature-layout-background)  !important
    }
    tbody > tr:hover {
      background-color: var(--table-hover-background, #DCDCDC)  !important;
    }
    tr:focus td {
      outline: 0
    }
    th {
      border-right: 1px solid var(--table-outer-gray, #878787);
      padding-right: 10px;
      border-right: 0;
    }
    td .table__cell {
      justify-content: space-between;
      font-size: 14px;
    }
    th .table__cell .table__cell-content {
      flex: initial;
      margin-top: 3px;
      font-size: 14px;
    }
    th .table__cell.discoveredObjects .table__cell-content {
      text-transform: capitalize;
    }
    td .table__cell .table__cell-content {
      cursor: pointer
    }
    .state__cell eui-pill {
      opacity: 1;
    }
    .tooltip-cell {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .table__cell.empty-field {
      padding-left: 2em;
    }
  </style>
`;

export const ListTileStyles = `
  .tile {
    background-color: var(--feature-layout-background)  !important;
    gap: var(--space-base, 0px) !important;
  }
  .tile .tile__header__left__title {
    display: none;
  }

  .tile .tile__header__left__subtitle {
    font-size: 14px;
    color: var(--erad-base-color-dim-gray, #6a6a6a);
  }

  .tile .tile__header__left {
    align-items: center;
  }

  .tile .tile__header__left .divider {
    opacity: 1;
    width: 1px;
    display: block;
    background-color: var(--erad-base-color-gray-87, #878787);
  }

  .tile .tile__header__left eui-icon:hover {
    cursor: pointer;
  }

  .tile .tile__header {
    min-height: 48px;
    align-items: center;
    padding-bottom: 0;
  }

  .tile:focus-visible, .tile:focus, .tile .tile__header:focus-visible, .tile .tile__header:focus {
    outline: none;
  }

  .tile .tile__header .list-view-icon-settings {
    display: flex;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
  .list-view-icon-reload {
    --icon-color: black;
  }
`;

export const listMenuStylesBefore = `
  tr,
  td .table__cell {
    height:0;
  }
`;

export const listMenuStylesAfter = `
  tr {
    height: var(--row-height, 48px);
  }
  tr:focus td, tr:focus td:first-child {
    border: 0!important;
  }
  td:focus-visible {
    outline: 0;
  }
  tr:focus td:first-child {
    cursor: pointer!important;
  }
  td .table__cell {
    height: height: calc((var(--row-height) - 15px) / var(--cell-count, 1));
  }
`;

export const emptyFieldClass = (value: string): string =>
  value === emptyField
    ? 'empty-field'
    : '';
