import { FeaturePack } from './feature-pack.model';

export interface FeaturePackItemsResponse {
  items: FeaturePack[];
  totalCount: number;
}
