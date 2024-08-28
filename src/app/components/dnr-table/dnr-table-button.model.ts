export interface DnrTableActionItem {
  label: string;
  id: string;  // required for playwright test locator
  handler?: Function;
  icon?: string;
  allowForStatus?: Array<string>
}
