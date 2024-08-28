import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { DisplayOrientation } from 'src/app/enums/information-display-mode';
import { DropdownOption } from 'src/app/models/dropdown-option.model';
import { InputConfigValue } from 'src/app/models/input-configuration-details.model';
import { InputData } from 'src/app/models/input-data.model';
import { TranslateService } from '@ngx-translate/core';
import { ViewStyle } from '@erad/components';
import { validationConstants } from 'src/app/constants';

/**
 * Class to display the inputs that user needs to
 * provide in a dynamic way
 * e.g. for create job inputs
 *
 * <dnr-dynamic-inputs-display
 *    [inputDataArray]="appDiscoverInputs"
 *    [preloadedValues]="preloadedValues"
 *    [displayOrientation]="displayOrientation" // default is vertical anyway
 *  ></dnr-dynamic-inputs-display>
 */

@Component({
  selector: 'dnr-dynamic-inputs-display',
  templateUrl: './dynamic-inputs-display.component.html',
  styleUrls: ['./dynamic-inputs-display.component.scss']
})
export class DynamicInputsDisplayComponent implements OnChanges {

  /**
   * Default vertical (side panel use)
   * Change orientation of the display
   */
  @Input() displayOrientation?: DisplayOrientation = DisplayOrientation.vertical;

  /**
  * Preloaded input configuration values (e.g. based on Feature pack selection)
  *
  * If names provided here match the names of the inputs in
  * inputDataArray then that value will be preloaded.
  *
  * "pickList" can be present in place of "value"
  * will be used to populate the dropdowns
  * @see InputConfigValue
  */
  @Input() preloadedValues?: InputConfigValue[] = [];

  /**
   * dynamic inputs to display
   */
  @Input() inputDataArray: InputData[] = [];

  formData: any = {};

  horizontalLayout = DisplayOrientation.horizontal;
  viewStyle = ViewStyle.Bordered;
  safeStringPattern: string = validationConstants.safeStringPattern;
  invalidInputChars: string = validationConstants.invalidInputCharDisplay;

  /* dropdowns do not have a placeholder option, so adding one to data when ready to select */
  selectDropDownPlaceholder: DropdownOption = { value: null, label: this.translateService.instant('SELECT'),};

  /**
   * cache the dropdown options for each input name
   * to avoid repeat calls (crash) when call from the template
   */
  dropdownsForNameCache = {};

  constructor(
     readonly translateService: TranslateService,
  ) {}


  /**
   * Method to get the form values as
   * a key value pair object
   */
  public getFormValues(): any {
    return { ...this.formData }
  }

  public isFormValid(): boolean {
    return this.inputDataArray.every((inputData: InputData) => {
      const requiredCheckPass = inputData.mandatory ? !!this.formData[inputData.name] : true;
      if (requiredCheckPass) {
        return `${this.formData[inputData.name]}`.match(validationConstants.safeStringPattern);
      }
      return requiredCheckPass;
    });
  }

  /**
  *  Handle external updates to the form data
  */
  ngOnChanges(changes: SimpleChanges) {
    if (changes?.inputDataArray?.currentValue?.length === 0) {
      /* e.g. feature pack change - clean out any cached values */
      this._clearExistingValues();

    } else if (changes.preloadedValues) {
      this._clearExistingValues();
      this._prePopulateFormValues(changes.preloadedValues.currentValue);
    }
  }

  _clearExistingValues(): void {
    this.formData = {};
    this.dropdownsForNameCache = {};
  }

  _prePopulateFormValues(inputValues: InputConfigValue[]) {
    if (inputValues) {
      const formNames: string[] = this.inputDataArray.map((inputData: InputData) => inputData.name);

      inputValues.forEach((inputValue: InputConfigValue) => {
        if (formNames.includes(inputValue.name)) {
          if (inputValue.hasOwnProperty('value')) {
            this.formData[inputValue.name] = inputValue.value;

          } else if (inputValue.hasOwnProperty('pickList')) {

            if (inputValue.pickList.length > 0) {
              this.formData[inputValue.name] = null; // let it say Select
            }
          }
        }
      });
    }
  }

  onDropDownOptionChange(event: any, inputData: InputData) {

    this.formData[inputData.name] = event.value.value;
    this.dropdownsForNameCache[inputData.name] = this._removePlaceholder(this.dropdownsForNameCache[inputData.name]);
  }

  hasPickListValues(inputData: InputData): boolean {
    if (this.preloadedValues) {
      const preloadedValue = this.preloadedValues.find((inputValue: InputConfigValue) => inputValue.name === inputData.name);
      return (preloadedValue && preloadedValue.hasOwnProperty('pickList'));
    }
    return false; // default to text input
  }

  createDropDownOptions(inputData: InputData): DropdownOption[] {

    // called from the template so we need to stop continuous calls by using cache
    if (this.dropdownsForNameCache[inputData.name]) {
      return this.dropdownsForNameCache[inputData.name];
    }

    const dropdownOptions: DropdownOption[] = [this.selectDropDownPlaceholder];
    if (this.preloadedValues) {
      const preloadedValue = this.preloadedValues.find((inputValue: InputConfigValue) => inputValue.name === inputData.name);

      if (preloadedValue && preloadedValue.hasOwnProperty('pickList')) {
        preloadedValue.pickList.forEach((pickListItem: any) => {
          dropdownOptions.push({
            label: pickListItem,
            value: pickListItem
          }
          );
        });
      }
    }
    this.dropdownsForNameCache[inputData.name] = dropdownOptions;
    return dropdownOptions
  }

  /**
   * Use to remove dropdown (Select) placeholder option
   * as soon as one option is selected
   * @param options  current dropdown options
   * @returns        options with placeholder removed
   */
  _removePlaceholder(options: DropdownOption[]): DropdownOption[] {
    return options.filter((option) => option.value !== null);
  }

}