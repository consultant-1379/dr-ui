import { Injectable } from '@angular/core';

/**
 * Cookie service to get cookies
 *
 * With BAM proxy, we only fetch the cookie,
 * all write handling and cookie maintenance is done by the proxy.
 */
@Injectable({
  providedIn: 'any'
})
export class CookiesService {

  /**
   * Get cookie string for cookie name or empty string if not found
   * @param {string} name   name of cookie
   * @returns {string}      cookie value
   */
  public getCookie(name: string): string {
    const ca: Array<string> = decodeURIComponent(document.cookie).split(';');
    const caLen: number = ca.length;
    const cookieName = `${name}=`;
    let c: string;

    for (let i = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return '';
  }
}
