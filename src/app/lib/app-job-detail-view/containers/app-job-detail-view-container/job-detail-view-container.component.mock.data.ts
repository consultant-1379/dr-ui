import { ActionFilterStatus } from "src/app/models/enums/action-filter-status.enum";
import { DiscoveredObjects } from "src/app/models/discovered-objects.model";
import { DiscoveredObjectsStatus } from "src/app/models/enums/discovered-objects-status.enum";
import { Job } from "src/app/models/job.model";
import { JobStatus } from "src/app/models/enums/job-status.enum";

export const jobDetailMock : Job = {
    "id": "12345",
    "name": "job 1-0",
    "description": "description of job",
    "featurePackId": "1",
    "featurePackName": "feature pack 1-0-xx",
    "applicationId": "101",
    "applicationName": "my-application-name",
    "applicationJobName": "job1-definition",
    "startDate": "2023-05-12T16:12:54Z",
    "completedDate": "2023-05-12T16:34:12Z",
    "status": JobStatus.NEW,
    "inputs": {
      "jobProp1": "value1",
      "jobProp2": "value2",
      "jobProp3": "value3"
    },
    "discoveredObjectsCount": 4,
    "reconciledObjectsCount": 10,
    "reconciledObjectsErrorCount": 2,
    "errorMessage": "some error message"
};

export const discoveredObjectMock : DiscoveredObjects =  {
    objectId: '1',
    discrepancies: [
      'Missing in ecm'
    ],
  properties: {
    flavorName: 'ECM_CORE',
    ephemeralDiskSize: '0',
    diskSize: '64',
    isPublic: 'false',
    numberOfCPU: '4',
    ramMemorySize: '12288',
    assignedObjectId: '1',
    receivedTransmitFactor: '1.0',
    name: 'object1',
    'target.prop2': 1,
    'target.prop1': 'value1',
    'source.prop1': 'value1',
    id: '55',
    'source.prop2': 1
  },
    filters: [
      {
        name: 'filter one',
        reconcileAction: {
          status: ActionFilterStatus.FAILED,
          command: 'Method: POST',
          commandOutput: 'command output message',
          errorMessage: 'DR-20:Execution step.'
        }
      }
    ],
    errorMessage: 'some outer error message',
    status: DiscoveredObjectsStatus.RECONCILED
  };