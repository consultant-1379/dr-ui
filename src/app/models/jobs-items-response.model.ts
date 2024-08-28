import { Job } from "./job.model";

export interface JobsItemsResponse {
  items: Job[];
  totalCount: number;
}