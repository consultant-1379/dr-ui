import { BehaviorSubject } from 'rxjs';
import { CreateJobInputModel } from 'src/app/models/create-job-Input.model';
import { Injectable } from '@angular/core';

/**
 * This is CreateJobProcessingService class
 * This service class is doing event handling and functional processing for Create Job Component suing Observable communication method.
 * This service will be available to use through the application as provide-in root.
 */
@Injectable({ providedIn: 'root' })
export class CreateJobProcessingService {
  private cancelClickedEvent = new BehaviorSubject<boolean>(false);
  private inputDataEvent = new BehaviorSubject<CreateJobInputModel>(null);

  onCancelEvent = this.cancelClickedEvent.asObservable();
  onInputDataEvent = this.inputDataEvent.asObservable();

  private _inputData: CreateJobInputModel = null;

  /**
   * @param {string} status  The status to define current status of cancel event
   * @returns Void
   */
  onCancel(status: boolean) {
    this.cancelClickedEvent.next(status);
  }

  // TODO : #onSaveInputData not directly used to date if no action required from
  // this.postSubmit.emit(id) on CreateJobInformationFormComponent
  /**
   * @param {string} _inputData  The _inputData to define input data (application, featurepack) for create job component.
   */
  onSaveInputData(_inputData: CreateJobInputModel) {
    this._inputData = _inputData;
    this.inputDataEvent.next(_inputData);
  }

  get inputData() {
    return this._inputData;
  }
}