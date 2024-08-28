import { ActivatedRouteSnapshot, CanActivate } from "@angular/router";

import { Injectable } from "@angular/core";
import { LOG_OUT_URI } from "./constants/UrlConstants";

/**
 * As per https://adp.ericsson.se/marketplace/authentication-proxy/documentation/2.2.0/dpi/api-documentation
 * want to logout to go to the following URL:
 *
 * paths: /sec/authn/v1/login?origin={originUrl}
 * where origin would be window.location.href (encoded) for application - e.g. feature pack page
 *
 * @see app.component.ts #onLogoutClicked for logout call
 * @see app-routing.module.ts for logout route
 */
@Injectable({
  providedIn: 'root',
})
export class LogoutRedirectGuard implements CanActivate {

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const queryParams = route.queryParamMap;
    const originUrl = queryParams.get('originUrl');

    if (originUrl) {
      const logoutURI = LOG_OUT_URI.replace('{0}', originUrl);  // already called encodeURIComponent on originUrl
      window.location.assign(logoutURI);
      return false; // Prevent default navigation
    }
    return true;
  }
}