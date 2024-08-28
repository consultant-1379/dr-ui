import { AppConstants } from '../constants';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

/**
 * This service is used to format dates
 */

@Injectable({
  providedIn: 'root',
})
export class DateUtilsService {

  constructor(readonly datePipe: DatePipe) { }

  /**
   * This will return the formatted date and time in format
   * required by UX
   * (generally used in this application)
   *
   * @param date the date from server, expected to be
   *             a ISO 8601 formatted date with zero offset from UTC (regardless
   *             of server location), e.g. 2024-04-15T17:43:03.534Z
   *
   * @returns the formatted date and time, in client time zone
   *          "15 Apr 2024, 17:43"  (or if browser in say UTC + 3.00 time zone, then 20:43)
   */
  dateTimeFormat(date: string): string {
    if (date) {
       // medium time and date format defined in pipe
       return this.datePipe.transform(this._gmtToTimeZoneFormat(date), 'd MMM y, HH:mm:ss');
    }
    return AppConstants.undefinedDisplayValue;
  }

  /**
   * GMT to TimeZone Converter
   * This will convert your date based upon the string type
   * @param date the date to format
   * @returns the Mozilla accepted formatted date
   */
  private _gmtToTimeZoneFormat(date: string) {

    if (this._isFirefox()) {
      // TODO eeicmsy test with firefox with real server data for date - to see if this is actually needed now!
      return typeof date === 'string' ? date.replace(' ', 'T').replace(' GMT', ':00Z') : date;
    }
    return date;
  }

  _isFirefox(): boolean {
    return navigator.userAgent.indexOf('Firefox') != -1;
  }

}
