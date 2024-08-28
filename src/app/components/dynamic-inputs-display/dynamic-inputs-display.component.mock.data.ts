import { SimpleChanges } from "@angular/core";
import { InputConfigValue } from "src/app/models/input-configuration-details.model";
import { InputData } from "src/app/models/input-data.model";

export const changesMock: SimpleChanges =
{
  'inputDataArray':
  {
    'previousValue': [],
    'currentValue': [],
    'firstChange': false,
    isFirstChange() { return true }
  },
};

export const preloadedValueMock: SimpleChanges =
{
  preloadedValues: {
    'previousValue': [],
    'currentValue': [
      {
        'name': 'vimZone',
        'value': 'cork'
      },
      {
        'name': 'vimProjectName',
        'value': 'erad'
      }, {
        'name': 'userName',
        'value': 'joe'
      }, {
        'name': 'stepValue',
        'pickList': [1, 2, 3]
      }],
    'firstChange': false,
    isFirstChange() { return true }
  }
};

export const preloadedValuesMock: InputConfigValue[] = [
  {
    'name': 'vimZone',
    'value': 'cork'
  },
  {
    'name': 'vimProjectName',
    'value': 'erad'
  },
  {
    'name': 'userName',
    'value': 'joe'
  },
  {
    'name': 'stepValue',
    'pickList': [1]
  }
];


export const preloadedValuesWithoutPicklistMock: InputConfigValue[] = [
  {
    'name': 'vimZone',
    'value': 'cork'
  },
  {
    'name': 'vimProjectName',
    'value': 'erad'
  },
  {
    'name': 'userName',
    'value': 'joe'
  }
];

export const inputDataArrayMock: InputData[] = [
  {
    'name': 'vimZone',
    'mandatory': true,
    'helpMessage': 'Help message for vimZone',
    'constraints': {
      'validValues': 'validation1'
    }
  },
  {
    'name': 'vimProjectName',
    'mandatory': true,
    'helpMessage': 'Help message for vimProjectName',
    'constraints': {
      'validValues': 'validation1'
    }
  },
  {
    'name': 'userName',
    'mandatory': true,
    'helpMessage': 'Help message for userName',
    'constraints': {
      'validValues': 'validation1'
    }
  },
  {
    'name': 'stepValue',
    'mandatory': true,
    'helpMessage': 'Help message for stepValue'
  }
];


export const inputDataArrayMandatoryFalseMock: InputData[] = [
  {
    'name': 'vimZone',
    'mandatory': false,
    'helpMessage': 'Help message for vimZone',
    'constraints': {
      'validValues': 'validation1'
    }
  }
];

export const eventDropDownValueMock: any =
{
  'label': 1,
  'value': 1
};

export const inputDataMock: InputData = {
  'name': 'stepValue',
  'mandatory': true,
  'helpMessage': 'Help message for stepValue'
};


export const dropdownsForNameCacheMockWithSelect: any = {
  'stepValue': [{
    'value': null,
    'label': 'Select'
  },
  {
    'label': 1,
    'value': 1
  },
  {
    'label': 2,
    'value': 2
  },
  {
    'label': 3,
    'value': 3
  }]
};

export const dropdownsForNameCacheMockWithoutSelect: any = {
  'stepValue': [
    {
      'label': 1,
      'value': 1
    },
    {
      'label': 2,
      'value': 2
    },
    {
      'label': 3,
      'value': 3
    }]
};
