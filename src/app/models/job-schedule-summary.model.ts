import { ExecutionJob } from "./execute-job.model";

export interface JobScheduleSummary {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  expression?: string;
  enabled: boolean;
  jobSpecification: ExecutionJob;
}