import { CollapsibleItem } from '@erad/components/collapsible-item';

export const JobDetailsConfig: {  [x: string]: CollapsibleItem[] } = {
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
      activeSvgPath: './assets/icons/input_white.svg',
    },
    {
      id: "OBJECTS",
      selectionEnabled: false,
      showNavigationIcon: true,
      selected: false,
      title: 'itemInformationDetails.OBJECTS',
      inactiveSvgPath: './assets/icons/versions.svg',
      activeSvgPath: './assets/icons/versions_white.svg',
    },
  ],
};
