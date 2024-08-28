import { AppConstants } from "../constants/app.constants";
import { CollapsibleItem } from "@erad/components/collapsible-item";

/**
 * This is common Util file to keep common util functions
 */


export function updateBadgeCount(items: CollapsibleItem[], itemCount: number, title: string): CollapsibleItem[] {
  const index = items.findIndex(item => item.title === title);
  const updatedItem = {
    ...items[index],
    badgeText: itemCount
  };
  const updatedItems = [...items];
  updatedItems.splice(index, 1, updatedItem);
  return updatedItems;
}


/**
 * ERAD ConfirmationDialogComponent  does not offer
 * red color options for destructive buttons (delete, uninstall)
 * (i.e. changing primary button from blue to red)
 *
 * @see custom-classes.scss  (includes extra primary check there)
 */
export function setConfirmDialogPrimaryButtonToRed() {
  const dialogButtons = document.querySelectorAll('erad-button');
  if (dialogButtons?.length === 2) {
    const destructiveButton = document.querySelectorAll('erad-button')[1] // always the second button
    destructiveButton.classList.add('destructive');
    destructiveButton.id = 'primary-dialog-button-id'; // for dictionary independent playwright testing
  }
}

/**
 * Replace empty string or undefined item with AppConstants.undefinedDisplayValue
 * @param value  value
 * @returns      value to display
 */
export function getDisplayValue(value: any) {
  return typeof value !== 'undefined' && value !== '' ? value : AppConstants.undefinedDisplayValue;
}