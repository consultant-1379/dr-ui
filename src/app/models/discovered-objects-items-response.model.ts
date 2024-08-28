import { DiscoveredObjects } from "./discovered-objects.model";

export interface DiscoveredObjectsItemsResponse {
  items: DiscoveredObjects [];
  totalCount: number;
}