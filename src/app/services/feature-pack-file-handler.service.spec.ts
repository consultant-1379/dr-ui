import { TestBed, waitForAsync } from '@angular/core/testing';

import { EventEmitter } from '@angular/core';
import { FeaturePackFileHandlerService } from './feature-pack-file-handler.service';
import { MatDialog } from '@angular/material/dialog';

describe('FeaturePackFileHandlerService', () => {
  let service: FeaturePackFileHandlerService;
  let matDialogMock: jasmine.SpyObj<MatDialog>;

  beforeEach(() => {
    matDialogMock = jasmine.createSpyObj('MatDialog', ['open']);

    TestBed.configureTestingModule({
      providers: [
        FeaturePackFileHandlerService,
        { provide: MatDialog, useValue: matDialogMock }
      ]
    });

    service = TestBed.inject(FeaturePackFileHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open dialog popup for feature install on installFeaturePack', () => {
    //GIVEN
    spyOn(service, '_openFileChooserDialog');

    //WHEN
    service.installFeaturePack();

    //THEN
    expect(service._openFileChooserDialog).toHaveBeenCalled();
  });

  it('should open dialog popup for feature update on updateFeaturePack', () => {
    //GIVEN
    spyOn(service, '_openFileChooserDialog');
    const id = '123';
    const name = 'Feature Pack 1';

    //WHEN
    service.updateFeaturePack(id, name);

    //THEN
    expect(service._openFileChooserDialog).toHaveBeenCalledWith(id, name);
  });

  it('should emit fileUploadSuccessEvent on _openFileChooserDialog', waitForAsync(() => {

    //GIVEN
    const dialogRefSpyObj = jasmine.createSpyObj('MatDialogRef', ['afterClosed', 'close']);
    dialogRefSpyObj.componentInstance = jasmine.createSpyObj('InstallFeaturePackDialogComponent', ['fileUploadSuccess']);
    dialogRefSpyObj.componentInstance.fileUploadSuccess = new EventEmitter<string>();

    matDialogMock.open.and.returnValue(dialogRefSpyObj);
    const featurePackName = 'Feature Pack 1';
    const fileUploadSuccessEventEmitSpy = spyOn(service.fileUploadSuccessEvent, 'emit').and.callThrough();

    //WHEN
    service._openFileChooserDialog();
    dialogRefSpyObj.componentInstance.fileUploadSuccess.emit(featurePackName);

    //THEN
    expect(fileUploadSuccessEventEmitSpy).toHaveBeenCalledWith(featurePackName);
  }));
});
