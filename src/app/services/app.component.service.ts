import { Injectable } from '@angular/core';
import { RoutingPathContent } from '../enums/routing-path-content.enum';

// TODO AppComponentService (generic name) is only being used currently for a breadcrumb utility,
// i.e. lets revisit and see
// why is this a service at all? It could be a util. It has no dependencies injected or anything..
@Injectable({
  providedIn: 'root',
})
export class AppComponentService {
  toolbarBreadcrumb: any[];

  /**
   * Fetches the breadcrumb to use based on the current url value
   * @param encodedUrl  - encoded url, e.g. /app-item-detail-view%3Ftype%3DJobs?id=1234
   * @param labels      - object of labels to use for the breadcrumb
   * @returns           - breadcrumb to use or empty array if no match
   */
  getBreadcrumb(encodedUrl: string, labels: {
    jobsDetailLabel: string,
    featurePacksDetailLabel: string,
    browseLabel: string
  }) {

    const { jobsDetailLabel, featurePacksDetailLabel, browseLabel } = labels;

    const url = decodeURIComponent(encodedUrl);
    this.toolbarBreadcrumb = [{ label: browseLabel }];
    if (url.includes(RoutingPathContent.JobDetail)) {
      this.toolbarBreadcrumb.push({ label: jobsDetailLabel });
    } else if (url.includes(RoutingPathContent.FeaturePackDetail)) {
      this.toolbarBreadcrumb.push({ label: featurePacksDetailLabel });
    }
    return this.toolbarBreadcrumb;
  }
}
