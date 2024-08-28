import { Component, Input } from '@angular/core';

import { NotificationV2Service } from '@erad/components/notification-v2';
import { TranslateService } from '@ngx-translate/core';
import { stringifyJson } from 'src/app/utils/json.utils';

/**
 * Component to display a copy and/or download icon
 * (depending on input properties)
 */
@Component({
  selector: 'dnr-copy-download',
  templateUrl: './copy-download.component.html',
  styleUrls: ['./copy-download.component.scss']
})
export class CopyDownloadComponent {

  /**
   * JSON object to copy to clipboard (optional)
   */
  @Input() copyObject?: object;

  /**
   * Add bespoke success notification toast message key to display
   * when copy to clipboard is successful
   * If key contains a "name" parameter in the dictionary
   * include name parameter
   */
  @Input() copySuccess18nKey?: string;


  /**
   * Full URL (with id) for download link (optional)
   * e.g. /discovery-and-reconciliation/v1/feature-packs/{featurePackId}/files
   */
  @Input() downloadUrl?: string;


  /**
  * change icons color, e.g. should present icons
  * in white color rather than the default (black)
  * when in an active blue accordion header
  */
  @Input() iconColor?: string = '';

  /**
   * Name to display in success notification
   * and/or name prefix, e.g. feature pack name,
   * (will add date timestamp to it in this class)
   * to apply to downloaded file
   */
  @Input() name?: string;


  defaultCopySuccess18nKeyWithName: string = 'messages.ALL_SECTIONS_COPIED_TO_CLIPBOARD_WITH_NAME';
  defaultCopySuccess18nKey: string = 'messages.DETAILS_COPIED_TO_CLIPBOARD';


  constructor(
    private readonly notificationV2Service: NotificationV2Service,
    readonly translateService: TranslateService
  ) { }

  /**
   * Download icon click handler
   * (icon available only if downloadURL is present)
   */
  onDownLoadClick(event: any) {
    event?.stopPropagation();
    const link = document.createElement('a');
    link.download = `${this.name}-${new Date().toISOString()}`;
    link.href = this.downloadUrl;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this._showSuccessNotification(this.translateService.instant('messages.FILE_DOWNLOADED', { name: this.name }));
  }

  /**
  * Copy icon click handler
  * (icon available only if downloadURL
  * and copyObject property is present)
  */
  onCopyClick(event: any) {
    event?.stopPropagation();
    if (this.copyObject) {
      let isSuccess: boolean, errMessage: string;

      const copyText = stringifyJson(this.copyObject);

      if (this._hasClipboardApi()) {

        window.navigator.clipboard.writeText(copyText)
          .then(() => {
            isSuccess = true;
            this._showNotification(isSuccess);
          })
          .catch((error) => {
            errMessage = error?.toString();
            console.error(errMessage + ' error copying text to clipboard - trying a deprecated document.execCommand alternative');
            isSuccess = this._alternativeToClipboard(copyText);
            this._showNotification(isSuccess, errMessage);
          });

      } else {
        // seems does not exist in virtual UX environment (disabled for security reason possibly)
        console.error('window.navigator.clipboard not available on this system - trying a deprecated a document.execCommand alternative');
        errMessage = this.translateService.instant('CLIPBOARD_API_NOT_SUPPORTED');
        isSuccess = this._alternativeToClipboard(copyText);
        this._showNotification(isSuccess, errMessage);
      }
    }
  }

  /* for junit */
  _hasClipboardApi(): boolean {
    return !!window.navigator.clipboard;
  }

  private _showNotification(success: boolean, errMessage?: string) {

    if (success) {
      const defaultKey = this.name ? this.defaultCopySuccess18nKeyWithName : this.defaultCopySuccess18nKey;
      const key = this.copySuccess18nKey || defaultKey;
      const message = this.name ? this.translateService.instant(key, { name: this.name }) : this.translateService.instant(key);
      this._showSuccessNotification(message);
    } else {
      this._showFailNotification(errMessage);
    }
  }


  private _showSuccessNotification(description: string) {
    this.notificationV2Service.success({
      title: this.translateService.instant('SUCCESS'),
      description: description
    });
  }

  private _showFailNotification(description: string) {
    this.notificationV2Service.error({
      title: this.translateService.instant('ERROR'),
      description: description
    });
  }

  /**
   * Fallback - Alternative method using the deprecated APIS,
   * only for case (virtual environment) where not
   * getting access to window.navigator.clipboard
   */
  private _alternativeToClipboard(data: string): boolean {

    let id = "eso_clipboard-textarea-hidden-id";
    let existsTextArea = document.getElementById(id);

    if (!existsTextArea) {

      let textArea = document.createElement("textarea");
      textArea.id = id;
      // Place in top-left corner of screen regardless of scroll position.
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '1px';
      textArea.style.height = '1px';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';

      textArea.style.background = 'transparent';

      document.querySelector("body").appendChild(textArea);
      // The text area now exists
      existsTextArea = document.getElementById(id);
    }

    const textAreaElement = existsTextArea as HTMLTextAreaElement;
    textAreaElement.value = data;
    textAreaElement.focus();
    textAreaElement.select();
    return document.execCommand('copy'); //NOSONAR - this is only fallback when no access to clipboard API
  }
}
