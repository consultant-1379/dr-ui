import { ExecutionJob } from "../models/execute-job.model";
import { Job } from "../models/job.model";
import { JobReconcileAllData } from "../models/job-reconcile.model";
import { JobsService } from "./jobs.service";
import { generateMockService } from '@erad/utils';

export const jobMock: Job = {
    id: '1',
    name: 'John',
    description: 'Job service description test',
    featurePackId: 'featurePackId_testdata_1',
    applicationId: 'applicationId_testdata_1',
    applicationJobName: 'applicationJobName test',
    startDate: 'Fri Jun 17 2023 11:27:28 GMT+0100',
    status: null
}

export const discoveryJobsList = {
    items: [{
        id: '1',
        name: 'John',
        description: 'Job service description test',
        featurePackId: 'featurePackId_testdata_1',
        applicationId: 'applicationId_testdata_1',
        applicationJobName: 'applicationJobName test',
        startDate: 'Fri Jun 17 2023 11:27:28 GMT+0100',
        status: null
    }],
    totalCount: 1
};

export const payloadCreateJobMock: ExecutionJob = {
    "name": "Test",
    "description": "test Description",
    "featurePackId": "1",
    "applicationId": "101",
    "applicationJobName": "job-definition-unused1",
    "inputs": {

    },
    "executionOptions": {
        "autoReconcile": true
    }
};

export const payloadReconcileMock = {
    "inputs": {
        "reconcileInput1": "reconcileInput1 ",
        "reconcileInput2": "reconcileInput2",
        "reconcileInput3": "reconcileInput3"
    },
    "objects": [
        {
            "objectId": "137"
        }
    ]
};

export const payloadJobReconcileAllDataMock: JobReconcileAllData = {
    "inputs": {
        "reconcileInput1": "reconcileInput1 ",
        "reconcileInput2": "reconcileInput2",
        "reconcileInput3": "reconcileInput3"
    }
}

export const payloadJobReconcileMock = {
    id: '101',
    name: 'job-101'
};

export const payloadDeleteJobMock = {
    id: '12345',
    name: 'job-12345'
};

export const payloadDuplicateJobMock = {
    id: '12345',
};

export const JobsServiceMock =
    generateMockService(JobsService);
