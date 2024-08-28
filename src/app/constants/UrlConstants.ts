import { environment } from "src/environments/environment";

/* see erad ConfigModule */
export const baseContextNoUrl = environment.baseContextUrl;


/**
 * log out location for BAM proxy, when location is
 * encodeURIComponent(window.location.href)
 */
export const LOG_OUT_URI = '/sec/authn/v1/logout?origin={0}';

/**
   * Feature Packs
   *
   * GET        Returns a list of all the Feature Packs in the D&R framework.
   * POST       Uploads a new Feature Pack into the D&R framework.
   * PUT        Uploads an updated Feature Pack into the D&R framework, replacing the existing Feature Pack.
   */
export const FEATURE_PACKS_URL = `${baseContextNoUrl}/v1/feature-packs`;

/**
 * Feature Pack Details
 *
 * GET        Returns information about a given Feature Pack.
 * DELETE     Deletes a given Feature Pack from the D&R framework.
 * {0} - feature pack id
 */
export const FEATURE_PACK_WITH_ID_URL = `${baseContextNoUrl}/v1/feature-packs/{0}`;

/**
 * Applications Data
 *
 * GET        Returns the list of Applications in a Feature Pack.
 * {0} - feature pack id
 */
export const FEATURE_PACK_APPLICATIONS_URL = `${baseContextNoUrl}/v1/feature-packs/{0}/applications`;

/**
 * Application Details
 *
 * GET        Returns the Application configuration in a Feature Pack.
 * {0} - feature pack id
 * {1} - application config id
 */
export const FEATURE_PACK_APPLICATIONS_WITH_ID_URL = `${baseContextNoUrl}/v1/feature-packs/{0}/applications/{1}`;

/**
 * Input Configurations Data
 *
 * GET        Returns the list of Input Configurations in a Feature Pack.
 * {0} - feature pack id
 */
export const FEATURE_PACK_INPUT_CONFIGS_URL = `${baseContextNoUrl}/v1/feature-packs/{0}/input-configurations`;

/**
 * Input Configurations Details
 *
 * GET        Returns details of a Input Configuration in a Feature Pack.
 * {0} - feature pack id
 * {1} - input configuration id
 */
export const FEATURE_PACK_INPUT_CONFIGS_URL_WITH_ID_URL = `${baseContextNoUrl}/v1/feature-packs/{0}/input-configurations/{1}?evaluateFunctions=true`;

/**
 * GET: Download Feature Pack
 * {0} - feature pack id
 */
export const FEATURE_PACK_DOWNLOAD_WITH_ID_URL = '/discovery-and-reconciliation/v1/feature-packs/{0}/files';

/**
 * Discovery Jobs
 *
 * GET          Returns a list of all discovery Jobs.
 * POST         Creates a new discovery Job and executes the discovery.
 * DELETE       multi delete with filter query param) - e.g.
 *              DELETE /v1/jobs?filter=jobScheduleId=={0}
 *              DELETE /v1/jobs?filter=id==1,id==2,id==3
 *
 *
 */
export const DISCOVERY_JOBS_URL = `${baseContextNoUrl}/v1/jobs`;

/**
 * Discovery Job
 *
 * GET          Returns information about a given discovery Job.
 * DELETE       Deletes a given discovery Job.
 * {0} - job id
 */
export const DISCOVERY_JOB_WITH_ID_URL = `${baseContextNoUrl}/v1/jobs/{0}`;

/**
 * Discovered Objects
 *
 * GET          Returns the list of discovered objects associated with a Job.
 * {0} - job id
 */
export const DISCOVERED_OBJECTS_URL = `${baseContextNoUrl}/v1/jobs/{0}/discovered-objects`;

/**
 * Execute a Reconcile
 *
 * POST       Executes a Reconcile on the latest discovered objects.
 * {0} - job id
 */
export const RECONCILE_WITH_ID_URL = `${baseContextNoUrl}/v1/jobs/{0}/reconciliations`;

/**
 * Duplicate job
 * When you duplicate the original job will remain
 * and a new job will be created with the same name
 *
 * POST       Executes Job duplication
 * {0} - job id
 */
export const DUPLICATE_JOB_WITH_ID_URL = `${baseContextNoUrl}/v1/jobs/{0}/duplicate`;

/**
 * Job Schedules
 *
 * GET        Returns a list of all the Job Schedules.
 * POST       Create a job Schedule.
 */
export const JOB_SCHEDULES_URL = `${baseContextNoUrl}/v1/job-schedules`;

/**
 * Job Schedules Details
 *
 * GET        Returns information about a given Job Schedule.
 * DELETE     Deletes a given Job Schedule
 * PATCH      Enable/Disable a job schedule.
 * {0} - schedule id
 */
export const JOB_SCHEDULE_WITH_ID_URL = `${baseContextNoUrl}/v1/job-schedules/{0}`;
