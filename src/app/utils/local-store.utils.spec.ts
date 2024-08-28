import { _wipeAllDnRLocalStorage, handleNewUIVersionOnStartUp, persistObjectInLocalStore, retrieveLocalStoreObject, retrieveLocalStorageTableColumns, wipeSpecificStoredData } from './local-store.utils';

import { TableColumnData } from '../components/dnr-table/table-view.model';
import { html } from '@eui/lit-component';
import { localStorageKeys } from 'src/app/constants/app.constants';

describe('LocalStoreUtils', () => {

  const storageName1 = localStorageKeys.JUNIT1;
  const storageName2 = localStorageKeys.JUNIT2;

  afterEach(() => {
    /* it local storage for local machine - not really an issue */
    _wipeAllDnRLocalStorage();
  });

  describe('handleNewUIVersionOnStartUp', () => {

    beforeAll(() => {
      window.localStorage.clear();
    });

    beforeEach(() => {
      _wipeAllDnRLocalStorage();
    });

    it('should be able to persist and retrieve, and not wipe local storage if version is the same', () => {
      // GIVEN
      persistObjectInLocalStore(storageName1, { columns: [{ test: 'some string' }] });
      persistObjectInLocalStore(storageName1, {attribute2: { test2: 'some string' }});
    persistObjectInLocalStore(storageName2, {somethingElse: 'some other string'});

      const expected1 = JSON.stringify( {columns: [{test: 'some string'}], attribute2:  {test2: 'some string'}});
      const expected2 = JSON.stringify({somethingElse: 'some other string'});

      // WHEN
      handleNewUIVersionOnStartUp();

      // THEN
      expect(JSON.stringify(retrieveLocalStoreObject(storageName1))).toEqual(expected1);
      expect(JSON.stringify(retrieveLocalStoreObject(storageName2))).toEqual(expected2);
    });

    it('should wipe local storage for DnR if version is different', () => {

      // GIVEN
      window.localStorage.setItem(storageName2 + "v-999", 'somethingOld'); // not using this class method

      // WHEN
      handleNewUIVersionOnStartUp();

      // THEN
      expect(localStorage.getItem(storageName2 + "v-999")).toBeNull();
    });
  });

  describe('persistValueInObject', () => {

    beforeEach(() => {
      _wipeAllDnRLocalStorage();
      wipeSpecificStoredData('testAttribute');
    });

    it('should create new object in local storage if it does not exist', () => {
      persistObjectInLocalStore(storageName1, {testAttribute: 'testValue'});
      expect(retrieveLocalStoreObject(storageName1)).toEqual({testAttribute:'testValue'});
    });

    it('should update existing object in local storage if it exists', () => {

      // WHEN
      persistObjectInLocalStore(storageName1, {testAttribute: 'testValue'});
      persistObjectInLocalStore(storageName1, {testAttribute: 'updatedValue'});

      // THEN
      expect(retrieveLocalStoreObject(storageName1)).toEqual({testAttribute:'updatedValue'});
    });

    it('should create new object in session storage if it does not exist', () => {
      persistObjectInLocalStore(storageName1, {testAttribute: 'testValue'});
      expect(retrieveLocalStoreObject(storageName1)).toEqual({testAttribute:'testValue'});
    });

    it('should update existing object in session storage if it exists', () => {

      // WHEN
      persistObjectInLocalStore(storageName1, {testAttribute: 'testValue'});
      persistObjectInLocalStore(storageName1, {testAttribute: 'updatedValue'});

      // THEN
      expect(retrieveLocalStoreObject(storageName1)).toEqual({testAttribute:'updatedValue'});
    });

    it('should do nothing if no storage key in call', () => {

      // WHEN
      persistObjectInLocalStore(undefined, {testAttribute: 'testValue'});

      // THEN
      expect(window.localStorage.length).toBe(0);
    });
  });

  describe('_wipeAllDnRLocalStorage tests', () => {

    beforeEach(() => {
      _wipeAllDnRLocalStorage();
    });

    it('should wipe all Dnr Local Storage data', () => {
      window.localStorage.setItem("storageName1", "val1");
      window.localStorage.setItem("storageName2", "val2");
      window.localStorage.setItem("storageName3", "val3");

      wipeSpecificStoredData("storageName1");
      wipeSpecificStoredData("storageName3");

      expect(window.localStorage.getItem("storageName1")).toBeNull();
      expect(window.localStorage.getItem("storageName2")).not.toBeNull();
      expect(window.localStorage.getItem("storageName3")).toBeNull();
    });
  });

  describe('_addBackCellTypeFunctions tests', () => {

    beforeEach(() => {
      _wipeAllDnRLocalStorage();
    });

    it('should add back cell type function if original columns are provided', () => {
      // GIVEN
      const originalColumns: TableColumnData[] = [{
        title: "identifier",
        attribute: 'id',
        sortable: true,
        width: '10em',
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
        title: 'Discrepancies',
        attribute: 'discrepancies',
        width: '10em',
        mandatory: true,
        hidden: false,
      }];
      // WHEN
      const translateServiceSpy = jasmine.createSpyObj('TranslateService', ['instant']);
      persistObjectInLocalStore(storageName1, { columns: originalColumns });
      const retrievedColumns = retrieveLocalStorageTableColumns(storageName1, translateServiceSpy, 'id', originalColumns);

      // THEN
      expect(retrievedColumns[0].cell).toBeDefined();
    });
  });

});
