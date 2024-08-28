import { TableColumnData } from '../components/dnr-table/table-view.model';
import { TableSortType } from '../components/dnr-table/table-view.enum';
import { TranslateService } from '@ngx-translate/core';

/**
 * Util class for handling Session/Local storage.
 */

/**
 * Update stored object for a value change, or create a new object in local storage
 * This will COMBINE new data with existing data, overwriting old values with the same
 * object key.
 *
 * @param {string} storage            session or local storage
 * @param {*} storageKey              storage key name, e.g. storage id for table
 * @param {string} attributeName      name of attribute in object
 * @param {any} value                 value to change
 */
export function persistObject(
    storage: Storage,
    storageKey: string,
    objToStore: object): void {
  const storedObj = retrieveObject(storage, storageKey) || {};
  const newStoredObj = {
    ...storedObj,
    ...objToStore
  }
  storage.setItem(storageKey, JSON.stringify(newStoredObj));
}

/**
 * Retrieve persisted object from browser storage
 * @param {string} storage     session or local storage
 * @param {*} storageKey       storage key name, e.g. storage id for table
 * @returns                    parsed JSON object for key name or null if not found
 */
export function retrieveObject(storage: Storage, storageKey: string): any | null {
  const storedJsonString = storage.getItem(storageKey);
  return (storedJsonString) ? JSON.parse(storedJsonString) : null;
}

/**
 * Add in the Cell function from the original (un-stored) column data.
 *
 * Stored column meta does not contain cell functions (e.g. functions to change Status string to a pill).
 * This methods adds those cell functions back into the stored column metadata (copied from the original
 * column metadata).
 *
 * @param {*} storedColumns    Column metadata read from storage (for already existing table)
 * @param {*} originalColumns  Default column metadata (used when creating new table)
 * @returns                    parsed JSON object for key name or null if not found
 */
export function addCellFunction(
    translateService: TranslateService,
    sort: string,
    storedColumns: TableColumnData[],
    originalColumns?: TableColumnData[]): TableColumnData[] {

  if (storedColumns?.length > 0) {
    storedColumns?.forEach((storedColumn) => {
      // order could be changed
      const cellFunction = _findColumnCellFunction(originalColumns, storedColumn.attribute);
      storedColumn.cell = cellFunction;
    });
  } else {
    storedColumns = originalColumns;
  }

  return _addTitleAndSortAttrToColumns(translateService, sort, storedColumns);
}

function _findColumnCellFunction(cols: TableColumnData[], attributeName: string): TableColumnData | null {
  return cols.find(col => col.attribute === attributeName)?.cell || null;
}

function _addTitleAndSortAttrToColumns(translateService: TranslateService, sort: string, columns : TableColumnData[]): TableColumnData[] {
  return columns?.map(column => ({
    ...column,
    title: column?.title ? translateService.instant(column?.title) : '',
    sort: _getSortDir(column?.attribute, sort)
  }));
}

function _getSortDir(attribute: string, sort: string = ''): string {
  const sortColumn = sort?.replace(/[-+]/g, '');
  if (sortColumn === attribute) {
    return (sort.startsWith('+')) ? TableSortType.ASC : TableSortType.DESC;
  }
  return null;
}
