import { EventEmitter } from "@angular/core";
import { MatDialogConfig } from "@angular/material/dialog";
import { ReplaySubject } from "rxjs/internal/ReplaySubject";
import { of } from "rxjs";

export const Spies = {
  ConfigServiceSpy: {
    getServiceUrl: () => {
      return "";
    },
    LoadConfig: () => {
      return new Promise((resolve) => {
        return resolve("");
      });
    },
    getHost() {
      return "";
    }
  },
  NotificationV2ServiceSpy: jasmine.createSpyObj("NotificationV2Service", [
    "success",
    "error",
  ]),
  StoreSpy: jasmine.createSpyObj("Store", [
    "select",
    "lift",
    "dispatch",
    "next",
    "error",
    "complete",
    "addReducer",
    "removeReducer"
  ]),

  RouterSpy: jasmine.createSpyObj("Router", [
    "navigate",
    "root",
    "navigateByUrl",
    "createUrlTree",
    "routerState",
  ]),

  HttpClientSpy: jasmine.createSpyObj("HttpClient", ["get", "post"]),

  TranslateServiceSpy: {
    setDefaultLang: () => {
      // empty method okay (comment here for SONAR compliance)
    },
    getBrowserCultureLang: () => "en-US",
    getBrowserLang: () => "en-US",
    use: () => new ReplaySubject(1),
    instant: (key) => key,
    onLangChange: new EventEmitter<any>(),
    getDefaultLang: () => "en-US"
    //set: (key: string, value: string, lang?: string) => { },
  },
  ConfigModuleOptions: {
    defaultConfig: {},
    fetch: {
      headers: {},
      url: 'config.dev.json'
    },
    interceptor: {
      disable: false,
      blackList: ['.json', '.svg', '.png']
    },
    placeholders: {
      baseUrl: '*baseUrl*',
      baseContextNoUrl: '*baseContextNoUrl*',
      baseUrlNoContext: '*baseUrlNoContext*'
    },
    theme: {
      url: ''
    }
  }
}

export const themeData = [
  {
    name: 'Ericsson',
    font: 'item-1',
    branding: 'ericsson',
    style: 'light'
  },
  {
    name: 'Ericsson-test',
    font: 'item-2',
    branding: 'ericsson-test',
    style: 'light'
  },
  {
    name: 'Ericsson-Dark',
    font: 'item-3',
    branding: 'ericsson',
    style: 'dark'
  }
];

export const expectedData = [
  {
    value: 'Ericsson',
    label: 'Ericsson'
  },
  {
    value: 'Ericsson-test',
    label: 'Ericsson test'
  },
  {
    value: 'Ericsson-Dark',
    label: 'Ericsson Dark'
  }
];

export const configOptionsWithEmptyTheme = {
  theme: {
    url: ''
  }
};

export const configOptionsWithThemeSet = {
  theme: {
    url: './config/themes.json'
  }
};

export const configData = {
  api: {
    context: '',
    host: 'http://localhost',
    port: '8081'
  },
  authentication: {
    provider: '',
    providerOptions: {}
  },
  objectStorage: {
    provider: '',
    allowedFileExtensions: ['txt'],
    providerOptions: {}
  },
  baseContextNoUrl: '/',
  baseUrl: '',
  baseUrlNoContext: '',
  endpoints: {
    catalog: {
      context: '',
      host: '',
      port: ''
    }
  },
  i18n: {
    defaultLang: 'en-US',
    supportedLangs: [
      'en-US'
    ]
  },
  login: {
    context: 'auth',
    host: 'http://localhost',
    port: '4200'
  },
  loginUrl: 'http://localhost:4200/auth',
  runtimeProperties: {},
  defaultTheme: 'ericsson'
};


export class MatDialogMock {
  open(dialogConfig?: MatDialogConfig) {
    return {
      afterClosed: () => of(dialogConfig.data?.header === 'Continue?')
    };
  }
}
