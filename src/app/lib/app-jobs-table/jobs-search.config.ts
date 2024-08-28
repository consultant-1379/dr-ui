import { AdvanceSearchFormField } from "@erad/components";

export const JobSearchFields: AdvanceSearchFormField[] = [
  {
    label: 'job.NAME',
    type: 'string',
    key: 'name',
  },
  {
    label: 'job.ID',
    type: 'number',
    key: 'id',
  },
  {
    label: 'job.STATUS',
    type: 'string',
    key: 'status',
    fieldOptions: [
      {
        key: 'ALL',
        value: undefined,
      },
      {
        key: 'state.NEW',
        value: 'NEW',
      },
      {
        key: 'state.DISCOVERY_INPROGRESS',
        value: 'DISCOVERY_INPROGRESS',
      },
      {
        key: 'state.DISCOVERED',
        value: 'DISCOVERED',
      },
      {
        key: 'state.DISCOVERY_FAILED',
        value: 'DISCOVERY_FAILED',
      },
      {
        key: 'state.RECONCILE_REQUESTED',
        value: 'RECONCILE_REQUESTED',
      },
      {
        key: 'state.RECONCILE_INPROGRESS',
        value: 'RECONCILE_INPROGRESS',
      },
      {
        key: 'state.PARTIALLY_RECONCILED',
        value: 'PARTIALLY_RECONCILED',
      },
      {
        key: 'state.COMPLETED',
        value: 'COMPLETED',
      },
    ]
  },
  {
    label: 'job.DESCRIPTION',
    type: 'string',
    key: 'description',
  },
  {
    label: 'featurePack.FP_NAME',
    type: 'string',
    key: 'featurePackName',
  },
  {
    label: 'featurePack.ID',
    type: 'number',
    key: 'featurePackId',
  },
  {
    label: 'job.APPLICATION',
    type: 'string',
    key: 'applicationName',
  },
  {
    label: 'job.APPLICATION_ID',
    type: 'number',
    key: 'applicationId',
  },
  {
    label: 'job.JOB_DEFINITION',
    type: 'string',
    key: 'applicationJobName',
  },
  {
    label: 'job.SCHEDULE_ID',
    type: 'number',
    key: 'jobScheduleId',
  }
]