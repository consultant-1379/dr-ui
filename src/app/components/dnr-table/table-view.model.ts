import { Item } from '@erad/components/common';

export interface TableColumnData {
  attribute: string;
  cell?: any;
  hidden?: boolean;
  resizable?: boolean;
  sort?: string;
  sortable?: boolean;
  title: string;
  width?: string;
  mandatory?: boolean;
}

export interface TableActionEvent {
  action: Item;
  row?: any; // row in a single row selection scenario
}

export interface CustomProperties {
  [key: string]: string;
}

export interface Row {
  [key: string]: any;
}

export interface PageIndexDetail {
  currentPage?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  numEntries?: number;
  numPages?: number;
  pageClicked?: string; // e.g. "1"
}
