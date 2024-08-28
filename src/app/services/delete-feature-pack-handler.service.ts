import { EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable, filter } from 'rxjs';
import { UnsubscribeAware, takeUntilDestroyed } from '@erad/utils';

import { ConfirmationService } from '@erad/components/confirmation-dialog';
import { DnrFailure } from '../models/dnr-failure.model';
import { FailureDisplayDialogComponent } from '../components/failure-display-dialog/failure-display-dialog.component';
import { FeaturePackDetailsFacadeService } from '../lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { TranslateService } from '@ngx-translate/core';
import { setConfirmDialogPrimaryButtonToRed } from '../utils/common.utils';

/**
 * This service is used to handle deleting a feature pack,
 * i.e. showing the confirm dialog and making the server call.
 *
 * If a server call fail occurs the error is presented on a dialog
 * (as opposed to an inline error message)
 */
@Injectable({
  providedIn: 'root'
})
@UnsubscribeAware()
export class DeleteFeaturePackHandlerService {

  @Output()
  uninstallSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild(FailureDisplayDialogComponent) dialogContent: FailureDisplayDialogComponent;

  featurePackId: string;
  featurePackName: string;

  //removing private for unit test
  featurePackDeleteSuccess$: Observable<boolean> = this.featurePackDetailsFacadeService.getFeaturePackDeleted();
  featurePackDeleteFailure$: Observable<DnrFailure> = this.featurePackDetailsFacadeService.getFeaturePackDetailsFailure();

  // lazy subscribing - noting that this is a service and won't be destroyed after use
  subscriptions: any[] = [];

  constructor(
    readonly confirmationService: ConfirmationService,
    readonly translateService: TranslateService,
    readonly featurePackDetailsFacadeService: FeaturePackDetailsFacadeService,
    readonly errorDialog: MatDialog,
  ) { }

  /**
   * Send server call to delete feature pack after user confirmation.
   * @param id     id of feature pack to delete
   * @param name   name of feature pack to delete
   */
  deleteFeaturePack(id: string, name: string) {
    this.featurePackId = id;
    this.featurePackName = name;

    this.confirmationService.show({
      header: this.translateService.instant("UNINSTALL_FEATURE_PACK_CONFIRM_HEADER"),
      content: this.translateService.instant("UNINSTALL_FEATURE_PACK_CONFIRM_MESSAGE", { name }),
      cancelText: this.translateService.instant('buttons.CANCEL'),
      confirmButtonText: this.translateService.instant('buttons.UNINSTALL')
    })
      .subscribe(observer => {
        if (observer) {
          // user confirmed going ahead with uninstall
          this.featurePackDetailsFacadeService.clearFailureState();
          this._subscribeToStoreEvents();
          this.featurePackDetailsFacadeService.deleteFeaturePack(id, name, true);
        }
      });

    setTimeout(() => {
      setConfirmDialogPrimaryButtonToRed();
    }, 100);
  }

  _subscribeToStoreEvents() {
    if (this.subscriptions.length === 0) {
      this.subscriptions.push(this._subscribeSuccess());
      this.subscriptions.push(this._subscribeFailure());
    }
  }

  _subscribeSuccess() {
    return this.featurePackDeleteSuccess$?.pipe(
      filter(response => !!response),
      takeUntilDestroyed(this))
      .subscribe(() => {
        // when success, emit event so caller can refresh table and show notification
        this.uninstallSuccessEvent.emit(this.featurePackId);
        this._unsubscribeFromStore();
      });
  }

  _subscribeFailure() {
    return this.featurePackDeleteFailure$?.pipe(
      filter(failure => !!failure),
      takeUntilDestroyed(this))
      .subscribe((failure: DnrFailure) => {
        this._showErrorDialog(failure)
      });
  }

  _showErrorDialog(failure: DnrFailure) {
    const errorDialog: MatDialogRef<FailureDisplayDialogComponent> =
      this.errorDialog.open(FailureDisplayDialogComponent, {
        width: '500px',
        data: { failure, titleKey: 'FAILED_TO_UNINSTALL_FEATURE_PACK_HEADER' }
      });

    errorDialog.afterClosed().subscribe(() => {
      this._unsubscribeFromStore();
    });
  }

  /**
   * Unsubscribe from all store events.
   * Done, particularly for failure case as failure state
   * in store is not specific enough, i.e. would be still showing this
   * dialog for any other failure change, e.g. if install fails would show a
   * dialog with uninstall header
   */
  _unsubscribeFromStore() {
    this.subscriptions.forEach(sub => sub?.unsubscribe());
    this.subscriptions = [];
  }
}
