export interface IconButtonAction {
  name: string | any;
  id: string; /* id is used as playwright test locator */
  actionHandler?: Function;
  altAttr?: string;
  tooltip?: string;
  disabled?: string;
  iconPath?: string;
}
