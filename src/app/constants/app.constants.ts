/**
 * Application Constants
 */

export const AppConstants = {
    discoveredObjectsPolling: 30000,
    defaultLanguage: 'en-US', /* as opposed to es-ES */
    maxShortCharLength: 256,
    maxLargeCharLength: 1000,
    allFilterValue: 'all',
    undefinedDisplayValue: '-- --',
    pageEntries:[   /* pagination pageEntries options */
        { value: 10, label: '10', checked: true },
        { value: 20, label: '20' },
        { value: 50, label: '50' },
        { value: 100, label: '100' }
    ],
    defaultQueryParams: {
      limit: 10,
      offset: 0,
    },
    scaledLimitParams: {
      offset: 0,
      limit: 200,
    },
    colors: {
        black: '#242424',
        blue: '#0069C2',
    },
}

export const validationConstants = {
    maxShortCharLength: 256,
    maxLargeCharLength: 1000,
    invalidInputCharDisplay:'<, >, &',  /* to match safeStringPattern below */
    safeStringPattern: '^[^<>&]*$',
    validNumber: '^[0-8]?[0-9]{1,18}$', // less than 8999999999999999999
    springCronSpacingPattern: '^([^ ]+ ){5}[^ ]+$'
}

export const authConstants = {
    auth_id_cookie_token_key_name: 'auth_id_token',
    admin_group_name: 'eric-bos-dr:admin',
    reader_group_name: 'eric-bos-dr:reader',
    writer_group_name: 'eric-bos-dr:writer',
    groups_key: 'groups', // fallback key (if not available from groupClaim in conf.prod.json lookup - ref docker-entrypoint.sh)
    preferred_username_key: 'preferred_username',
}

export const ServerErrors = {
  FP_NAME_ALREADY_EXISTS_ERROR_CODE: 'DR-10'
}

export const sessionStorageKeys = {
  jobScheduleId: 'jobScheduleId',
  featurePackId: 'featurePackId',
  tabSessionStoragePrefix:'tab_', /* prefix for tab session storage keys */
}


/**
 * keys here will be added to local storage
 * On UI version upgrade will look to clear
 * these from local storage (they will have version,
 * or some number, appended to them)
 */
export const localStorageKeys = {
  FP_TABLE_SETTINGS: 'dnr:fp-table_',
  JOBS_TABLE_SETTINGS: 'dnr:jobs_table_',
  SCHEDULES_TABLE_SETTINGS: 'dnr:schedules_table_',
  DISCOVERY_OBJECTS_LIMIT: 'dnr:discovery_table_',
  JUNIT1: 'dnr:junit1',
  JUNIT2: 'dnr:junit2',
}
