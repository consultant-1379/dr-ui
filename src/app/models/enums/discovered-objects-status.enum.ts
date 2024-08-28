/**
 * States corresponding to the backend
 * Discovered Object States
 */
export enum DiscoveredObjectsStatus {
  NEW = 'NEW',
  DISCOVERED = 'DISCOVERED',
  RECONCILING = 'RECONCILING',
  RECONCILE_FAILED = 'RECONCILE_FAILED',
  RECONCILED = 'RECONCILED'
}