import { ExecutionJob } from "./execute-job.model";

// This is the currently same as job-schedule-summary
// BUT left in as they will likely vary in future
// (the model names here match the names in the dr-service API
// which has 2 separate Dtos for jobScheduleDto and JobScheduleSummaryDto)
export interface JobSchedule {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  expression?: string;
  enabled: boolean;
  jobSpecification: ExecutionJob;
}