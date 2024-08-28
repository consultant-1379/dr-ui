import { JobScheduleSummary } from "./job-schedule-summary.model";

export interface JobScheduleItemsResponse {
  items: JobScheduleSummary[];
  totalCount: number;
}
