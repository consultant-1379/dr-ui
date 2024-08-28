import { Application } from "src/app/models/application.model";
import { FeaturePack } from "src/app/models/feature-pack.model";

export const featurePackMock: FeaturePack = {
  id: '691fd10c-ff9b-11ed-be56-0242ac120002',
  'name': 'Feature pack 1-0',
  'description': 'Description of feature pack',
  'createdAt': '2023-05-12T16:12:54Z',
  'modifiedAt': '2023-05-12T15:15:14Z',
  'applications': [
    {
      'id': '101',
      'name': 'Reconciliation Application 1',
      'description': 'Reconciliation application description'
    },
  ]
};

export const tableActionUninstallMock = [
  featurePackMock,
  'UNINSTALL'
];

export const tableActionUpdateMock = [
  featurePackMock,
  'UPDATE'
];

export const applicationDetailMock: Application = {
  'id': '101',
  'name': 'Reconciliation Application 1',
  'description': 'Reconciliation application description'
};