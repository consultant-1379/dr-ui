import { ExecutionJob } from "./execute-job.model";

export interface JobScheduleCreateData {
  name?: string,
  description?: string,
  expression?: string,
  jobSpecification?: ExecutionJob;
}