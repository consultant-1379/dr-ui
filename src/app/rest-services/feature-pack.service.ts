import {
  FEATURE_PACKS_URL,
  FEATURE_PACK_APPLICATIONS_URL,
  FEATURE_PACK_APPLICATIONS_WITH_ID_URL,
  FEATURE_PACK_INPUT_CONFIGS_URL,
  FEATURE_PACK_INPUT_CONFIGS_URL_WITH_ID_URL,
  FEATURE_PACK_WITH_ID_URL
} from '../constants/UrlConstants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Application } from '../models/application.model';
import { ApplicationItemsResponse } from '../models/application-items-response.model';
import { FeaturePackDetailsResponse } from '../models/feature-pack-details-response.model';
import { FeaturePackItemsResponse } from '../models/feature-pack-items-response.model';
import { Injectable } from '@angular/core';
import { InputConfigurationDetails } from '../models/input-configuration-details.model';
import { InputConfigurationsItemsResponses } from '../models/input-configurations-items-response.model';
import { Observable } from 'rxjs';
import { QueryParams } from '../models/query.params.model';
import { addQueryParamsToUrl } from './query-utils';

@Injectable({
  providedIn: 'root'
})
export class FeaturePackService {

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache'
  });

  constructor(private http: HttpClient) { }

  getItems(query : QueryParams = {}) : Observable<FeaturePackItemsResponse> {
    const url = addQueryParamsToUrl(FEATURE_PACKS_URL, query);
    return this.http.get<FeaturePackItemsResponse>(url, { headers: this.headers });
  }

  /**
   * Gets all feature packs without any offset or limit
   * e.g. supporting display of all feature packs in a dropdown
   */
  getAllFeaturePacks() : Observable<FeaturePackItemsResponse> {
    return this.getItems();
  }

  getFeaturePackById(id: string): Observable<FeaturePackDetailsResponse> {
    const url = FEATURE_PACK_WITH_ID_URL.replace('{0}', id);
    return this.http.get<FeaturePackDetailsResponse>(url, { headers: this.headers });
  }

  uploadFeaturePack(name: string, description: string, file: File): Observable<FeaturePackDetailsResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('description', description);

    const headers = this._createFileHeaders(file);
    return this.http.post<FeaturePackDetailsResponse>(FEATURE_PACKS_URL, formData, headers);
  }

  updateFeaturePack(id: string, description: string, file: File): Observable<FeaturePackDetailsResponse> {
    const url = FEATURE_PACK_WITH_ID_URL.replace('{0}', id);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);

    const headers = this._createFileHeaders(file);
    return this.http.put<FeaturePackDetailsResponse>(url, formData, headers);
  }

  _createFileHeaders(file: File) {
    // When the HttpClient.post sends a FormData object, the HttpClient automatically
    // sets the appropriate Content-Type header for you.
    // The default Content-Type for a FormData object is 'multipart/form-data',
    // which is suitable for sending binary data, such as files.
    // HttpClient will also automatically set the required 'boundary' value in the Content-Type.
    // The 'boundary' is used to separate each name-value pair in the content.
    const headers = new HttpHeaders()
      .append('Content-Disposition', 'attachment; filename=' + file.name);

    return { headers };
  }

  deleteFeaturePack(id: string): Observable<any> {
    const url = FEATURE_PACK_WITH_ID_URL.replace('{0}', id);
    return this.http.delete<any>(url, { headers: this.headers });
  }

  getApplications(id: string, query: QueryParams = {}) : Observable<ApplicationItemsResponse> {
    let url = FEATURE_PACK_APPLICATIONS_URL.replace('{0}', id);
    url = addQueryParamsToUrl(url, query);
    return this.http.get<ApplicationItemsResponse>(url, { headers: this.headers });
  }

  getApplication(featureId: string, appId: string) : Observable<Application> {
    const url = FEATURE_PACK_APPLICATIONS_WITH_ID_URL.replace('{0}', featureId).replace('{1}', appId);
    return this.http.get<Application>(url, { headers: this.headers });
  }

  getInputConfigurations(id: string, query: QueryParams = {}) : Observable<InputConfigurationsItemsResponses> {
    let url = FEATURE_PACK_INPUT_CONFIGS_URL.replace('{0}', id);
    url = addQueryParamsToUrl(url, query);
    return this.http.get<InputConfigurationsItemsResponses>(url, { headers: this.headers });
  }

  getInputConfiguration(featureId: string, appId: string) : Observable<InputConfigurationDetails> {
    const url = FEATURE_PACK_INPUT_CONFIGS_URL_WITH_ID_URL.replace('{0}', featureId).replace('{1}', appId);
    return this.http.get<InputConfigurationDetails>(url, { headers: this.headers });
  }
}
