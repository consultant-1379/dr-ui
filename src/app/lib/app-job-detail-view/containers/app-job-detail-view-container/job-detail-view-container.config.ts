import { CollapsibleItem } from "@erad/components/collapsible-item";

export const SelectableItems : CollapsibleItem[] = [
  {
    id: "GENERAL_INFORMATION",
    selectionEnabled: false,
    showNavigationIcon: false,
    expanded: true,
    selected: false,
    inactiveSvgPath: './assets/icons/info.svg',
    activeSvgPath: './assets/icons/info__white.svg',
    title: 'itemInformationDetails.GENERAL_INFORMATION',
  },
  {
    id: "FILTER_ACTION_DETAIL",
    selectionEnabled: false,
    showNavigationIcon: false,
    selected: false,
    title: 'itemInformationDetails.FILTER_ACTION_DETAIL',
    inactiveSvgPath: './assets/icons/options.svg',
    activeSvgPath: './assets/icons/options_white.svg',
    badgeText: ''
  }
];

export const ExpandableItems : CollapsibleItem[] = [
  {
    id: "GENERAL_INFORMATION",
    selectionEnabled: false,
    showNavigationIcon: false,
    title: 'itemInformationDetails.GENERAL_INFORMATION',
    inactiveEdsIcon: 'info',
  },
  {
    id: "FILTER_ACTION_DETAIL",
    selectionEnabled: false,
    showNavigationIcon: false,
    expanded: true,
    title: 'itemInformationDetails.FILTER_ACTION_DETAIL',
    inactiveSvgPath: './assets/icons/options.svg',
    activeSvgPath: './assets/icons/options_white.svg',
  }
];