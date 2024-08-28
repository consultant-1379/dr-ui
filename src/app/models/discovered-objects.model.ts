import { ActionFilterStatus } from "./enums/action-filter-status.enum";
import { DiscoveredObjectsStatus } from "./enums/discovered-objects-status.enum";

export interface DiscoveredObjects {
  objectId: string;
  discrepancies: string [],
  properties: object,
  filters?: [
    {
      name: string,
      reconcileAction: {
        status: ActionFilterStatus,
        command: string,
        commandOutput: string,
        errorMessage: string
      }
    }
  ],
  errorMessage?: string,
  status: DiscoveredObjectsStatus
}