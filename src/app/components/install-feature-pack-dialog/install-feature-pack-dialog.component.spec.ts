import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { ErrorType } from 'src/app/models/enums/error-type.enum';
import { InstallFeaturePackDialogComponent } from './install-feature-pack-dialog.component';
import { MatDialogMock } from 'src/app/mock-data/testbed-module-mock';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { of } from 'rxjs';
import { provideMockStore } from '@ngrx/store/testing';

const MatDialogRefSpy = {
  close: () => { },
  afterClosed: () => of(true)
};

describe('InstallFeaturePackDialogComponent', () => {
  let component: InstallFeaturePackDialogComponent;
  let fixture: ComponentFixture<InstallFeaturePackDialogComponent>;
  let mockMatDialogRef: MatDialogRef<InstallFeaturePackDialogComponent>;
  let notificationV2Service: NotificationV2Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstallFeaturePackDialogComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        { provide: MatDialog, useValue: MatDialogMock },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: MatDialogRefSpy },
        provideMockStore(),
        TranslateService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstallFeaturePackDialogComponent);
    component = fixture.componentInstance;
    component.featurePackId = '123';
    mockMatDialogRef = TestBed.inject(MatDialogRef);
    notificationV2Service = TestBed.inject(NotificationV2Service);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the dialog when onCancel is called', () => {
    const closeSpy = spyOn(mockMatDialogRef, 'close');
    component.onCancel();
    expect(closeSpy).toHaveBeenCalled();
  });

  it('should remove file and clear failure state when onRemoveFile is called', () => {
    // GIVEN
    component.fileToUpload = new File(['dummy'], 'dummy.zip', { type: 'application/zip' });
    spyOn(component.featurePackDetailsFacadeService, 'clearFailureState');

    // WHEN
    component.onRemoveFile();

    // THEN
    expect(component.fileToUpload).toBeNull();
    expect(component.featurePackDetailsFacadeService.clearFailureState).toHaveBeenCalled();
  });

  describe('onSubmitFileToUpload POST/PUT tests', () => {
    beforeEach(() => {
      component.fileToUpload = new File(['dummy'], 'dummy.zip', { type: 'application/zip' });
    });

    it('should call uploadFeaturePack when onSubmitFileToUpload is called for a new feature pack', fakeAsync(() => {

      // GIVEN
      const uploadFeaturePackSpy = spyOn(component.featurePackDetailsFacadeService, 'uploadFeaturePack');
      component.featurePackName = 'New Feature Pack';
      component.descriptionValue = 'Description';
      component.featurePackId = null; // Simulate a new feature pack

      // WHEN
      component.onSubmitFileToUpload();
      tick();

      //THEN
      expect(uploadFeaturePackSpy).toHaveBeenCalledWith('New Feature Pack', 'Description', component.fileToUpload, true);
    }));

    it('should call updateFeaturePack when onSubmitFileToUpload is called for an existing feature pack', fakeAsync(() => {

      // GIVEN
      const updateFeaturePackSpy = spyOn(component.featurePackDetailsFacadeService, 'updateFeaturePack');
      component.featurePackName = 'Existing Feature Pack';
      component.descriptionValue = 'Updated Description';
      component.featurePackId = '123'; // Simulate an existing feature pack
      // WHEN
      component.onSubmitFileToUpload();
      tick();

      // THEN
      expect(updateFeaturePackSpy).toHaveBeenCalledWith('123', 'Updated Description', component.fileToUpload, true);
    }));

    it('should pass an empty string in PUT payload for description when description is not set', fakeAsync(() => {

      // GIVEN
      const updateFeaturePackSpy = spyOn(component.featurePackDetailsFacadeService, 'updateFeaturePack');
      component.featurePackName = 'Existing Feature Pack';
      component.featurePackId = '123'; // Simulate an existing feature pack
      // WHEN
      component.onSubmitFileToUpload();
      tick();

      // THEN
      expect(updateFeaturePackSpy).toHaveBeenCalledWith('123', '', component.fileToUpload, true);
    }));
  });

  describe('Button Enable/Disable tests', () => {

    function setAllRequiredFields() {
      component.isLoading = false;
      component.failure = null;

      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(['dummy'], 'dummy.zip', { type: 'application/zip' }));
      component.onFileChange(dataTransfer.files);
      component.onNameChange('Valid Name');
    }

    it('should disable the install button if failure has occurred', () => {
      setAllRequiredFields();
      component.failure = { type: ErrorType.BackEnd, errorCode: '500', errorMessage: 'Server error' };
      expect(component.shouldDisableButton()).toBeTrue();
    });

    it('should disable the install button if a file is not present', () => {
      setAllRequiredFields();
      component.onRemoveFile();
      expect(component.shouldDisableButton()).toBeTrue();
    });

    it('should disable the install button if description field is invalid', () => {
      setAllRequiredFields();
      component.onDescriptionChange('Invalid <script> Description');
      expect(component.shouldDisableButton()).toBeTrue();
    });

    it('should disable the install button if name field is invalid', () => {
      setAllRequiredFields();
      component.onNameChange('Invalid <script> Name');
      expect(component.shouldDisableButton()).toBeTrue();
    });

    it('should remove name already exists error when name changes', () => {
      // GIVEN
      setAllRequiredFields();
      component.failure = { type: ErrorType.BackEnd, errorCode: 'DR-10', errorMessage: 'Server error' };
      expect(component.shouldDisableButton()).toBeTrue();

      // WHEN
      component.onNameChange('nameChanged');

      // THEN
      expect(component.failure).toBeNull();
      expect(component.errorMessageForFileUploader).toBeNull();
      expect(component.shouldDisableButton()).toBeFalse();
    });

    it('should NOT remove error (if not name exists error) when name changes', () => {
      // GIVEN
      setAllRequiredFields();
      component.failure = { type: ErrorType.BackEnd, errorCode: 'DR-01', errorMessage: 'Server error' };
      expect(component.shouldDisableButton()).toBeTrue();

      // WHEN
      component.onNameChange('nameChanged');

      // THEN
      expect(component.failure).toBeDefined();
      expect(component.shouldDisableButton()).toBeTrue();
    });

    it('should enable the install button when all required fields are present', () => {
      setAllRequiredFields();
      expect(component.shouldDisableButton()).toBeFalse();
    });
  });

  describe('success notification tests', () => {

    beforeEach(() => {
      // GIVEN
      const trueObservable = of(true);
      spyOn(component.featurePackDetailsFacadeService, 'getFeaturePackUploadSuccess').and.returnValue(trueObservable);
      spyOn(component, 'closeDialog');
      spyOn(component.fileUploadSuccess, 'emit');
      spyOn(notificationV2Service, 'success');

      component.featurePackName = 'my feature pack';
      component.fileToUpload = new File(['dummy'], 'dummy.zip', { type: 'application/zip' });
    });

    it('should show correct success notification when onSubmitFileToUpload succeeds for install', fakeAsync(() => {

      component.featurePackId = null; // Simulate a new feature pack

      // WHEN
      component._subscribeUploadSuccess();
      tick();

      // THEN
      expect(notificationV2Service.success).toHaveBeenCalledWith({
        title: 'messages.INSTALL_SUCCESS_TITLE',
        description: 'messages.FEATURE_PACK_INSTALL_SUCCESS'
      });

      expect(component.fileUploadSuccess.emit).toHaveBeenCalledWith('my feature pack');
      expect(component.closeDialog).toHaveBeenCalled();
    }));

    it('should show correct success notification when onSubmitFileToUpload succeeds for upgrade', fakeAsync(() => {

      component.featurePackId = "123"; // Simulate an existing feature pack

      // WHEN
      component._subscribeUploadSuccess();
      tick();

      // THEN
      expect(notificationV2Service.success).toHaveBeenCalledWith({
        title: 'messages.UPDATE_SUCCESS_TITLE',
        description: 'messages.FEATURE_PACK_UPDATE_SUCCESS'
      });

      expect(component.fileUploadSuccess.emit).toHaveBeenCalledWith('my feature pack');
      expect(component.closeDialog).toHaveBeenCalled();
    }));
  });

  describe('failure tests', () => {

    beforeEach(() => {
      // GIVEN
      const failObservable = of({ errorCode: '500', errorMessage: 'Server error', type: ErrorType.BackEnd });
      spyOn(component.featurePackDetailsFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(failObservable);
      spyOn(component, 'closeDialog');
      spyOn(component.fileUploadSuccess, 'emit');
    });

    it('should pass errorMessage to FileUploader on failure and leave the dialog open', fakeAsync(() => {

      // WHEN
      component._subscribeFailure();
      tick();

      // THEN
      expect(component.errorMessageForFileUploader).toMatch('ERROR_CODE 500: Server error');
      expect(component.fileUploadSuccess.emit).not.toHaveBeenCalled();
      expect(component.closeDialog).not.toHaveBeenCalled();
    }));
  });

  describe('loading tests', () => {
    it("should set isLoading prop true when loading", fakeAsync(() => {
      // GIVEN
      spyOn(component.featurePackDetailsFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(true));

      // WHEN
      component._subscribeLoading();
      tick();

      // THEN
      expect(component.isLoading).toBeTrue();
    }));

    it("should set isLoading prop false when not loading", fakeAsync(() => {
      // GIVEN
      spyOn(component.featurePackDetailsFacadeService, 'getFeaturePackDetailsLoading').and.returnValue(of(false));

      // WHEN
      component._subscribeLoading();
      tick();

      // THEN
      expect(component.isLoading).toBeFalse();
    }));
  });

});
