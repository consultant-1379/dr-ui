import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { InputConfigValue, InputConfigurationDetails } from 'src/app/models/input-configuration-details.model';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { filter, skip } from 'rxjs';

import { ButtonMode } from '@erad/components/button';
import { CreateJobProcessingService } from 'src/app/lib/create-job/services/create-job-processing.service';
import { DisplayOrientation } from 'src/app/enums/information-display-mode';
import { DropdownOption } from 'src/app/models/dropdown-option.model';
import { DynamicInputsDisplayComponent } from '../dynamic-inputs-display/dynamic-inputs-display.component';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { FeaturePackFacadeService } from 'src/app/lib/feature-packs/services/feature-packs-facade.service';
import { InputConfigDetailsFacadeService } from 'src/app/lib/input-configuration-details/service/input-configuration-details-facade.service';
import { InputConfigsFacadeService } from 'src/app/lib/input-configurations/services/input-configurations-facade.service';
import { InputData } from 'src/app/models/input-data.model';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { Router } from '@angular/router';
import { RoutingPathContent } from 'src/app/enums/routing-path-content.enum';
import { TranslateService } from '@ngx-translate/core';
import { ViewStyle } from '@erad/components/common';
import { validateSafeInput } from 'src/app/utils/validator.utils';
import { validationConstants } from 'src/app/constants/app.constants';

/**
 * Create job component for creating a job from a feature pack
 * (either  with preselected dropdown selections when launched in context,
 * or globally with no preselected dropdown selections)
 *
 * @example
 *  <dnr-create-job
 *      [nextPagePath]="nextPagePath"
 *      [preSelectedFeaturePackId]="preSelected FeaturePack id"
 *      [preSelectedApplicationId]="preSelected Application id"
 *      (cancelClicked)="onCancel()"
 *  ></dnr-create-job>
 */
@Component({
  selector: 'dnr-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.scss'],
})
@UnsubscribeAware()
export class CreateJobComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('discoveryInputs') discoveryInputsDisplay: DynamicInputsDisplayComponent;
  @ViewChild('reconcileInputs') reconcileInputsDisplay: DynamicInputsDisplayComponent;

  /**
   * Next page to enter after clicking the "Create" button
   * e.g. RoutingPathContent.JobDetail always for create job
   */
  @Input() nextPagePath: string = RoutingPathContent.JobDetail

  /**
   * Preselected feature pack. I.e. create job opens with this FP selected.
   */
  @Input() preSelectedFeaturePackId?: string;

  /**
   * Preselected application. I.e. create job opens with this application selected.
   */
  @Input() preSelectedApplicationId?: string;

  /**
   * Default vertical (side panel use)
   * Change orientation of the display
   */
  @Input() displayOrientation?: DisplayOrientation = DisplayOrientation.vertical;

  /**
   * True to hide the cancel and create buttons in the footer,
   * e.g. for use when taking in this component as part of another component
   * that owns its own buttons
   */
  @Input() hideCancelCreateButtons: boolean = false;

  /**
   * Event emitted when the cancel button is clicked
   * (e.g. when in a flyout, you show close the flyout,
   * when on create jobs page, return to the previous page )
   */
  @Output() cancelClicked = new EventEmitter<void>();

  buttonMode = ButtonMode;
  configInputValues: InputConfigValue[] = []; // TODO used like an input, but not really an input?
  viewStyle = ViewStyle.Bordered;
  verticalLayout = DisplayOrientation.vertical;
  safeStringPattern: string = validationConstants.safeStringPattern;
  invalidInputChars: string = validationConstants.invalidInputCharDisplay;
  maxShortCharLength: number = validationConstants.maxShortCharLength;
  maxLargeCharLength: number = validationConstants.maxLargeCharLength;

  isNameFieldValid: boolean = false;
  isDescriptionFieldValid: boolean = true; /* default true as not required */

  jobNameValue: string = '';
  jobDescriptionValue: string = '';

  featurePackOptions: DropdownOption[] = [];
  featurePackSelected?: DropdownOption;

  applicationOptions: DropdownOption[] = [];
  applicationSelected?: DropdownOption;

  inputConfigOptions: DropdownOption[] = [];

  featurePacksLoading: boolean;
  applicationsLoading: boolean;
  createJobLoading: boolean;
  inputConfigLoading: boolean;

  autoReconcile: boolean = false; // Automatically reconcile job after discovery
  appJobNameSelected: DropdownOption;
  inputConfigSelected: DropdownOption;
  jobDefNameToDiscoverInputsMap: Map<string, InputData[]> = new Map<string, InputData[]>();
  appDiscoverInputs: InputData[] = [];
  appReconcileInputs: InputData[] = [];

  /* dropdowns do not have a placeholder option, so adding one to data when ready to select */
  selectDropDownPlaceholder: DropdownOption = { value: null, label: this.translateService.instant('SELECT') };

  constructor( // NOSONAR Constructor has too many parameters (10). Maximum allowed is 7
    readonly featurePackDetailsFacadeService: FeaturePackDetailsFacadeService,
    readonly featurePacksFacadeService: FeaturePackFacadeService,
    readonly inputConfigsFacadeService: InputConfigsFacadeService,
    readonly inputConfigDetailsFacadeService: InputConfigDetailsFacadeService,
    readonly jobDetailsFacadeService: JobDetailsFacadeService,
    readonly router: Router,
    readonly notificationV2Service: NotificationV2Service,
    readonly translateService: TranslateService,
    readonly createJobProcessingService?: CreateJobProcessingService
  ) { }

  ngOnInit(): void {
    this._subscribeToAllFeaturePacks();
    this._subscribeToFeaturePackDetails();
    this._subscribeToInputConfigs();
    this._subscribeToInputConfigDetails();
    this._updateForContextParams();
  }

  ngAfterViewInit(): void {
    this._loadFeatureAllPacks();
    if (this.preSelectedFeaturePackId) {
      this.featurePackDetailsFacadeService.loadDetails(this.preSelectedFeaturePackId);
      this.inputConfigsFacadeService.loadInputConfigurations(this.preSelectedFeaturePackId);
    }
  }

  ngOnDestroy() {
    this.resetAllSelections(); // can't do any harm
  }

  resetAllSelections(): void {
    /* note don't clear jobNameValue or jobDescriptionValue as this is
      called from FP dropdown change */
    this.featurePackSelected = null;
    this.applicationSelected = null;
    this.inputConfigSelected = null;
    this.appJobNameSelected = null;
    this.applicationOptions = [];
    this.inputConfigOptions = [];
    this.configInputValues = [];
    this.appDiscoverInputs = [];
    this.appReconcileInputs = [];
  }

  shouldDisableButton() {
    return !this._isValid()
      || this.applicationsLoading  /* also covers job definitions loading as in application call */
      || this.createJobLoading
      || this.featurePacksLoading
      || this.inputConfigLoading;
  }

  /**
   * When the feature pack dropdown selection changes,
   * @param event event with value containing DropDown object with value and label
   */
  onFeaturePackOptionChange(event: any) {
    const eventValue = event.value;
    if (eventValue) {
      const id = eventValue.value;
      // Ignore FP changes to other feature pack when preSelected FP set
      // as applicationSelected / featurePackSelected should remain unchanged.
      if (this.preSelectedFeaturePackId && this.preSelectedFeaturePackId !== id) {
        return;
      }

      this.resetAllSelections();
      this.featurePackOptions = this._removePlaceholder(this.featurePackOptions);

      /* application is now ready for selection */
      this.applicationSelected = this.selectDropDownPlaceholder;
      this.featurePackSelected = eventValue;
      this.featurePackDetailsFacadeService.loadDetails(id);

      /* input configs applicable for feature pack only */
      this.inputConfigsFacadeService.loadInputConfigurations(id);
    }
  }

  onApplicationsOptionChange(event: any) {
    const eventValue = event.value;
    if (eventValue) {
      this.applicationOptions = this._removePlaceholder(this.applicationOptions);
      this.applicationSelected = eventValue;

      /* jobs now ready for selection */
      this.appJobNameSelected = this.selectDropDownPlaceholder;
      this.appDiscoverInputs = [];
      this.appReconcileInputs = [];
      // No need to loadApplicationDetails here as the job dropdown does it itself.
    }
  }

  /**
   * Handle job definition change selection
   * Job definition change can now mean an existing input config selected is now valid for job selection.
   *
   * @param eventValue  contains selected job definition dropdown option
   *                    and discovered/reconcile inputs associated with the selection
   */
  onJobDefinitionsChange(eventValue: { selectedDropdown: DropdownOption, discoverInputs: InputData[], reconcileInputs: InputData[] }) {
    this.appJobNameSelected = eventValue.selectedDropdown;
    this.appDiscoverInputs = eventValue.discoverInputs;
    this.appReconcileInputs = eventValue.reconcileInputs;

    if (this.isDropdownSelected(this.inputConfigSelected)) {
      this.onInputConfigChange({ value: { ...this.inputConfigSelected } });
    } else {
      /* ready to select input config */
      this.inputConfigSelected = this.selectDropDownPlaceholder;
    }
  }

  onInputConfigChange(event: any) {
    const eventValue = event.value;
    if (eventValue) {
      this.inputConfigOptions = this._removePlaceholder(this.inputConfigOptions);
      this.inputConfigSelected = eventValue;
      this.inputConfigDetailsFacadeService.loadInputConfigDetails(
        this.featurePackSelected.value, this.inputConfigSelected.value);
    }
  }

  /**
   * Create call - generate specific payload for create job
   * (not used or subscribed to when hideCancelCreateButtons is true)
   */
  onCreate() {
    this.jobDetailsFacadeService.clearFailureState();
    this._subscribeToJobServices();
    this.jobDetailsFacadeService.createJob(this.getJobSpecification());
  }

  /**
   * Get job specification object for create job
   * (or job schedule when use this component in CreateScheduleComponent)
   *
   * @returns  Job specification in format required for POST payload
   */
  getJobSpecification() {
    const discoveryInputs = this.discoveryInputsDisplay?.getFormValues();
    const reconcileInputs = this.reconcileInputsDisplay?.getFormValues();
    const inputs = { ...discoveryInputs, ...reconcileInputs };

    return {
      name: this.jobNameValue,
      description: this.jobDescriptionValue,
      featurePackId: this.featurePackSelected?.value,
      featurePackName: this.featurePackSelected?.label,
      applicationId: this.applicationSelected?.value,
      applicationName: this.applicationSelected?.label,
      applicationJobName: this.appJobNameSelected?.value,
      inputs: inputs,
      executionOptions: { autoReconcile: this.autoReconcile }
    };
  }

  /**
   * Check if anything changed on the form inputs
   * (to show a confirm leave page dialog should that be the case)
   * @returns  true if page is not pristine (dirty)
   */
  isDirty(): boolean {
    // TODO - Once you will use the ngForm, form.dirty, form.pristine, form.touched, form.valid() properties are prebuilt (maybe can use)
    return !!(this.jobNameValue ||
      this.jobDescriptionValue ||
      (this.featurePackSelected?.value && this.featurePackSelected.value !== this.preSelectedFeaturePackId) ||
      (this.applicationSelected?.value && this.applicationSelected.value !== this.preSelectedApplicationId )||
      this.appJobNameSelected?.value);  // not checking  dynamicInputsDisplay if changed above you will load dynamic inputs
  }

  /**
   * Depending on whether component is in a flyout (feature flow),
   * or in a page (jobs flow), the cancel button will have different functions
   */
  onCancel() {
    this.createJobProcessingService.onCancel(true);
  }

  onNameChangedText(value: any) {
    this.isNameFieldValid = value.target.checkValidity();
    this.jobNameValue = value.target.value;
  }

  // ERAD not validating multi-line text input
  onDescriptionChangedText(value: any) {
    this.isDescriptionFieldValid = validateSafeInput(value.target.value);
    this.jobDescriptionValue = value.target.value;
  }

  /* access for unit test */
  _updateForContextParams(): void {
    if ((this.preSelectedFeaturePackId && !this.preSelectedApplicationId ) || (!this.preSelectedFeaturePackId && this.preSelectedApplicationId)) {
      throw new Error(`Internal UI Error: CreateJobComponents created with "featurePackSelected" or "applicationOptionSelected" inputs, would require both inputs not just one as we want to pre-populate both dropdowns when launching contextually`);
    }

    const appPreSelected = this.applicationSelected; // avoid reset if initial application value
    this.onFeaturePackOptionChange({ value: this.featurePackSelected });
    this.onApplicationsOptionChange({ value: appPreSelected });
  }

  _isValid(): boolean {
    return this.discoveryInputsDisplay?.isFormValid()
      && (!this.autoReconcile || this.appReconcileInputs.length == 0 || this.reconcileInputsDisplay?.isFormValid())
      && this.isNameFieldValid
      && this.isDescriptionFieldValid
      && this.isDropdownSelected(this.featurePackSelected)
      && this.isDropdownSelected(this.applicationSelected)
      && this.isDropdownSelected(this.appJobNameSelected);
  }

  private isDropdownSelected(dropdown: DropdownOption): boolean {
    return !!dropdown && dropdown.value !== null;  // "Select" placeholder value is null
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

  /* access for unit test */
  _loadFeatureAllPacks(): void {
    this.featurePacksFacadeService.loadAllFeaturePacks();
  }

  /* access for unit test */
  _subscribeToAllFeaturePacks(): void {
    this.featurePacksFacadeService
      .getAllFeaturePacks()
      .pipe(
        filter(fps => fps?.length > 0),
        takeUntilDestroyed(this))
      .subscribe((dropDownOptions) => {
        this.featurePackOptions = dropDownOptions;
        if (!this.isDropdownSelected(this.featurePackSelected)) {  // contextual launch case
          this.featurePackOptions = [this.selectDropDownPlaceholder, ...this.featurePackOptions];
          if (this.preSelectedFeaturePackId) {
            this.featurePackSelected = this.featurePackOptions.find((fp) => fp.value === this.preSelectedFeaturePackId);
          }
        }
      });

    this.featurePacksFacadeService
      .getAllFeaturePacksLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((allLoading) => {
        this.featurePacksLoading = allLoading;
      });

    this.featurePacksFacadeService
      .getAllFeaturePacksFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((dnrFailure) => {
        if (dnrFailure && this.featurePackSelected) {
          /* fallback have the pre-selected item in dropdown
            (failure notification should already be shown for get all feature packs failure) */
          this.featurePackOptions = [this.featurePackSelected];
        }
      });
  }

  /* access for unit test */
  _subscribeToFeaturePackDetails(): void {
    this.featurePackDetailsFacadeService.clearFailureState();
    this.featurePackDetailsFacadeService
      .getFeaturePackDetails()
      .pipe(
        filter(featurePackDetails => !!featurePackDetails),
        takeUntilDestroyed(this))
      .subscribe((featurePackDetails) => {
        // If preselected FP, then ignore changes to different FPs.
        if (this.preSelectedFeaturePackId && this.preSelectedFeaturePackId !== featurePackDetails.id) {
          return;
        }
        const applications = featurePackDetails?.applications;
        this.applicationOptions = applications?.map((application) => ({
          value: application.id,
          label: application.name,
          description: application.description
        }));

        if (this.preSelectedApplicationId) {
          this.applicationSelected = this.applicationOptions.find((app) => app.value === this.preSelectedApplicationId);
        }

        if (!this.isDropdownSelected(this.applicationSelected)) {  // contextual launch case
          this.applicationOptions = [this.selectDropDownPlaceholder, ...this.applicationOptions];
        }
      });

    this.featurePackDetailsFacadeService
      .getFeaturePackDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.applicationsLoading = loading;
      });

    this.featurePackDetailsFacadeService
      .getFeaturePackDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure) => {
        /* fallback (failure notification should already be shown for details call failure) */
        if (failure && this.applicationSelected) {
          this.applicationOptions = [this.applicationSelected];
        }
      });
  }

  /* access for unit test */
  _subscribeToInputConfigs(): void {
    this.inputConfigsFacadeService
      .getInputConfigurations()
      .pipe(takeUntilDestroyed(this))
      .subscribe((inputConfigs) => {
        if (inputConfigs && inputConfigs.length > 0) {
          this.inputConfigOptions = [this.selectDropDownPlaceholder, ...inputConfigs?.map((inputConfig) => ({
            value: inputConfig.id,
            label: inputConfig.name,
            description: inputConfig.description
          }))];
        }
      });

    this.inputConfigsFacadeService
      .getInputConfigurationsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.inputConfigLoading = loading;
      });
  }

  /* access for unit test */
  _subscribeToInputConfigDetails(): void {

    this.inputConfigDetailsFacadeService.clearFailureState();

    this.inputConfigDetailsFacadeService
      .getInputConfigDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((inputConfigDetails: InputConfigurationDetails) => {
        const configInputValues = inputConfigDetails?.inputs;
        if (configInputValues) {
          this.configInputValues = configInputValues;
        }
      });
  }

  /* use in child class */
  _subscribeToJobServices(callback?: Function): void {
    this.jobDetailsFacadeService
      .getJobId()
      .pipe(
        skip(1),
        takeUntilDestroyed(this))
      .subscribe((id) => {
        if (callback) {
          callback(id);
        }
        if (!!id) {
          // navigate to Job detail page (discovered objects)
          this.router.navigate(
            [this.nextPagePath],
            { queryParams: { id, linkAwaySection: 'OBJECTS' } });
          this._showSuccessCreateJobNotification(id);
        }
      });

    this.jobDetailsFacadeService
      .getJobDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.createJobLoading = loading;
      });
  }

  /* expose for junit */
  _showSuccessCreateJobNotification(jobId: string) {
    this.notificationV2Service.success({
      title: this.translateService.instant('createJob.TITLE'),
      description: this.translateService.instant('messages.JOB_CREATED_SUCCESS', { id: jobId }),
    });
  }

  autoReconcileHandler(event: boolean) {
    this.autoReconcile = event;
  }
}
