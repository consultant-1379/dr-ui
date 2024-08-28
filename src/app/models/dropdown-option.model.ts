/**
 * Options for select dropdowns
 * (erad dropdown component)
 */
export interface DropdownOption {
  value: string;  // typically the id
  label: string;
  description?: string;  // if present can use a tooltip on selected item
}
