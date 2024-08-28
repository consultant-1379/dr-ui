import { ConfigLoaderService } from '@erad/core';
import { CookiesService } from './cookie.service';
import { Injectable } from '@angular/core';
import { authConstants } from '../constants/app.constants';

/**
 * Role base access (RBAC) service to check user group membership
 * (read/write access to expected groups) and preferred user name (for display) based on
 * access Json Web Token information.
 *
 * Not reading 'auth_access_token' cookie as apparently it is too slow to be available, instead recommendation is
 * to use 'auth_id_token' cookie which is available immediately.
 *
 * Sample auth_id_token tokens are shown in mock server - ultimately will
 * be pulling out a section like this (for writer):
 *
 * {
 *  { "alg": "HS256", "typ": "JWT}   // header
 *  ...
 * "groups": [
 *  "eric-bos-dr:reader",
 *  "eric-bos-dr:writer"
 * ],
 * "preferred_username": "dr-user",
 * ...
 * }
 *
 * The "groups" key is configurable in conf.prod.json (groupClaim) and we
 * default to "groups
 */

@Injectable({
  providedIn: 'root'
})
export class RbacService {

  groups: string[] = [];
  preferredUserName: string = '';
  parsedToken: Object = null;

  constructor(
    readonly cookieService: CookiesService,
    readonly configLoaderService: ConfigLoaderService,
  ) { }


  isAdmin(): boolean {
    return this._readGroups().includes(authConstants.admin_group_name)
  }

  isReadOnly(): boolean {
    return this._readGroups().includes(authConstants.reader_group_name) && !this._readGroups().includes(authConstants.writer_group_name);
  }

  isReadWrite(): boolean { /* assume both writer and super admin user can both read and write */
    return this._readGroups().includes(authConstants.writer_group_name)
     || this._readGroups().includes(authConstants.admin_group_name);
  }

  hasValidRoles(): boolean {
    return this._readGroups().includes(authConstants.admin_group_name)
      || this._readGroups().includes(authConstants.reader_group_name)
      || this._readGroups().includes(authConstants.writer_group_name);
  }

  getPreferredUserName(): string {
    if (!this.preferredUserName){
      const parsedToken: Object = this._getParsedAccessToken();
      if (parsedToken) {
        this.preferredUserName = parsedToken[authConstants.preferred_username_key];
      }
    }
    return this.preferredUserName;
  }

  private _readGroups(): string[] {
    /* cache roles */
    if (this.groups.length === 0) {
      const parsedToken: Object = this._getParsedAccessToken();
      if (parsedToken) {
        this.groups = parsedToken[this._getGroupsKey()] || [];
      }
    }
    return this.groups;
  }

  _getGroupsKey(): string {
    const runtimeProperties = this.configLoaderService.getRuntimePropertiesInstant();
    const configuredKey = runtimeProperties?.groupClaim;
    return configuredKey || authConstants.groups_key;
  }

  private _getParsedAccessToken(): Object {

    if (!this.parsedToken) {
      const cookieString: string = this.cookieService.getCookie(authConstants.auth_id_cookie_token_key_name);
      if (cookieString) {
        try {
          // [1] as not interested in header
          this.parsedToken = JSON.parse(window.atob(cookieString.split('.')[1]));
        } catch (e) {
          this.parsedToken = null;
        }
      }
    }

    return this.parsedToken;
  }
}
