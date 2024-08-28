import { generateMockService } from '@erad/utils';
import { JobSchedule } from '../models/job-schedule.model';
import { JobScheduleService } from './job-schedule.service';
import { JobScheduleItemsResponse } from '../models/job-schedule-items-response.model';
import { ExecutionJob } from '../models/execute-job.model';
import { JobScheduleCreateData } from '../models/job-schedule-create.model';

export const jobSpecificationMock: ExecutionJob = {
  name: "exeJob1",
  description: 'Job description test',
  featurePackId: "123",
  featurePackName: "FP1",
  applicationId: "456",
  applicationName: "AP1",
  applicationJobName: "jobName1",
  inputs: { input1: "val1" },
  executionOptions: {autoReconcile: false}
}

export const jobScheduleItemsResponseMock : JobScheduleItemsResponse =
{
  items:
    [Object
      ({
        id: '1',
        name: 'job1',
        description: 'Job schedule description test',
        createdAt: 'Fri Jun 17 2023 11:27:28 GMT+0100',
        expression: 'expression11',
        enabled: true,
        jobSpecification: jobSpecificationMock,
      })],
  totalCount: 1
};

export const jobScheduleDetailsMock: JobSchedule = {
  id: '1',
  name: 'schedule1',
  description: 'Job schedule description test',
  createdAt: 'Fri Jun 17 2023 11:27:28 GMT+0100',
  expression: 'expression11',
  enabled: false,
  jobSpecification: jobSpecificationMock,
};

export const jobScheduleCreateMock: JobScheduleCreateData = {
  name: "schedule1",
  description: "my schedule",
  expression: "1 3 * * *",
  jobSpecification: jobSpecificationMock
}

export const JobScheduleServiceMock =
  generateMockService(JobScheduleService);
