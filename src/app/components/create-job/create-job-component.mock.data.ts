import { DropdownOption } from "src/app/models/dropdown-option.model";
import { FeaturePackDetailsResponse } from "src/app/models/feature-pack-details-response.model";
import { InputConfiguration } from "src/app/models/input-configuration.model";
import { InputConfigurationDetails } from "src/app/models/input-configuration-details.model";

export const allFeaturePacksMockData: DropdownOption[] = [{
  value: '1', label: 'Feature Pack 1', description: 'Feature Pack 1 description'
},
{ value: '2', label: 'Feature Pack 2', description: 'Feature Pack 2 description' },
{ value: '3', label: 'Feature Pack 3', description: 'Feature Pack 3 description' },
{ value: '4', label: 'Feature Pack 4', description: 'Feature Pack 4 description' }];

export const applicationDropdownMockData : DropdownOption[] = [{
  value: '11', label: 'Application 1', description: 'Application 1 description'
},
{ value: '12', label: 'Application 2', description: 'Application 2 description' },
{ value: '13', label: 'Application 3', description: 'Application 3 description' }];


export const featureDetailMockData: FeaturePackDetailsResponse = {
  id: "2",
  name: "Feature Pack 3",
  description: "Feature Pack 3 description",
  createdAt: "2023-10-03T15:55:12.240Z",
  modifiedAt: null,
  applications: [{
    id: "11",
    name: "Application 1",
    description: "Application 1 description"
  }, {
    id: "12",
    name: "Application 2",
    description: "Application 2 description"
  }, {
    id: "13",
    name: "Application 3",
    description: "Application 3 description"
  }],
  listeners: [],
  inputs: [],
  assets: []
};

export const inputConfigsMockData: InputConfiguration[] = [{
  id: "21", name: "Input Config 1", description: "Input Config 1 description" },
{ id: "22", name: "Input Config 2", description: "Input Config 2 description" },
{ id: "23", name: "Input Config 3", description: "Input Config 3 description" },
{ id: "24", name: "Input Config 4", description: "Input Config 4 description" }];

export const inputConfigDropdownMockData: DropdownOption[] = [
  {
    value: "21", label: "Input Config 1", description: "Input Config 1 description" },
  { value: "22", label: "Input Config 2", description: "Input Config 2 description" },
  { value: "23", label: "Input Config 3", description: "Input Config 3 description" },
  { value: "24", label: "Input Config 4", description: "Input Config 4 description" }

];

export const inputConfigDetailsMockData: InputConfigurationDetails = {
  id: "31",
  name: "pre-set inputs",
  description: "inputs for job definition",
  inputs: [
    {name: "input1", value: "value1"},
    {name: "input2", value: "value2"},
    {name: "input3", pickList: ["value3", "value4", "value5"]},
  ]
}

