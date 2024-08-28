import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { filter, skip } from 'rxjs';
import { getCronErrorMessage, validateSafeInput } from 'src/app/utils/validator.utils';

import { CreateJobInformationFormComponent } from '../create-job/create-job-information-form/create-job-information-form.component';
import { DisplayOrientation } from 'src/app/enums/information-display-mode';
import { JobScheduleDetailsFacadeService } from 'src/app/lib/job-schedule-details/services/job-schedule-details-facade.service';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';
import { ViewStyle } from '@erad/components/common';
import { validationConstants } from 'src/app/constants/app.constants';

/**
 * Create Schedule Component (similar "pattern" to create-job.component.ts),
 * will allow for the form to be displayed on a larger page screen
 * as opposed to a flyout panel (see create-schedule-form).
 *
 * Note a larger screen will be splitting inputs
 * into two columns - this may prove a saver when ERAD introduces
 * a maximized function to flyout panels, hence keeping the same pattern.
 */
@Component({
  selector: 'dnr-create-schedule',
  templateUrl: './create-schedule.component.html',
  styleUrls: ['./create-schedule.component.scss']
})
@UnsubscribeAware()
export class CreateScheduleComponent implements OnInit, OnDestroy {

  /**
   * Component will reuse the form from CreateJobComponentModule to define
   * a job specification for the schedule
   */
  @ViewChild('createJobInformationForm') createJobInformationForm: CreateJobInformationFormComponent;

  /**
   * Default vertical (side panel use)
   * e.g. could change orientation of the display when not displayed
   * in a flyout panel or expanded (two column view)
   */
  @Input() displayOrientation?: DisplayOrientation = DisplayOrientation.vertical;

  /**
   * Event emitted when the cancel button is clicked
   * (e.g. this component owner could check if this f
   * form is dirty before closing the flyout panel containing this component)
   */
  @Output() cancelClicked = new EventEmitter<void>();


  /**
   * Event emitted when the create returns a 201 success.
   * (e.g. this component owner can refresh the table after closing the
   * flyout panel containing this component)
   */
  @Output() createScheduleSuccess = new EventEmitter<string>();

  createScheduleLoading: boolean;
  failedToCreateJobSchedule: boolean;

  isDescriptionFieldValid: boolean = true; /* true as description is not a required field*/
  isScheduleNameFieldValid: boolean = false;
  isCronExpressionFieldValid: boolean = false;

  viewStyle = ViewStyle.Bordered;
  verticalLayout = DisplayOrientation.vertical;
  safeStringPattern: string = validationConstants.safeStringPattern;
  invalidInputChars: string = validationConstants.invalidInputCharDisplay;
  maxShortCharLength: number = validationConstants.maxShortCharLength;
  maxLargeCharLength: number = validationConstants.maxLargeCharLength;

  scheduleNameValue: string = '';
  scheduleDescriptionValue: string = '';
  cronExpressionValue: string = '';
  cronErrorMessage: string = '';

  constructor(
    readonly jobScheduleDetailsFacadeService: JobScheduleDetailsFacadeService,
    readonly notificationV2Service: NotificationV2Service,
    readonly translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this._subscribeToScheduleServices();
  }

  ngOnDestroy() {
    this.resetAllSelections();
  }

  /**
   * POST call to server on create click
   */
  onCreate(): void {
    this.jobScheduleDetailsFacadeService.clearFailureState();

    this.jobScheduleDetailsFacadeService.createJobSchedule({
      name: this.scheduleNameValue,
      description: this.scheduleDescriptionValue,
      expression: this.cronExpressionValue,
      jobSpecification: this.createJobInformationForm.getJobSpecification()
    });

  }

  /**
   * Cancel caller will need to check if "form" is dirty
   * so as to show a warning message to the user
   * @returns  true if values have been entered into the form
   */
  isDirty(): boolean {
    return !this.createScheduleLoading && !!(this.scheduleNameValue ||
      this.scheduleDescriptionValue ||
      this.cronExpressionValue ||
      (this.createJobInformationForm && this.createJobInformationForm.isDirty())
    );
  }

  shouldDisableCreateButton(): boolean {
    return !this._isValid() ||
      this.createScheduleLoading ||
      (!this.createJobInformationForm) ||
      this.createJobInformationForm.shouldDisableButton();
  }

  onScheduleNameChanged(value: any) {
    this.isScheduleNameFieldValid = value.target.checkValidity();
    this.scheduleNameValue = value.target.value;
  }

  onScheduleDescriptionChanged(value: any) {
    this.isDescriptionFieldValid = validateSafeInput(value.target.value);
    this.scheduleDescriptionValue = value.target.value;
  }

  onCronExpressionChanged(value: any) {
    this.cronExpressionValue = value.target.value?.trim();
    this.cronErrorMessage = getCronErrorMessage(this.cronExpressionValue);
    this.isCronExpressionFieldValid = !this.cronErrorMessage;
  }

  onCancel(): void {
    this.cancelClicked.emit();
  }

  resetAllSelections(): void {
    this.scheduleNameValue = '';
    this.scheduleDescriptionValue = '';
    this.cronExpressionValue = '';
    this.failedToCreateJobSchedule = false;
    this.createScheduleLoading = false;
    this.createJobInformationForm?.resetAllSelections()
  }

  _isValid(): boolean {
    return this.isScheduleNameFieldValid &&
      this.isDescriptionFieldValid &&
      this.isCronExpressionFieldValid;
  }

  _subscribeToScheduleServices() {

    this.jobScheduleDetailsFacadeService
      .getJobScheduleLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading) => {
        this.createScheduleLoading = loading;
      });

    this.jobScheduleDetailsFacadeService.getJobScheduleFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failed) => {
        this.failedToCreateJobSchedule = !!failed;
      });

    this.jobScheduleDetailsFacadeService
      .getJobScheduleId()
      .pipe(
        skip(1),
        filter(id => !!id),
        takeUntilDestroyed(this))
      .subscribe((id) => {
        if (!this.failedToCreateJobSchedule) {
          this._showSuccessCreateJobNotification(id);
          this.createScheduleSuccess.emit(id);
        }
      });
  }

  _showSuccessCreateJobNotification(id: string) {
    this.notificationV2Service.success({
      title: this.translateService.instant('createSchedule.TITLE'),
      description: this.translateService.instant('messages.JOB_SCHEDULE_CREATED_SUCCESS', { id })
    });
  }
}
