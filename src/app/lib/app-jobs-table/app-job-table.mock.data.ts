import { Job } from "src/app/models/job.model";
import { JobStatus } from "src/app/models/enums/job-status.enum";

export const jobMock: Job = {
  'id': '12345',
  'name': 'Analyst 1-0',
  'description': 'The Reconciliation Analyst is responsible for researching all missing and unapplied payments and ensuring they are posted to the appropriate account in HMS system',
  'featurePackId': '691fd10c-ff9b-11ed-be56-0242ac120002',
  'featurePackName': 'Feature pack 1-0-XX',
  'applicationId': '101',
  'applicationName': 'Reconciliation Application 1',
  'applicationJobName': 'job1-definition',
  'startDate': '2023-05-12T16:12:54Z',
  'completedDate': '2023-05-12T16:34:12Z',
  'status': JobStatus.DISCOVERY_FAILED
}

export const jobDetailsMock: any = {
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

export const jobDuplicateMock = [
  {
    'id': 'df97e34b-93e9-4193-8569-cdccac2248a5',
    'name': 'Feature pack 1-0-1',
    'description': 'Description of feature pack 1',
    'createdAt': '2023-03-15T15:52:23Z',
    'modifiedAt': '2023-09-27T14:35:31Z'
  },
  'DUPLICATE'
];
