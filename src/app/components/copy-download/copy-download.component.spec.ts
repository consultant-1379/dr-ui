import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateFakeLoader, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';

import { CopyDownloadComponent } from './copy-download.component';
import { NotificationV2Service } from '@erad/components/notification-v2';
import { stringifyJson } from 'src/app/utils/json.utils';

describe('CopyDownloadComponent', () => {
  let component: CopyDownloadComponent;
  let fixture: ComponentFixture<CopyDownloadComponent>;
  let notificationV2Service: NotificationV2Service;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CopyDownloadComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader
          }
        })
      ],
      providers: [
        {
          provide: TranslateService,
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyDownloadComponent);
    component = fixture.componentInstance;
    notificationV2Service = TestBed.inject(NotificationV2Service);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('copy down load component should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should handle onDownLoadClick successfully', () => {
    // GIVEN
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };

    component.downloadUrl = '/fake/download-url';
    component.name = 'unit-test';
    spyOn(document.body, 'appendChild').and.stub();
    spyOn(document.body, 'removeChild').and.stub();
    spyOn(notificationV2Service, 'success').and.stub();

    // WHEN
    component.onDownLoadClick(mockEvent);

    // THEN
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(document.body.appendChild).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalled();
    expect(notificationV2Service.success).toHaveBeenCalledWith({
      title: 'SUCCESS',
      description: 'messages.FILE_DOWNLOADED'
    });
  });

  it('should handle onCopyClick successfully', async () => {
    // GIVEN
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    component.name = undefined;
    component.copyObject = { key: 'value' };

    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    spyOn(notificationV2Service, 'success').and.stub();

    // WHEN
    await component.onCopyClick(mockEvent);

    // THEN
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(stringifyJson(component.copyObject));
    expect(notificationV2Service.success).toHaveBeenCalledWith({
      title: 'SUCCESS',
      description: 'messages.DETAILS_COPIED_TO_CLIPBOARD'
    });
  });

  it ('should use bespoke copy success toast message if provided', async () => {
    // GIVEN
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    component.name = "jack";
    component.copyObject = { key: 'value' };
    component.copySuccess18nKey = 'MY_SUCCESS_KEY';
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve());
    spyOn(component.translateService, 'instant').and.callThrough();

    // WHEN
    await component.onCopyClick(mockEvent);

    // THEN
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(stringifyJson(component.copyObject));

    expect(component.translateService.instant).toHaveBeenCalledWith(
      'MY_SUCCESS_KEY', Object({ name: 'jack' }));
  });

  it('should use alternative copy method if window.navigator fails', async () => {
    // GIVEN
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    component.copyObject = { key: 'value2' };

    spyOn(component, '_hasClipboardApi').and.returnValue(true);
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.reject('Clipboard API Error 1'));
    spyOn(document, 'execCommand').and.returnValue(false);  // fail
    spyOn(notificationV2Service, 'error').and.stub();

    // WHEN
    await component.onCopyClick(mockEvent);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // THEN
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(notificationV2Service.error).toHaveBeenCalledWith({
      title: 'ERROR',
      description: 'Clipboard API Error 1'
    });
  });


  it('should use alternative copy method if window.navigator does not exist', async () => {
    // GIVEN
    const mockEvent = {
      stopPropagation: jasmine.createSpy('stopPropagation')
    };
    component.name = 'unit-test'; // name supplied
    component.copyObject = { key: 'value3' };

    spyOn(component, '_hasClipboardApi').and.returnValue(false);
    spyOn(document, 'execCommand').and.returnValue(true);

    spyOn(notificationV2Service, 'success').and.stub();

    // WHEN
    component.onCopyClick(mockEvent);

    // THEN
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');

    expect(notificationV2Service.success).toHaveBeenCalledWith({
      title: 'SUCCESS',
      description: 'messages.ALL_SECTIONS_COPIED_TO_CLIPBOARD_WITH_NAME'
    });
  });

});
