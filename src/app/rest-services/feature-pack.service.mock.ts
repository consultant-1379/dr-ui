import { generateMockService } from '@erad/utils';
import { ApplicationItemsResponse } from '../models/application-items-response.model';
import { Application } from '../models/application.model';
import { FeaturePackDetailsResponse } from '../models/feature-pack-details-response.model';
import { InputConfigurationDetails } from '../models/input-configuration-details.model';
import { QueryParams } from '../models/query.params.model';
import { FeaturePackService } from './feature-pack.service';

export const FeaturePackServiceMock =
  generateMockService(FeaturePackService);

export const featurePackItemsResponseMock =
{
  items:
    [Object
      ({
        id: '1', name: 'John',
        description: 'Job service description test',
        featurePackId: 'featurePackId_testdata_1',
        applicationId: 'applicationId_testdata_1',
        applicationJobName: 'applicationJobName test',
        createdAt: 'Fri Jun 17 2023 11:27:28 GMT+0100',
        status: null
      })],
  totalCount: 1
};

export const featurePackDetailsResponseMock: FeaturePackDetailsResponse = {
  "id": "185",
  "name": "Feature pack 1-0-96",
  "description": "Description of feature pack 96",
  "createdAt": "2023-01-07T11:27:02Z",
  "modifiedAt": "2023-07-07T06:27:24Z",
  "applications": [
    {
      "id": "101",
      "name": "Reconciliation Application 1",
      "description": "Reconciliation application description"
    },
    {
      "id": "103",
      "name": "Reconciliation Application 3",
      "description": "Reconciliation application description"
    }
  ],
  "listeners": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "inputs": [
    {
      "id": "301",
      "name": "Input Configurations 1 name",
      "description": "Input Configurations 1 description"
    },
    {
      "id": "302",
      "name": "Input Configurations 2 name (for job2-def keys)",
      "description": "Input Configurations 2 description"
    },
    {
      "id": "303",
      "name": "Input Configurations 3 name",
      "description": "Input Configurations 3 description"
    }
  ],
  "assets": [
    {
      "id": "12346",
      "name": "featurePackFile.zip",
      "description": "file uploaded from user file system"
    }
  ]
};

export const applicationItemsResponseMock: ApplicationItemsResponse = {
  items: [
    {
      "id": "101",
      "name": "Reconciliation Application 1",
      "description": "Reconciliation application description"
    },
    {
      "id": "103",
      "name": "Reconciliation Application 3",
      "description": "Reconciliation application description"
    }
  ],
  totalCount: 2
};

export const applicationDataMock: Application =
{
  id: 'APP100001',
  name: 'Application for Dos Installation',
  description: 'Installation of Feature Pack 1-0-1 need to be install on Job: JD10001',
};

export const inputConfigurationsItemsResponsesMock = {
  items: [{
    id: "1234",
    name: "name",
    description: "description"
  }],
  totalCount: 1
};

export const inputConfigDetailsMockData: InputConfigurationDetails = {
  id: "31",
  name: "pre-set inputs",
  description: "inputs for job definition",
  inputs: [
    { name: "input1", value: "value1" },
    { name: "input2", value: "value2" },
    { name: "input3", pickList: ["value3", "value4", "value5"] },
  ]
};

export const payloadDeleteFeatureMock = {
  id: '12345',
  name: 'feature-12345'
};

export const queryMock: QueryParams = {
  offset: 10,
  limit: 20
};
