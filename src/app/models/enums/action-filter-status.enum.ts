/**
 * Action state, e.g. states within
 * filters > "reconcileAction" object
 * in a discovered object
 *
 * Note correspond exactly to the backend Action (filter) States
 */
export enum ActionFilterStatus {
  NOT_STARTED = 'NOT_STARTED',
  INPROGRESS = 'INPROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}