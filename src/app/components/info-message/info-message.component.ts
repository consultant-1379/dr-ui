import { Component, Input, OnInit } from '@angular/core';

import { IconSize } from './icon-size.enum';

/**
 * Information display containing
 * - a top icon (if it is a "dial" it will be animated to rotate)
 * - a title text with an icon (default info)
 * - a message (as a subtitle if the title is present)
 *
 * Currently suitable for large text.
 * Suitable for smaller text if message only if passed
 * (but no functionality to put an icon with the message  (it goes with the title))
 */

@Component({
  selector: 'dnr-info-message',
  templateUrl: './info-message.component.html',
  styleUrls: ['./info-message.component.scss'],
})
export class InfoMessageComponent implements OnInit {

  @Input() topIconName: string = 'dial';
  @Input() showTopIcon: boolean = false;
  @Input() topIconSize: IconSize | string = IconSize.large;

  @Input() title: string;
  @Input() titleIconSize: IconSize | string;
  @Input() titleIconName: string = 'info';

  @Input() message: string;


  ngOnInit(): void {
    this.titleIconSize = this.titleIconSize || this._getTitleIconSize();
  }

  _getTitleIconSize(): string {
    return (this.showTopIcon && this.topIconSize === IconSize.large) ? IconSize.medium : IconSize.small;
  }
}
