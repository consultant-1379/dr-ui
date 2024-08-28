import { CollapsibleItem } from '@erad/components/collapsible-item';

export const ScheduleDetailsConfig: {  [x: string]: CollapsibleItem[] } = {
  selectableItems: [
    {
      id: "GENERAL_INFORMATION",
      selectionEnabled: false,
      showNavigationIcon: false,
      selected: false,
      expanded: true,
      title: 'itemInformationDetails.GENERAL_INFORMATION',
      inactiveSvgPath: './assets/icons/info.svg',
      activeSvgPath: './assets/icons/info__white.svg',
    },
    {
      id: "INPUTS",
      selectionEnabled: false,
      showNavigationIcon: false,
      selected: false,
      title: 'itemInformationDetails.INPUTS',
      inactiveSvgPath: './assets/icons/input.svg',
      activeSvgPath: './assets/icons/input.svg',
    },
    {
      id: "RECENT_EXECUTIONS",
      selectionEnabled: false,
      showNavigationIcon: false,
      selected: false,
      title: 'itemInformationDetails.RECENT_EXECUTIONS',
      inactiveSvgPath: './assets/icons/view-list.svg',
      activeSvgPath: './assets/icons/view-list.svg',
    },
  ],
};
