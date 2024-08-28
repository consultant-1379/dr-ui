import { JobStatus } from "./enums/job-status.enum";
import { ExecutionJob } from "./execute-job.model";

export interface Job extends ExecutionJob {
  id?: string;
  startDate?: string;
  completedDate?: string;
  status?: JobStatus;
  jobScheduleId?: string;
  discoveredObjectsCount?: number;
  reconciledObjectsCount?: number;
  reconciledObjectsErrorCount?: number;
  errorMessage?: string;
}
