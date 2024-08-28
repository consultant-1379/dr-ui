import { CollapsibleItem } from '@erad/components/collapsible-item';

export const FeaturePackPageConfig: {  [x: string]: CollapsibleItem[] } = {
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
      id: "APPLICATIONS",
      selectionEnabled: false,
      showNavigationIcon: true,
      selected: false,
      title: 'itemInformationDetails.APPLICATIONS',
      inactiveSvgPath: './assets/icons/duplicate.svg',
      activeSvgPath: './assets/icons/duplicate_white.svg',
      badgeText: ''
    }
  ],
};
export const FeaturePackDetailsPageConfig: {  [x: string]: CollapsibleItem[] } = {
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
      id: "APPLICATIONS",
      selectionEnabled: false,
      showNavigationIcon: false,
      selected: true,
      expanded: true,
      title: 'itemInformationDetails.APPLICATIONS',
      inactiveSvgPath: './assets/icons/duplicate.svg',
      activeSvgPath: './assets/icons/duplicate_white.svg',
      badgeText: ''
    }
  ],
};