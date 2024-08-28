import { Component, EventEmitter, Inject, OnDestroy, Output, ElementRef, Renderer2, OnInit } from '@angular/core';

import { ButtonMode } from '@erad/components/button';
import { FeaturePackDetailsFacadeService } from 'src/app/lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { TranslateService } from '@ngx-translate/core';
import { ServerErrors, validationConstants } from 'src/app/constants/app.constants';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { ViewStyle } from '@erad/components';
import { validateSafeInput } from 'src/app/utils/validator.utils';

/**
 * Component to add to dialog, to manage loading feature packs
 * from file zip and uploading to server.
 *
 * POST call to server.
 * Passes the created name and description to the server along with the file.
 *
 * PUT call to server.
 * Update button press to replace/update the file for an existing
 * feature pack name. Passes the id of the feature pack to update in PUT
 * (as apposed to the name, which won't be changing)
 */

@Component({
  selector: 'dnr-install-feature-pack-dialog',
  templateUrl: './install-feature-pack-dialog.component.html',
  styleUrls: ['./install-feature-pack-dialog.component.scss']
})
@UnsubscribeAware()
export class InstallFeaturePackDialogComponent implements OnInit, OnDestroy {

  @Output()
  fileUploadSuccess: EventEmitter<string> = new EventEmitter<string>();

  buttonMode = ButtonMode;
  descriptionValue: string = '';  // default to empty string for display purposes
  errorMessageForFileUploader: string = null;
  failure: DnrFailure = null; // server failure response
  featurePackId: string = null; // for PUT url - will be set from data.featurePackId
  featurePackName: string = '';
  fileToUpload: File = null;
  isInValidDescription: boolean = false;
  isInValidName: boolean = false;
  isLoading: boolean = false; // will load after pressing upload button
  existingFileName: string = null;
  suggestedFileTypes: string = ".zip, .rar, .7z, .tar, .gz, .bz2, .xz, .tar.gz, .tar.bz2, .tar.xz";
  validationErrorMessage: string = null;
  viewStyle = ViewStyle.Bordered;

  MAX_DESCRIPTION_LENGTH: number = validationConstants.maxLargeCharLength;
  MAX_NAME_LENGTH: number = validationConstants.maxShortCharLength;

  // TODO pattern on erad-text-input do not seem reactive enough (doing manually in code instead)
  SAFE_STRING_PATTERN: string = validationConstants.safeStringPattern;
  invalidInputChars: string = validationConstants.invalidInputCharDisplay;


  /**
   * Constructor
   * @param data            data passed from parent dialog for PUT use case
   *                        e.g for an update would be existing id, name and existingFileName
   *
   * @param dialogRef       mat dialog parent that launches this component
   *
   * @param featurePackDetailsFacadeService service to call server
   * @param translate       for translation
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string, name: string, existingFileName: string },

    public dialogRef: MatDialogRef<InstallFeaturePackDialogComponent>,
    readonly featurePackDetailsFacadeService: FeaturePackDetailsFacadeService,
    readonly notificationV2Service: NotificationV2Service,
    private readonly translate: TranslateService,
    private readonly elementRef: ElementRef,
    private readonly renderer: Renderer2) {

  }

  ngOnInit(): void {
    this.featurePackId = this.data.id;  // if present we are update use case
    this.featurePackName = this.data.name;

    this._subscribeFailure();
    this._subscribeLoading();
    this._subscribeUploadSuccess();
    this._addAcceptAttributeToFileChooser();
  }

  ngOnDestroy(): void {
    this.featurePackDetailsFacadeService.clearFailureState();
  }

  /**
   * Utility function to close the dialog.
   * this.dialog.closeAll() would do same thing
   */
  closeDialog(): void {
    this.dialogRef.close();
  }

  onDescriptionChange(value: string) {
    this.descriptionValue = value?.trim();
    this.isInValidDescription = !validateSafeInput(value);
  }

  onNameChange(value: string) {
    this.featurePackName = value?.trim();
    this.isInValidName = !validateSafeInput(value);
    if (this.failure?.errorCode === ServerErrors.FP_NAME_ALREADY_EXISTS_ERROR_CODE) {
      this.errorMessageForFileUploader = null;
      this.failure = null;
    }
  }

  onFileChange(files: FileList) {
    this.fileToUpload = files[0];
  }

  onCancel() {
    this.closeDialog();
  }

  onRemoveFile() {
    // an onCancelUpload would not seem to be required
    this.fileToUpload = null;
    this.featurePackDetailsFacadeService.clearFailureState();
  }

  /**
   * PUT or POST call to server
   */
  onSubmitFileToUpload() {
    if (this.featurePackId) {
      this.featurePackDetailsFacadeService.updateFeaturePack(this.featurePackId,
        this.descriptionValue,
        this.fileToUpload, true);
    } else {
      this.featurePackDetailsFacadeService.uploadFeaturePack(this.featurePackName,
        this.descriptionValue,
        this.fileToUpload, true);
    }
  }

  /**
   * Only enable button if all required fields are filled in and no server failure
   * (disabling on server failure - user can remove file and replace to try again)
   * @returns ()
   */
  shouldDisableButton() {
    return this.isLoading
      || !this.fileToUpload
      || !this.featurePackName
      || !!this.failure
      || this.isInValidName
      || this.isInValidDescription;
  }

  /* exposed for junit testing */
  _subscribeFailure() {
    this.featurePackDetailsFacadeService.clearFailureState();
    this.featurePackDetailsFacadeService
      .getFeaturePackDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this.failure = failure;
        this.errorMessageForFileUploader = (failure) ? this._getMessageForFileUploader(failure) : '';
      });
  }

  /* exposed for junit testing */
  _subscribeLoading() {
    this.featurePackDetailsFacadeService
      .getFeaturePackDetailsLoading()
      .pipe(takeUntilDestroyed(this))
      .subscribe((loading: boolean) => {
        this.isLoading = loading;
      });
  }

  /* exposed for junit testing */
  _subscribeUploadSuccess() {
    this.featurePackDetailsFacadeService
      .getFeaturePackUploadSuccess()
      .pipe(takeUntilDestroyed(this))
      .subscribe((response: boolean) => {
        if (response) {
          this._showSuccessNotification();
          // when success, emit event so caller can refresh table
          this.fileUploadSuccess.emit(this.featurePackName);
          this.closeDialog();
        }
      });
  }

  /**
   * File upload component carries its own error message handling
   * (which could negate the need to show a failure-display div in the html)
   *
   * @param failure
   * @returns
   */
  private _getMessageForFileUploader(failure: DnrFailure): string {

    if (failure.errorCode && failure.errorMessage) {
      return this.translate.instant('ERROR_CODE') + ' ' + failure.errorCode + ': ' + failure.errorMessage;
    } else if (failure.errorMessage) {
      return failure.errorMessage;
    }
    return this.translate.instant('messages.INTERNAL_SERVER_ERROR')
  }

  private _showSuccessNotification() {
    const titleKey = (this.featurePackId) ? 'messages.UPDATE_SUCCESS_TITLE' : 'messages.INSTALL_SUCCESS_TITLE';
    const descriptionKey = (this.featurePackId) ? 'messages.FEATURE_PACK_UPDATE_SUCCESS' : 'messages.FEATURE_PACK_INSTALL_SUCCESS';

    this.notificationV2Service.success({
      title: this.translate.instant(titleKey),
      description: this.translate.instant(descriptionKey, { name: this.featurePackName }),
    });
  }


  /**
   * Adding an accept attribute on the erad-file-upload component
   */
  private _addAcceptAttributeToFileChooser() {
    const nativeInputFileElement = this.elementRef.nativeElement.querySelector('input[type="file"]');
    if (nativeInputFileElement !== null) {
      this.renderer.setAttribute(nativeInputFileElement, 'accept', this.suggestedFileTypes);
    }
  }
}
