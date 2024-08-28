import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ButtonMode } from '@erad/components/button';
import { DiscoveredObjects } from 'src/app/models/discovered-objects.model';
import { DiscoveredObjectsTableComponent } from 'src/app/components/discovered-objects-table/discovered-objects-table.component';
import { DnrFailure } from 'src/app/models/dnr-failure.model';
import { DnrTableActionItem } from 'src/app/components/dnr-table/dnr-table-button.model';
import { FailureDisplayDialogComponent } from 'src/app/components/failure-display-dialog/failure-display-dialog.component';
import { Job } from 'src/app/models/job.model';
import { JobStatus } from 'src/app/models/enums/job-status.enum';
import { RbacService } from 'src/app/services/rbac.service';
import { ReconcileJobDialogComponent } from 'src/app/components/reconcile-job-dialog/reconcile-job-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'dnr-discovered-objects-container',
  templateUrl: './discovered-objects-container.component.html',
  styleUrls: ['./discovered-objects-container.component.scss']
})
export class DiscoveredObjectsContainerComponent implements OnInit, OnChanges {
  @Input() job: Job;

  @Output() itemSelection = new EventEmitter<DiscoveredObjects[]>();
  @Output() reconcileStarted = new EventEmitter();
  @Output() refreshClicked = new EventEmitter();

  @ViewChild('table', { static: true }) table!: DiscoveredObjectsTableComponent;

  title: string = this.translateService.instant("DISCOVERED_OBJECTS");

  buttonMode = ButtonMode;
  isLeftPanelShown: boolean = false;
  isMainContentPanelShown: boolean = true;
  isDetailsPanelShown = false;
  hasRbacWriteAccess: boolean = false;

  actionItems: any | DnrTableActionItem[] = [];
  selectedItems: DiscoveredObjects[] = [];
  showButtons = false;


  constructor(
    private readonly rbacService: RbacService,
    private readonly translateService: TranslateService,
    private readonly dialog: MatDialog,
    private readonly errorDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.hasRbacWriteAccess = this.rbacService.isReadWrite();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.job && changes?.job?.currentValue?.id !== changes?.job?.previousValue?.id) {
      this.job = changes.job.currentValue;
      this.showButtons = false;
      this.title = this.job.name + " - " + this.translateService.instant("DISCOVERED_OBJECTS");
    }
  }

  onCloseDetailsClicked(): void {
    this.isDetailsPanelShown = false;
  }

  onSelectionChanged(event?: DiscoveredObjects[]): void {
    this.selectedItems = event;
    this.actionItems = this._getActionItems();
    this.itemSelection.emit(event);

  }

  onReconcileClicked(): void {
    this._subscribeToReconcileResults(this.openReconcileDialog());
  }

  onReconcileAllClicked(): void {
    this._subscribeToReconcileResults(this.openReconcileDialog(true));
  }

  openReconcileDialog (isReconcileAll: boolean = false) : MatDialogRef<ReconcileJobDialogComponent>{
    const data = {
      jobId: this.job.id,
      itemsCount: this.table?.getItemsCount(),
      selectedItems: (!isReconcileAll) ? this.selectedItems : undefined
    };

    return this.dialog.open(ReconcileJobDialogComponent, {
      width: '500px',
      data
    });
  }

  onRefreshClicked() {
    this.refreshClicked.emit();
  }

  onDataLoaded(dataLoaded) {
    this.showButtons = dataLoaded && this._enableReconcileButtons();
    this.actionItems = this._getActionItems();
  }

  _subscribeToReconcileResults(dialogRef: MatDialogRef<ReconcileJobDialogComponent>) {
    dialogRef.componentInstance.reconcileSuccess.subscribe((successResult: boolean) => {
      if (successResult) {
        this.table.clearSelection();
        this._unsubscribeFromDialog(dialogRef);
        this.reconcileStarted.emit();
      }
    });

    dialogRef.componentInstance.reconcileLoadingFailure.subscribe((dnrFailure: DnrFailure) => {
      this.showButtons = true;
      this._showErrorDialog(dnrFailure)
      this._unsubscribeFromDialog(dialogRef);
      this.table?.reloadTableItems();
    });

    dialogRef.componentInstance.reconcileOngoing.subscribe(() => {
      // Do not show buttons if reconcile ongoing.
      // Buttons will be shown again if reconcile error / when data reloaded.
      this.showButtons = false;
    });
  }

  _unsubscribeFromDialog(dialogRef) {
    dialogRef.componentInstance.reconcileSuccess.unsubscribe();
    dialogRef.componentInstance.reconcileLoadingFailure.unsubscribe();
    dialogRef.componentInstance.reconcileOngoing.unsubscribe();
  }

  /* exposed for junit */
  _showErrorDialog(failure: DnrFailure) {
      this.errorDialog.open(FailureDisplayDialogComponent, {
        width: '500px',
        data: {failure, titleKey: 'FAILED_TO_LOAD_RECONCILIATION_INPUTS_HEADER'},
      });
  }

  /**
  * Buttons to be added to action slot of table component
  */
  _getActionItems(): DnrTableActionItem[] {

    const actionItems = [];
    if (this.hasRbacWriteAccess && this.showButtons) {

      if (this.selectedItems.length > 0) {
        actionItems.push({
          label: "RECONCILE",
          id: 'reconcile-button-id',
          handler: () => this.onReconcileClicked(),
        });
      }
      if (this.selectedItems.length === 0) { // user has to unselect to see reconcile all button
        actionItems.push({
          label: 'RECONCILE_ALL',
          id: 'reconcile-all-button-id',
          handler: () => this.onReconcileAllClicked(),
        });
      }
    }
    return actionItems;
  }

  private _enableReconcileButtons(): boolean {
    return this.job?.status !== undefined &&
      this.job.status !== JobStatus.NEW &&
      this.job.status !== JobStatus.DISCOVERY_INPROGRESS &&
      this.job.status !== JobStatus.COMPLETED &&
      this.job.status !== JobStatus.RECONCILE_INPROGRESS &&
      this.job.status !== JobStatus.RECONCILE_REQUESTED;
  }
}
