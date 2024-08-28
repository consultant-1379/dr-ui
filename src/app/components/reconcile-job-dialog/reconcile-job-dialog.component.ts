import { Component, EventEmitter, Inject, OnInit, ViewChild, Output } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { validationConstants } from 'src/app/constants/app.constants';
import { ViewStyle } from '@erad/components';
import { ButtonMode } from '@erad/components/button';
import { JobDetailsFacadeService } from 'src/app/lib/job-detail/services/job-details-facade.service';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';
import { ApplicationDetailsFacadeService } from 'src/app/lib/application-detail/service/application-details-facade.service';
import { DynamicInputsDisplayComponent } from '../dynamic-inputs-display/dynamic-inputs-display.component';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { IconSize } from '../info-message/icon-size.enum';

@Component({
  selector: 'dnr-reconcile-job-dialog',
  templateUrl: './reconcile-job-dialog.component.html',
  styleUrls: ['./reconcile-job-dialog.component.scss']
})
@UnsubscribeAware()
export class ReconcileJobDialogComponent implements OnInit {
  @Output() reconcileSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() reconcileLoadingFailure: EventEmitter<DnrFailure> = new EventEmitter<DnrFailure>();

  @Output() reconcileOngoing: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild(DynamicInputsDisplayComponent) dynamicInputsDisplay: DynamicInputsDisplayComponent;

  SAFE_STRING_PATTERN: string = validationConstants.safeStringPattern;
  viewStyle = ViewStyle.Bordered;
  buttonMode = ButtonMode;
  topIconSize = IconSize.medium;

  applicationId: string;
  jobId: string;
  itemsCount: string;
  featurePackId: string;
  applicationJobName: string;
  selectedItems: DiscoveredObjects[] = [];
  reconcileInputs: any;
  loading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      jobId: string, itemsCount: string, selectedItems: DiscoveredObjects[]
    },
    public dialogRef: MatDialogRef<ReconcileJobDialogComponent>,
    private readonly appsFacadeService : ApplicationDetailsFacadeService,
    private readonly jobDetailsFacadeService: JobDetailsFacadeService
  ) { }

  ngOnInit(): void {
    this.jobId = this.data.jobId;
    this.itemsCount = this.data.itemsCount;
    this.selectedItems = this.data.selectedItems || [];

    this._subscribeForJobDetails();
    this._subscribeForReconcileInputs();

    this._loadJobDetails();
  }

  shouldDisableButton() {
    // inputs are optional - if there are no inputs can proceed with reconcile
    if (this.dynamicInputsDisplay){
      return this.loading || !this.dynamicInputsDisplay.isFormValid();
    }
    return this.loading;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  reconcileJob(): void {
    this.reconcileOngoing.emit();

    this._subscribeToReconcileSuccess();

    if (this.selectedItems.length > 0) {
      this._reconcileSelectedItems();
    } else {
      this._reconcileAll();
    }
  }

  _reconcileSelectedItems(): void {
      const objects = this.selectedItems.map(item => ({ objectId: item.objectId }));
      this.jobDetailsFacadeService.reconcileJob(
        this.jobId,
        {
          inputs: this.dynamicInputsDisplay ? this.dynamicInputsDisplay.getFormValues() : {},
          objects
        },
        true
      );
  }

  _reconcileAll(): void {
    this.jobDetailsFacadeService.reconcileAllJob(
      this.jobId,
      { inputs: this.dynamicInputsDisplay ? this.dynamicInputsDisplay.getFormValues() : {} },
      true
    );
  }

  _loadJobDetails() {
    this.jobDetailsFacadeService.loadDetails(this.jobId);
  }

  _subscribeForJobDetails() {
    this.jobDetailsFacadeService
      .getJobDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((res) => {
        if (res) {
          this.applicationId = res?.applicationId;
          this.applicationJobName = res?.applicationJobName;
          this.featurePackId = res?.featurePackId;
          this._loadApplicationDetails();
        }
      });

    this.jobDetailsFacadeService
      .getJobDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._handleFailure(failure);
      });
  }

  _loadApplicationDetails() {
    this.appsFacadeService.loadApplicationDetails(this.featurePackId, this.applicationId)
  }

  _subscribeForReconcileInputs() {
    this.appsFacadeService
      .getApplicationDetails()
      .pipe(takeUntilDestroyed(this))
      .subscribe((res) => {
        if (res?.jobs) {
          this.reconcileInputs = res.jobs.find(job => job.name === this.applicationJobName)?.reconcile?.inputs;
          this.loading = false;
        }
      });

    this.appsFacadeService
      .getApplicationDetailsFailure()
      .pipe(takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._handleFailure(failure);
      });
  }

  _handleFailure(failure: DnrFailure) {
    if (failure) {
      this.reconcileLoadingFailure.emit(failure);
      this.closeDialog();
    }
  }

  _subscribeToReconcileSuccess() {
    this.jobDetailsFacadeService.
      getJobReconciled()
      .pipe(takeUntilDestroyed(this))
      .subscribe((result) => {
        if (typeof (result) === 'boolean') { // ignore setting to undefined
          this.reconcileSuccess.emit(result);
          this.closeDialog();
        }
      });
  }
}
