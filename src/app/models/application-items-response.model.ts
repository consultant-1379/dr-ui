import { Application } from './application.model';
import { QueryParams } from './query.params.model';

export interface ApplicationItemsResponse {
  items: Application[];
  totalCount: number;
}
export interface FeaturePackApplicationPayload {
  featurePackId: string;
  query: QueryParams;
}
