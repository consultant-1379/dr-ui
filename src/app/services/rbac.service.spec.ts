import { ConfigLoaderService, ConfigLoaderServiceMock } from '@erad/core';

import { RbacService } from './rbac.service';
import { TestBed } from '@angular/core/testing';

describe('RbacService', () => {
  let service: RbacService;
  let configLoaderService: ConfigLoaderService;

  // tokens containing a "groups" key and a "preferred_username" key (parse in jwt.io for content)
  const adminAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjphZG1pbiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkci1hZG1pbiIsImVtYWlsIjoiZHItYWRtaW5AZXJpY3Nzb24uY29tIn0.IeN9tm0PAq5Gi7iTPRlswvg6qXt8XB_rgs3CXERBXBs';
  const readWriteAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjpyZWFkZXIiLCJlcmljLWJvcy1kcjp3cml0ZXIiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHItd3JpdGVyIiwiZW1haWwiOiJkci13cml0ZXJAZXJpY3Nzb24uY29tIn0.eTaa5yvFMDetLPKuFPLZWFlIJgw9ujOMZrva8W8Gyws';
  const readOnlyAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjpyZWFkZXIiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHItcmVhZGVyIiwiZW1haWwiOiJkci1yZWFkZXJAZXJpY3Nzb24uY29tIn0.egmYT-fC1BU5zzAzw_NDjj_EjgwAdRNuQEnugD3kkbE';
  const noGroupToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjp1bmtub3duIl0sInByZWZlcnJlZF91c2VybmFtZSI6ImRyLXVua25vd24iLCJlbWFpbCI6ImRyLXVua25vd25AZXJpY3Nzb24uY29tIn0.aHubghV4OBP2nGNmvWviwb0ifDeeVz_RhKG74_5VkJQ'


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: ConfigLoaderService,
          useClass: ConfigLoaderServiceMock
        }
      ]
    });
    configLoaderService = TestBed.inject(ConfigLoaderService);
    service = TestBed.inject(RbacService);
    service.parsedToken = null;
    service.preferredUserName = '';
    service.groups = [];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isReadOnly method should return true if user is in reader group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readOnlyAuthToken);
    expect(service.isReadOnly()).toBe(true);
  });

  it('isReadOnly method should return false if user is in writer group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readWriteAuthToken);
    expect(service.isReadOnly()).toBe(false);
  });

  it('isReadOnly method should return false if in super admin group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(adminAuthToken);
    expect(service.isReadOnly()).toBe(false);
  });

  it('isReadWrite method should return true if user is in writer group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readWriteAuthToken);
    expect(service.isReadWrite()).toBe(true);
  });

  it('isReadWrite method should return false if user is in reader group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readOnlyAuthToken);
    expect(service.isReadWrite()).toBe(false);
  });

  it('isReadWrite method should return true if in super admin group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(adminAuthToken);
    expect(service.isReadWrite()).toBe(true);
  });

  it('hasValidRoles should be true if in reader group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readOnlyAuthToken);
    expect(service.hasValidRoles()).toBe(true);
  });

  it('hasValidRoles should be true if in writer group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(readWriteAuthToken);
    expect(service.hasValidRoles()).toBe(true);
  });

  it('hasValidRoles should be true if in super admin group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(adminAuthToken);
    expect(service.hasValidRoles()).toBe(true);
  });

  it('hasValidRoles should be false if in neither group', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(noGroupToken);
    expect(service.hasValidRoles()).toBe(false);
  });

  it('getPreferredUserName should return expected writer username', () => {

    spyOn(service.cookieService, 'getCookie').and.returnValue(readWriteAuthToken);
    expect(service.getPreferredUserName()).toEqual('dr-writer');
  });

  it('getPreferredUserName should return expected reader username', () => {

    spyOn(service.cookieService, 'getCookie').and.returnValue(readOnlyAuthToken);
    expect(service.getPreferredUserName()).toEqual('dr-reader');
  });

  it('getPreferredUserName should return expected super admin username', () => {
    spyOn(service.cookieService, 'getCookie').and.returnValue(adminAuthToken);
    expect(service.getPreferredUserName()).toEqual('dr-admin');
  });

  it('should use different group key when groupClaim loaded via config.json', () => {

    spyOn(configLoaderService, 'getRuntimePropertiesInstant').and.returnValue({
      groupClaim: 'otherGroupKey'
    });

    // will no longer be able to use this token as has "groups" key
    spyOn(service.cookieService, 'getCookie').and.returnValue(readWriteAuthToken);

    expect(service.hasValidRoles()).toBe(false);
    expect(service._getGroupsKey()).toEqual('otherGroupKey');
  });
});
