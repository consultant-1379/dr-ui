import { Application } from "src/app/models/application.model";
import { FeaturePackDetailsResponse } from "src/app/models/feature-pack-details-response.model";

export const applicationDataMock: Application[] = [
    {
        id: 'APP100001',
        name: 'Application for Dos Installation',
        description: 'Installation of Feature Pack 1-0-1 need to be install on Job: JD10001',
    },
    {
        id: 'APP100002',
        name: 'Application for Windows Installation',
        description: 'Installation of Feature Pack 1-0-1 need to be install on Job: JD10002',
    },
];

export const mockFeaturePack: FeaturePackDetailsResponse = {
  id: 'id1',
  name: 'name1',
  description: 'desc1',
  createdAt: '123',
  modifiedAt: '456',
  applications: applicationDataMock,
  inputs: [],
  assets: [{name: "asset1", id: "assetId1", description: "assetDesc"}],
  listeners: []
};