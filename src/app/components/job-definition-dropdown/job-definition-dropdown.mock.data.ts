import { Application } from "src/app/models/application.model";
import { DropdownOption } from "src/app/models/dropdown-option.model";
import { SimpleChanges } from "@angular/core";

export const simpleChangesCurrentValueMock: SimpleChanges = {
   'showJobDefinitionFilter': {
      currentValue: true,
      firstChange: true,
      previousValue: false,
      isFirstChange() { return true }
   },
   'featurePackId': {
      currentValue: '1',
      firstChange: true,
      previousValue: false,
      isFirstChange() { return true }
   },
   'applicationId': {
      currentValue: '101',
      firstChange: true,
      previousValue: false,
      isFirstChange() { return true }
   }
};

export const typeMock: any = {
   value: {
      value: {
         type: 'job1-definition'
      }
   }
}

export const jobDefinitionsOptionAllMock: DropdownOption[] =
   [
      {
         value: 'all',
         label: 'All'
      },
      {
         value: 'job1-definition',
         label: 'job1-definition',
         description: 'job 1 description'
      },
      {
         value: 'job2-definition',
         label: 'job2-definition',
         description: 'job 2 description'
      }
   ];

export const jobDefinitionsOptionSelectMock: DropdownOption[] =
   [
      {
         value: null,
         label: 'Select'
      },
      {
         value: 'job1-definition',
         label: 'job1-definition',
         description: 'job 1 description'
      },
      {
         value: 'job2-definition',
         label: 'job2-definition',
         description: 'job 2 description'
      }
   ];

export const jobDefinitionsMock: DropdownOption[] =
   [
      {
         value: 'job1-definition',
         label: 'job1-definition',
         description: 'job 1 description'
      },
      {
         value: 'job2-definition',
         label: 'job2-definition',
         description: 'job 2 description'
      }
   ];

export const ApplicationDetailsMock: Application = {
   id: "3",
   name: "my application",
   description: "my application description",
  jobs: [{
    name: "job-1-from-app",
    description: "data from call to app facade",
    api: { properties: [{ name: 'objectsCol1'}, {name: 'objectsCol2'}] },
    discover: {
      inputs: [{
        name: "vimZone",
        mandatory: true,
        helpMessage: "Help message for vimZone",
        constraints: {
          validValues: "validation1"
        }
      },
      {
        name: "vimProjectName",
        mandatory: true,
        helpMessage: "Help message for vimProjectName",
        constraints: {
          validValues: "validation1"
        }
      }]
    },
    reconcile: {
      inputs: [{
        name: "r1",
        mandatory: true,
        helpMessage: "Help message for vimZone",
        constraints: {
          validValues: "validation1"
        }
      }]
    },
   }]
}


// see ApplicationDetailsMock above
export const filterOptionsFromAppMockData: DropdownOption[] =
   [{
      value: 'all',
      label: 'ALL'
   },
   {
      value: 'job-1-from-app',
      label: 'job-1-from-app',
      description: 'data from call to app facade'
   }
   ];

export const selectOptionsFromAppMockData: DropdownOption[] =
   [
      {
         value: null,
         label: 'SELECT'
      },
      {
         value: 'job-1-from-app',
         label: 'job-1-from-app',
         description: 'data from call to app facade'
      }
   ];
