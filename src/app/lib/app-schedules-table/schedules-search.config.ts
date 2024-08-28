import { AdvanceSearchFormField } from "@erad/components";

export const ScheduleSearchFields: AdvanceSearchFormField[] = [
  {
    label: 'schedule.NAME',
    type: 'string',
    key: 'name',
  },
  {
    label: 'schedule.ID',
    type: 'number',
    key: 'id',
  },
  {
    label: 'schedule.DESCRIPTION',
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
  }
]