import { persistObjectInSessionStore, retrieveSessionStorageTableColumns, retrieveSessionStoreObject, wipeSpecificSessionStoredData } from './session-store.utils';

import { TableColumnData } from '../components/dnr-table/table-view.model';
import { html } from '@eui/lit-component';
import { localStorageKeys } from 'src/app/constants/app.constants';

describe('SessionStoreUtils', () => {

  const storageName1 = localStorageKeys.JUNIT1;
  const storageName2 = localStorageKeys.JUNIT2;

  beforeEach(() => {
    window.sessionStorage.clear();
  });

  describe('persistValueInObject', () => {

    it('should create new object in local storage if it does not exist', () => {
      persistObjectInSessionStore(storageName1, {testAttribute: 'testValue'});
      expect(retrieveSessionStoreObject(storageName1)).toEqual({testAttribute:'testValue'});
    });

    it('should update existing object in local storage if it exists', () => {

      // WHEN
      persistObjectInSessionStore(storageName1, {testAttribute: 'testValue'});
      persistObjectInSessionStore(storageName1, {testAttribute: 'updatedValue'});

      // THEN
      expect(retrieveSessionStoreObject(storageName1)).toEqual({testAttribute:'updatedValue'});
    });

    it('should create new object in session storage if it does not exist', () => {
      persistObjectInSessionStore(storageName1, {testSessionAttribute: 'testValue'});
      expect(retrieveSessionStoreObject(storageName1)).toEqual({testSessionAttribute:'testValue'});
    });

    it('should update existing object in session storage if it exists', () => {

      // WHEN
      persistObjectInSessionStore(storageName1, {testSessionAttribute: 'testValue'});
      persistObjectInSessionStore(storageName1, {testSessionAttribute: 'updatedValue'});

      // THEN
      expect(retrieveSessionStoreObject(storageName1)).toEqual({testSessionAttribute:'updatedValue'});
    });

    it('should do nothing if no storage key in call', () => {

      // WHEN
      persistObjectInSessionStore(undefined, {testSessionAttribute: 'testValue'});

      // THEN
      expect(window.sessionStorage.length).toBe(0);
    });
  });

  describe('wipeSpecificSessionStoredData', () => {

    it('should remove specific object from session storage', () => {

      // GIVEN
      persistObjectInSessionStore(storageName1, { testSessionAttribute: 'testValue' });
      persistObjectInSessionStore(storageName2, { testSessionAttribute: 'testValue2' });

      // WHEN
      wipeSpecificSessionStoredData(storageName1);

      // THEN
      expect(retrieveSessionStoreObject(storageName1)).toBeNull();
      expect(window.sessionStorage.length).toBe(1);

      wipeSpecificSessionStoredData(storageName2);
      expect(window.sessionStorage.length).toBe(0);
    });
  });

  describe('_addBackCellTypeFunctions tests', () => {

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
      persistObjectInSessionStore(storageName1, { columns: originalColumns });
      const retrievedColumns = retrieveSessionStorageTableColumns(storageName1, translateServiceSpy, 'id', originalColumns);

      // THEN
      expect(retrievedColumns[0].cell).toBeDefined();
    });
  });

});
