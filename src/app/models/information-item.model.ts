
/**
 * Model for information item, e.g. for use in a panel to display
 * key value pairs
 */
export interface InformationItemModel {

  /**
   * pre-translated label to be displayed
   * @example 'Feature pack name'
   */
  label: string;

  /**
   * value to be displayed
   */
  value?: string;

  /**
   * flag to indicate if the value is a date
   */
  isDate?: boolean;

  /**
   * Tooltip messages for this value
   */
  tooltip?: string;

  /**
   * flag to indicate if this value is a hyperlink
   */
  hyperlink?: boolean;

  /**
   * flag to indicate if this value CSS should be bold
   */
  isBold?: boolean;

  /**
   * Selector when display a component
   * in place of text (e.g. dnr-enable-switch).
   * (Using selector as a Directive with dot notation)
   */
  componentSelectorName?: string;
}
