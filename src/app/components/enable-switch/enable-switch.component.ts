import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

/**
 * EUI SDK Switch component wrapped as a selector directive
 *
 * No code to revert switch state on fail as will refresh panel
 * containing component and get current server state
 */
@Component({
  selector: '[dnr-enable-switch]', /* Notice square brackets selector as directive !! */
  templateUrl: './enable-switch.component.html'
})
export class EnableSwitchComponent implements OnDestroy, AfterViewInit {

  /**
   * Boolean value of switch (e.g. false for disabled, true for enabled)
   */
  @Input() value: boolean;

  /**
   * Label for switch when "on" (default: "ENABLED")
   */
  @Input() onLabel?: string = 'ENABLED';

  /**
   * Label for switch when "off" (default: "DISABLED")
   */
  @Input() offLabel?: string = 'DISABLED';

  /**
   * Event emitter for switch change
   */
  @Output() switchChange = new EventEmitter<boolean>();

  switcher: any;
  eventId: string;

  constructor(
    readonly translateService: TranslateService,
  ) { }


  ngAfterViewInit() {
    this._initSwitcher();
  }

  /* seeing cannot set properties of null (setting 'on') resulting in unusable switcher
     so putting in a method called more than once */
  ngDoCheck() {
    if (!this.switcher) {
      this._initSwitcher();
    }
  }

  _initSwitcher() {
    this.switcher = document.querySelector('eui-switch');
    if (this.switcher){
      this.switcher.on = this.value;
      this.switcher.labelOn = this.translateService.instant(this.onLabel);
      this.switcher.labelOff = this.translateService.instant(this.offLabel);
      this.switcher.addEventListener('eui-switch:change', this.onSwitchChange.bind(this));
    }
  }

  ngOnDestroy() {
    this.switcher?.removeEventListener('eui-switch:change', this.onSwitchChange.bind(this));
    this.switcher = null;
  }

  onSwitchChange() {
      this.value = this.switcher.on;
      this.switchChange.emit(this.switcher.on);
  }
}
