import { addCellFunction, persistObject, retrieveObject } from './store.utils';

import { TableColumnData } from '../components/dnr-table/table-view.model';
import { TranslateService } from '@ngx-translate/core';

/**
 * Util class to handle user setting persistence, e.g.
 * for use with say table settings (or future dashboards, etc.)
 *
 * Session storage only lasts for as long as the user keeps the browser tab or window open.
 * This is short term storage.
 */

/**
 * Persist object in session storage.
 * objectToStore will be added to existing values in store (under that storageKey)
 * i.e. this does NOT clear storage of other values.
 *
 * @param {string} storageKey         session storage key name, e.g. storage id for table
 * @param {string} objectToStore       object to store
 */
export function persistObjectInSessionStore(storageKey: string, objectToStore: object): void {
  if (!storageKey) {
    return;
  }
  persistObject(window.sessionStorage, storageKey, objectToStore);
}

/**
 * Retrieve persisted object from session storage.
 * @param {*} storageKey      session storage key name, e.g. storage id for table
 * @returns                    parsed JSON object for key name or null if not found
 */
export function retrieveSessionStoreObject(storageKey: string): any | null {
  return retrieveObject(window.sessionStorage, storageKey);
}

/**
 * Wipe data for specific key in session storage.
 * @param storageName - storage key
 */
export function wipeSpecificSessionStoredData(storageName: string): void {
  const currentKeys = Object.keys(window.sessionStorage);
  for (let currentKey of currentKeys) {
      if (currentKey === storageName && window.sessionStorage.getItem(currentKey) !== null) {
          window.sessionStorage.removeItem(currentKey);
          break;
      }
  }
}

/**
 * Retrieve persisted object from session storage and add in the Cell function from the original (un-stored) column data.
 * @param {*} storageKey      session storage key name, e.g. storage id for table
 * @param {*} originalColumns  Applicable if storing table data - i.e.
 *                             pass original column metadata for case where retrieving
 *                             table column data and the data includes functions (which would not
 *                             be persisted in session storage)
 * @returns                    parsed JSON object for key name or null if not found
 */
export function retrieveSessionStorageTableColumns(
    storageKey: string,
    translateService: TranslateService,
    sort: string,
    originalColumns: TableColumnData[]): any | null {
  let storedColumns = retrieveObject(window.sessionStorage, storageKey)?.columns;
  if (originalColumns.length !== storedColumns?.length) {
    storedColumns = null;
  }
  return addCellFunction(translateService, sort, storedColumns, originalColumns);
}
