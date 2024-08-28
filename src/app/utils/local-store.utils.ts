import { addCellFunction, persistObject, retrieveObject } from './store.utils';

import { TableColumnData } from '../components/dnr-table/table-view.model';
import { TranslateService } from '@ngx-translate/core';
import { localStorageKeys } from '../constants';

/**
 * Util class to handle user setting persistence, e.g.
 * for use with say table settings (or future dashboards, etc.)
 *
 * Local storage lasts for life time of UI version (failing having a version,
 * will use a fallback constant that can be manually changed when know would need to wipe
 * local storage on upgrade - e.g. changed some column in a table, etc..)
 */

/**
 * Current dnrVersion for use in local storage keys - if null reading fallback for now
 * future code could read this from deployment location
 * (exposed for unit test)
 */
const dnrVersion: string = null;  // future code could read this from deployment location

/**
 * Fallback for no version being available at this point in expected deploy location
 * (It would even be possible to remove reliance on a version being present if prepared to
 * manually update this whenever know upgrade will require a local storage clear, e.g.
 * for the case of changing columns to be displayed).
 */
export const _LOCAL_STORAGE_UI_VERSION_ID: string = 'v1.2.6';

/**
 * Clean up customer browser in case we change things on upgrade
 * so that say new columns added to a table or color changes in a dashboard,
 * etc are picked up
 *
 * Will be removing all keys (DnR keys only) with older Dnr Version
 * (exposed for junit
 */
export function _wipeAllDnRLocalStorage(): void {
  const dnrLocalStorageConstants = Object.values(localStorageKeys);
  for (let dnrLocalStorageConstant of dnrLocalStorageConstants) {
    wipeSpecificStoredData(dnrLocalStorageConstant);
  }
}

/**
 * Wipe data for specific key
 * @param storageName - storage key (or start of key for case of local storage keys with version)
 */
export function wipeSpecificStoredData(storageName: string): void {
  const currentKeys = Object.keys(window.localStorage);
  for (let currentKey of currentKeys) {
      if (currentKey.startsWith(storageName) && window.localStorage.getItem(currentKey) !== null) {
          window.localStorage.removeItem(currentKey);
          break;
      }
  }
}

/**
 * Method to call on UI launch
 * to ensure that if Dnr version is new, will clear any previous
 * local storage settings for Dnr UI
 *
 * e.g. for dashboard settings (in case new charts are being delivered) or
 * table settings if new columns are being added, etc./
 */
export function handleNewUIVersionOnStartUp(): void {
    if (_isFirstTimeWithThisUIVersion()) {
        _wipeAllDnRLocalStorage();
    }
}

/* exposed for unit test */
export function _isFirstTimeWithThisUIVersion(): boolean {
  const currentKeys = Object.keys(window.localStorage);
  for (let currentKey of currentKeys) {
    if (currentKey.endsWith(dnrVersion) || currentKey.endsWith(_LOCAL_STORAGE_UI_VERSION_ID)) {
        return false;
    }
  }
  return true;
}

/**
 * Persist object in local storage.
 * objectToStore will be added to existing values in store (under that storageName)
 * i.e. this does NOT clear storage of other values.
 *
 * @param {string} storageName         local storage key name, e.g. storage id for table
 * @param {string} objectToStore       object to store
 */
export function persistObjectInLocalStore(storageName: string, objectToStore: object): void {
  if (!storageName) {
    return;
  }
  const storageKey = _generateKeyForVersion(storageName);
  persistObject(window.localStorage, storageKey, objectToStore);
}

/**
 * Retrieve persisted object from local storage.
 * @param {*} storageName      local storage key name, e.g. storage id for table
 * @returns                    parsed JSON object for key name or null if not found
 */
export function retrieveLocalStoreObject(storageName: string): any | null {
  const storageKey = _generateKeyForVersion(storageName);
  return retrieveObject(window.localStorage, storageKey);
}

/**
 * Retrieve persisted table columns meta data from local storage and add in the Cell function from the original (un-stored) column data.
 * @param {*} storageName      local storage key name, e.g. storage id for table
 * @param {*} originalColumns  Applicable if storing table data - i.e.
 *                             pass original column metadata for case where retrieving
 *                             table column data and the data includes functions (which would not
 *                             be persisted in local storage)
 * @returns                    parsed JSON object for key name or null if not found
 */
export function retrieveLocalStorageTableColumns(
    storageName: string,
    translateService: TranslateService,
    sort: string,
    originalColumns: TableColumnData[]): any | null {
  const storageKey = _generateKeyForVersion(storageName);
  const storedColumns = retrieveObject(window.localStorage, storageKey)?.columns;
  return addCellFunction(translateService, sort, storedColumns, originalColumns);
}

/**
 * Generate a local storage key that will last for life time of the UI version
 *
 * @returns {String}  storageName  - a known Dnr constant (add to localStorageKeys in AppConstants if want removed on upgrade)
 */
function _generateKeyForVersion(storageName: string): string {
  if (dnrVersion) {
      return storageName + dnrVersion;
  }
  return storageName + _LOCAL_STORAGE_UI_VERSION_ID;
}
