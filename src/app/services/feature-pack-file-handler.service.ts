import { EventEmitter, Injectable, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { InstallFeaturePackDialogComponent } from '../components/install-feature-pack-dialog/install-feature-pack-dialog.component';

/**
 * This service is used to handle the file upload for feature pack installation.
 */
@Injectable({
  providedIn: 'root'
})
export class FeaturePackFileHandlerService {

  /**
   * Reference to the dialog content component, which will be responsible for
   * handling the file upload and displaying failure messages.
   */
  @ViewChild(InstallFeaturePackDialogComponent) dialogContent: InstallFeaturePackDialogComponent;

  /**
   * Event emitter for file upload success,
   * e.g. for use to refresh the table in the parent component.
   */
  @Output()
  fileUploadSuccessEvent: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private readonly dialog: MatDialog
  ) { }

  /**
   * Allows the user to select a feature pack file to install.
   */
  installFeaturePack() {
    this._openFileChooserDialog();
  }

  /**
   * Allows the user to select a feature pack file to upgrade.
   * @param id   existing feature pack id
   * @param name existing feature pack name
   */
  updateFeaturePack(id: string, name: string) {
    this._openFileChooserDialog(id, name);
  }

  //Removed private for unit test
  _openFileChooserDialog(id: string = null, name: string = null) {
    const dialogRef = this.dialog.open(InstallFeaturePackDialogComponent, {
      width: '500px',
      data: { id, name }
    });

    dialogRef?.componentInstance.fileUploadSuccess.subscribe((featurePackName) => {
      this.fileUploadSuccessEvent.emit(featurePackName);
      dialogRef.componentInstance.fileUploadSuccess.unsubscribe();
    });
  }
}
