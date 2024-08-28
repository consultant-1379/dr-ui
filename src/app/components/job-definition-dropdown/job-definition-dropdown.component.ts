import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { AppConstants } from 'src/app/constants/app.constants';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DropdownOption } from 'src/app/models/dropdown-option.model';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { ViewStyle } from '@erad/components';

/**
 * Component populating a dropdown with job definitions names (app job names).
 *
 * Can emit different events on selection change depending on the value of
 * input parameter isFilter, i.e.
 *
 *   - if it is being used to filter the job list, the "All " dropdown option will be added, and
 *     a filterChange event will be emitted on selection change
 *
 *   - if it is being used to populate discover inputs, the "Select" dropdown option will be added as a placeholder, and
 *     a discoverInputsChange event will be emitted on selection change along with the discover input keys associated with the job definition selected
 */
@Component({
  selector: 'dnr-job-definition-dropdown',
  templateUrl: './job-definition-dropdown.component.html',
  styleUrls: ['./job-definition-dropdown.component.scss']
})
@UnsubscribeAware()
export class JobDefinitionDropdownComponent implements OnInit, OnChanges {

  /**
   * Used when isFilter is set (e.g. for job list panel view).
   * Emits the selected dropdown option for selected job definition,
   * which can also have a value AppConstants.allFilterValue
   * when user wants to remove filter on job list (i.e. chooses the "All" option)
   */
  @Output() filterChange = new EventEmitter<MatSelectChange>();

  /**
   * Used when filter is not set (e.g. for Create job functionality)
   * On job definition change, emits the selected dropdown option (job definition)
   * and the discover inputs associated with the job definition selected
   */
  @Output() discoverInputsChange = new EventEmitter<any>();

  viewStyle = ViewStyle.Bordered;
  appJobNameSelected: DropdownOption;
  jobDefNameToDiscoverInputs: Object = {};
  jobDefNameToReconcileInputs: Object = {};
  jobDefinitionOptions: DropdownOption[] = [];
  jobDefinitionsLoading: boolean;

  allDropDownOption: DropdownOption = { value: AppConstants.allFilterValue, label: this.translateService.instant('ALL') };

  /* dropdowns do not have a placeholder option, so adding one to data when ready to select */
  selectDropDownPlaceholder: DropdownOption = { value: null, label: this.translateService.instant('SELECT') };


  /**
   * Where to show required asterisk on label
   * (default false)
   */
  @Input() required: boolean;

  /**
   *  Feature pack id selected
   */
  @Input() featurePackId: string;

  /**
   * Application id selected
   */
  @Input() applicationId: string;

  /**
   * Component being used as a filter
   * Adds an "All" to dropdown options (in place of Select (default),
   * and emits a filterChange event on selection
   */
  @Input() isFilter: boolean = false;


  constructor(
    private readonly applicationFacadeService: ApplicationDetailsFacadeService,
    private readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this._subscribeToApplicationDetails();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes?.applicationId?.currentValue || changes?.featurePackId?.currentValue) && (this.featurePackId && this.applicationId)) {
      this.applicationFacadeService.loadApplicationDetails(this.featurePackId, this.applicationId);
    }
  }

  onSelectionChange(type: MatSelectChange) {
    const selectedDropdown = type.value; // DropdownOption selected

    if (selectedDropdown.value) { /* remove select placeholder unless pressing select itself */
      this.jobDefinitionOptions = this._removePlaceholder(this.jobDefinitionOptions);

      if (this.isFilter) {
        this.filterChange.emit(type);
      } else {
        const jobDefinitionName = selectedDropdown.value; // id and label are the same for job definitions
        const discoverInputs: [] = this.jobDefNameToDiscoverInputs[jobDefinitionName];
        const reconcileInputs: [] = this.jobDefNameToReconcileInputs[jobDefinitionName];
        this.discoverInputsChange.emit({ selectedDropdown, discoverInputs, reconcileInputs });
      }
    }
  }

  private _subscribeToApplicationDetails(): void {
    this.applicationFacadeService.clearFailureState();

    this.applicationFacadeService
      .getApplicationDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((applicationDetails) => {
        const jobs = applicationDetails?.jobs;
        // jobs definitions are the jobs array in application detail response
        if (jobs?.length) {
          jobs.forEach((job) => {
            this.jobDefNameToDiscoverInputs[job.name] = job.discover?.inputs || [];
            this.jobDefNameToReconcileInputs[job.name] = job.reconcile?.inputs || [];
          });

          this.jobDefinitionOptions = jobs.map((job) => ({
            value: job.name,
            label: job.name,
            description: job.description
          }));

          if (this.isFilter) {
            this.jobDefinitionOptions = [this.allDropDownOption, ...this.jobDefinitionOptions];
          } else {
            /* initial value is "Select" ( a placeholder) */
            this.jobDefinitionOptions = [this.selectDropDownPlaceholder, ...this.jobDefinitionOptions];
          }
          this.appJobNameSelected = this.jobDefinitionOptions[0];
        }
      });

    this.applicationFacadeService
      .getApplicationDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.jobDefinitionsLoading = loading;
      });
  }


  /**
 * Use to remove dropdown (Select) placeholder option
 * as soon as one option is selected
 * @param options  current dropdown options
 * @returns        options with placeholder removed
 */
  private _removePlaceholder(options: DropdownOption[]): DropdownOption[] {
    return options.filter((option) => option.value !== null);
  }
}
