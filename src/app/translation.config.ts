import { Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { LOCATION_INITIALIZED } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

/**
 * This factory creates an application initializer. It waits for the LOCATION_INITIALIZED token to be resolved using the Injector.
 * This ensures that Angular's location initialization process has completed before setting up the default language for translation.
 * Without this dr-ui was starting in Firefox browser without the dictionary being loaded.
 *
 * @param {TranslateService} translate - The TranslateService instance used for localization.
 * @param {Injector} injector - The Injector instance used for dependency injection.
 * @returns {Function} - An asynchronous function that initializes the application.
 * @throws {Error} - If an error occurs during initialization.
 */
export function ApplicationInitializerFactory(
  translate: TranslateService, injector: Injector) {
  return async () => {
    // Ensure location initialization before proceeding
    await injector.get(LOCATION_INITIALIZED, Promise.resolve(null));

    // Set up default language and supported languages
    const defaultLang = 'en-US';
    translate.addLangs(['en-US', 'es-ES']);
    translate.setDefaultLang(defaultLang);

    try {
      // Use the default language for translation
      await translate.use(defaultLang).toPromise();
    } catch (err) {
      console.log(err);
    }
  };
}