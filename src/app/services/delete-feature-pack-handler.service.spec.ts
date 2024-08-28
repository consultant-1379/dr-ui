import { ErrorType, TranslateModuleMock, TranslateServiceMock } from '@erad/utils';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogMock, Spies } from '../mock-data/testbed-module-mock';

import { ConfirmationService } from '@erad/components';
import { DeleteFeaturePackHandlerService } from './delete-feature-pack-handler.service';
import { DnrFailure } from '../models/dnr-failure.model';
import { FeaturePackDetailsFacadeService } from '../lib/feature-pack-detail/services/feature-pack-details-facade.service';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

describe('DeleteFeaturePackHandlerService', () => {
  let service: DeleteFeaturePackHandlerService;
  let confirmationService: ConfirmationService;
  let featurePackDetailsFacadeService: FeaturePackDetailsFacadeService;

  const MatDialogRefSpy = {
    close: () => { /* empty */},
    afterClosed: () => of(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModuleMock,
        RouterModule.forRoot([])
      ],
      providers: [
        {
          provide: TranslateService,
          useClass: TranslateServiceMock
        },
        { provide: MatDialog, useClass: MatDialogMock },
        {
          provide: ConfirmationService,
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {}
        },
        { provide: MatDialogRef,
          useValue: MatDialogRefSpy
        },
        { provide: Store, useValue: Spies.StoreSpy },
      ]
    });
    service = TestBed.inject(DeleteFeaturePackHandlerService);
    confirmationService = TestBed.inject(ConfirmationService);
    featurePackDetailsFacadeService = TestBed.inject(FeaturePackDetailsFacadeService);

    spyOn(service.featurePackDetailsFacadeService, 'getFeaturePackDeleted').and.returnValue(of(true));
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    spyOn(service.featurePackDetailsFacadeService, 'getFeaturePackDetailsFailure').and.returnValue(of(mockFailure));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should delete feature pack, clear failure state, subscribe to store on user confirmation', () => {
    //GIVEN
    const id = '123';
    const name = 'Feature Pack 1';
    spyOn(featurePackDetailsFacadeService, 'deleteFeaturePack');
    spyOn(featurePackDetailsFacadeService, 'clearFailureState');
    spyOn(service, '_subscribeToStoreEvents');


    const confirmationServiceSpy = spyOn(confirmationService, 'show').and.returnValue(of(true));

    // WHEN
    service.deleteFeaturePack(id, name);

    // THEN
    expect(confirmationServiceSpy).toHaveBeenCalledOnceWith({
      header: 'UNINSTALL_FEATURE_PACK_CONFIRM_HEADER',
      content: 'UNINSTALL_FEATURE_PACK_CONFIRM_MESSAGE',
      cancelText: 'buttons.CANCEL',
      confirmButtonText: 'buttons.UNINSTALL',
    });

    expect(featurePackDetailsFacadeService.deleteFeaturePack).toHaveBeenCalledWith('123', 'Feature Pack 1', true);
    expect(featurePackDetailsFacadeService.clearFailureState).toHaveBeenCalled();
    expect(service._subscribeToStoreEvents).toHaveBeenCalled();
  });


  it('should subscribe to featurePackDeleteFailure$ and show error dialog on failure', () => {
    //GIVEN
    const mockFailure: DnrFailure = { errorMessage: "error message", type: ErrorType.BackEnd };
    const showErrorDialogSpy = spyOn(service, '_showErrorDialog');
    service.featurePackDeleteFailure$= of(mockFailure);

    //WHEN
    service._subscribeFailure();

    //THEN
    expect(showErrorDialogSpy).toHaveBeenCalledWith(mockFailure);
  });

  it('_subscribeSuccess should handle success and emit delete success event', () => {
    //GIVEN
    service.featurePackDeleteSuccess$ = of(true);
    const emitSpy = spyOn(service.uninstallSuccessEvent, 'emit');

    // WHEN
    service._subscribeSuccess();

    // THEN
    service.featurePackDeleteSuccess$.subscribe();
    expect(emitSpy).toHaveBeenCalledWith(service.featurePackId);
  });

  it('_unsubscribeFromStore should remove subscriptions', () => {
    //GIVEN
    service._subscribeToStoreEvents();
    expect(service.subscriptions.length).toEqual(2);

    //WHEN
    service._unsubscribeFromStore();

    //THEN
    expect(service.subscriptions.length).toEqual(0);
  });

});
