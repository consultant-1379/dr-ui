import { Item } from "@erad/components";
import { SimpleChanges } from "@angular/core";
import { TableSortType } from "./table-view.enum";

export const selectedRowMock: any[] = [
   {
      "id": "1",
      "name": "Feature pack 1-0-1",
      "description": "Description of feature pack 1",
      "createdAt": "2023-08-07T16:48:02Z",
      "modifiedAt": "2023-04-07T01:06:47Z"
   }
];

export const sortClickedEventDescMock: CustomEvent = new CustomEvent('click', {
   detail: {
      sort: TableSortType.DESC,
      column: {
         attribute: 'name'
      }
   }
});

export const sortClickedEventAscMock: CustomEvent = new CustomEvent('click', {
  detail: {
     sort: TableSortType.ASC,
     column: {
        attribute: 'id'
     }
  }
});

export const CustomEventMock: CustomEvent = new CustomEvent('click', {
   detail: selectedRowMock
});

export const selectEventMock: CustomEvent = new CustomEvent('eui-table:row-select', {
   detail: selectedRowMock
});

export const EntityDetailMockData: any[] = [
   {
      "id": "1",
      "name": "Feature pack 1-0-1",
      "description": "Description of feature pack 1",
      "createdAt": "2023-08-07T16:48:02Z",
      "modifiedAt": "2023-04-07T01:06:47Z"
   },
   {
      "id": "2",
      "name": "Feature pack 1-0-2",
      "description": "Description of feature pack 2",
      "createdAt": "2023-03-24T13:01:27Z",
      "modifiedAt": "2023-08-14T02:52:33Z"
   },
   {
      "id": "3",
      "name": "Feature pack 1-0-3",
      "description": "Description of feature pack 3",
      "createdAt": "2023-05-13T10:54:58Z",
      "modifiedAt": "2023-06-15T03:32:42Z"
   },
   {
      "id": "4",
      "name": "Feature pack 1-0-4",
      "description": "Description of feature pack 4",
      "createdAt": "2023-07-21T03:21:21Z",
      "modifiedAt": "2023-09-15T02:13:18Z"
   },
   {
      "id": "5",
      "name": "Feature pack 1-0-5",
      "description": "Description of feature pack 5",
      "createdAt": "2023-05-14T01:58:20Z",
      "modifiedAt": "2023-07-12T15:25:44Z"
   }
];


export const tileInnerHTMLMock = `<eui-table slot="content" resizable="" custom-row-height="48" sortable="" multi-select="" expanded-row-height="100px">` +
   `<eui-menu slot="context-menu" id="actions-menu" part="actions-menu"></eui-menu></eui-table>`;

export const tableElementMock = `<eui-dialog label=\"table.SETTINGS\"><eui-button id=\"apply-settings\" primary=\"true\" slot=\"bottom\">buttons.APPLY</eui-button><eui-table-setting hide-all=\"table.HIDE_ALL\" show-all=\"table.SHOW_ALL\" sub-heading=\"table.COLUMNS\" `+
`visibility-action-tooltip=\"table.VISIBILITY_TOOLTIP\" slot=\"content\" pin-action-tooltip=\"pin / unpin column\"></eui-table-setting></eui-dialog><eui-tile column=\"0\" column-span=\"1\" row=\"0\" row-span=\"1\"></eui-tile>`+
`<eui-pagination num-entries=\"10\" current-page=\"1\" num-pages=\"0\" comp-orientation=\"horizontal\" comp-direction=\"normal\" style=\"display: flex; justify-content: center; outline: none;\"></eui-pagination>`+
`<eui-dialog label=\"table.SETTINGS\"><eui-button id=\"apply-settings\" primary=\"true\" slot=\"bottom\">buttons.APPLY</eui-button><eui-table-setting hide-all=\"table.HIDE_ALL\" show-all=\"table.SHOW_ALL\" sub-heading=\"table.COLUMNS\" visibility-action-tooltip=\"table.VISIBILITY_TOOLTIP\" slot=\"content\" pin-action-tooltip=\"pin / unpin column\"></eui-table-setting></eui-dialog>`+
`<eui-tile column=\"0\" column-span=\"1\" row=\"0\" row-span=\"1\"><eui-table slot=\"content\" custom-row-height=\"48\" sortable=\"\" multi-select=\"\" expanded-row-height=\"100px\"><eui-menu slot=\"context-menu\" id=\"actions-menu\" part=\"actions-menu\"></eui-menu></eui-table></eui-tile>`;


export const changesMock: SimpleChanges = {
   "loading": {
      "currentValue": true,
      "firstChange": true,
      "previousValue": false,
      isFirstChange() { return true }
   },
   data: {
      "currentValue": [],
      "firstChange": true,
      "previousValue": false,
      isFirstChange() { return true }
   },

   "actionItems": {
      "currentValue": [{
         allowForStatus: ['COMPLETED', 'DISCOVERY_FAILED', 'DISCOVERED', 'NEW', 'PARTIALLY_RECONCILED', 'RECONCILE_REQUESTED'],
         handler: () => {
            // empty handler okay (comment here for SONAR compliance)
         },
         icon: "trashcan",
         label: "DELETE_JOB"
      },
      {
         allowForStatus: ['NEW'],
         handler: () => {
            // empty handler okay (comment here for SONAR compliance)
         },
         icon: "whatever",
         label: "SOME_ACTION"
      }],
      "firstChange": true,
      "previousValue": false,
      isFirstChange() { return true }
   },
   "selectedItems": {
      "currentValue": ["1", "2", "3"],
      "firstChange": true,
      "previousValue": false,
      isFirstChange() { return true }
   },
   "displayRows": {
      "currentValue": [],
      "firstChange": true,
      "previousValue": false,
      isFirstChange() { return true }
   },
   "localStorageKey": {
      "currentValue": "dnr:jobs_table_v1.0",
      "firstChange": false,
      "previousValue": "dnr:fp_table_v1.0",
      isFirstChange() { return false }
   },
   "sessionStorageKey": {
      "currentValue": "tab_Analyst 1-0-3",
      "firstChange": true,
      "previousValue": "tab_Analyst 1-0-5",
      isFirstChange() { return true }
   },
};

export const showActionMenuEventDetail = {
   "row": {
      "id": "1",
      "name": "Feature pack 1-0-1",
      "description": "Description of feature pack 1",
      "createdAt": "2023-08-07T16:48:02Z",
      "modifiedAt": "2023-04-07T01:06:47Z",
      "selected": true
   },
   "menu": {
      "_prevProps": {
         "position": null,
         "selectAll": null,
         "show": false,
         "type": null,
         "_maxPaddingLeft": 0,
         "_maxPaddingRight": 0,
         "i18n": null
      },
      "_justConnected": false,
      "_localeCache": {
         "_locales": {}
      },
      "position": {
         "isTrusted": true
      },
      "selectAll": null,
      "show": false,
      "type": null,
      "_maxPaddingLeft": 0,
      "_maxPaddingRight": 0,
      "i18n": null,
   },
   "position": {
      "isTrusted": true
   }
};

export function mockActions(): Item[] {
   const mockItems: Item[] = [];

   const mockItem: Item = {
      label: 'Mock Item',
      value: 'mock',
   };

   mockItems.push(mockItem);

   return mockItems;
}

