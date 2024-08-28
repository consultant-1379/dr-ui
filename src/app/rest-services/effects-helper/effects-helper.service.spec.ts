import { TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationV2Service, NotificationV2ServiceMock } from '@erad/components/notification-v2';
import { TranslateModuleMock } from '@erad/utils';
import { of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ActionMock, actionTypeMock, failureMock, notificationDescriptionMock, responseKeyMock, sampleResponseMock } from './effects-helper.data.mock';
import { EffectsHelperService } from './effects-helper.service';

describe('EffectsHelperService', () => {
  let service: EffectsHelperService;
  let errorHandlerService: ErrorHandlerService;
  let notificationV2Service: NotificationV2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TranslateModuleMock,
        RouterTestingModule
      ],
      providers: [
        EffectsHelperService,
        {
          provide: NotificationV2Service,
          useClass: NotificationV2ServiceMock
        }
      ]
    });

    service = TestBed.inject(EffectsHelperService);
    errorHandlerService = TestBed.inject(ErrorHandlerService);
    notificationV2Service = TestBed.inject(NotificationV2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showErrorMessage', () => {
    it('should call errorHandlerService.handleError on showErrorMessage', waitForAsync(() => {
      const notificationSpy = spyOn(errorHandlerService, 'handleError');

      throwError(() => '').pipe(
        service.showErrorMessage(),
        catchError(() => of(null))
      ).subscribe(() => {
        expect(notificationSpy).toHaveBeenCalled();
      });
    }));

  });

  describe('showSuccessMessage', () => {
    it('should show success message on showSuccessMessage', () => {
      const spy = spyOn(notificationV2Service, 'success');

      const notificationTitleMock = 'notification title';


      service.showSuccessMessage(notificationTitleMock, notificationDescriptionMock);

      expect(spy).toHaveBeenCalledWith({
        title: notificationTitleMock,
        description: notificationDescriptionMock
      });
    });
  });

  describe('handleSuccess', () => {

    it('should execute handle success correctly on handleSuccess', waitForAsync(() => {
      of(sampleResponseMock).pipe(
        service.handleSuccess(ActionMock, responseKeyMock)
      ).subscribe((data: ActionMock) => {

        //THEN
        expect(data).toBeDefined();
        expect(data.type).toBe(actionTypeMock);
        expect(data.payload[responseKeyMock]).toBe(sampleResponseMock);
      });
    }));

  });

  describe('handleFailure', () => {

    it('should handle failure to custom key on handleFailure', waitForAsync(() => {
      const spy = spyOn(errorHandlerService, 'getFailure').and.returnValue(failureMock);

      throwError(() => '').pipe(
        service.handleFailure(ActionMock, undefined)
      ).subscribe((data: ActionMock) => {

        //THEN
        expect(spy).toHaveBeenCalled();
        expect(data.type).toBe(actionTypeMock);
        expect(Object.keys(data.payload).length).toBe(1);
      });
    }));
  });
});
