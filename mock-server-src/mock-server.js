/**
 * Mock server for Design and Reconciliation based on the API endpoints defined in
 * dr-service repository (https://gerrit-gamma.gic.ericsson.se/#/admin/projects/ESOA/DR-Parent/com.ericsson.bos.dr/dr-service)
 * refer to schema:
 *
 * dr-service\eric-esoa-dr-api\src\main\resources\dr_v1.yaml
 *
 * To run the server see the README.md file
 */

require ('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser'); /* needed for payloads access */


const adminAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjphZG1pbiJdLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJkci1hZG1pbiIsImVtYWlsIjoiZHItYWRtaW5AZXJpY3Nzb24uY29tIn0.IeN9tm0PAq5Gi7iTPRlswvg6qXt8XB_rgs3CXERBXBs';
const readWriteAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjpyZWFkZXIiLCJlcmljLWJvcy1kcjp3cml0ZXIiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHItd3JpdGVyIiwiZW1haWwiOiJkci13cml0ZXJAZXJpY3Nzb24uY29tIn0.eTaa5yvFMDetLPKuFPLZWFlIJgw9ujOMZrva8W8Gyws';
const readOnlyAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2OTkwMDgyNjEsImdyb3VwcyI6WyJlcmljLWJvcy1kcjpyZWFkZXIiXSwicHJlZmVycmVkX3VzZXJuYW1lIjoiZHItcmVhZGVyIiwiZW1haWwiOiJkci1yZWFkZXJAZXJpY3Nzb24uY29tIn0.egmYT-fC1BU5zzAzw_NDjj_EjgwAdRNuQEnugD3kkbE';

const port = process.env.port || 8081;
const app = express();

/* routers */
const featurePacksRouter = require('./routes/featurePacksRouter');
const jobsRouter = require('./routes/jobsRouter');
const jobSchedulesRouter = require('./routes/jobSchedulesRouter');


/**
 * As per ReadMe - means have to refresh the browser to pick up the cookie (
 * and subsequent access for RBAC buttons)
 * @returns
 */
function _get_auth_id_token() {
  if (process.env.readOnly === 'true') {
    console.log('read only user cookie being set...');
    return readOnlyAuthToken;
  }
  if (process.env.admin === 'true') {
    console.log('super admin user cookie being set...');
    return adminAuthToken;
  }
  if (process.env.readWrite === 'true') {
    console.log('readwrite user cookie being set...');
    return readWriteAuthToken;
  }
  throw new Error('No user role specified - at least one of readOnly, admin or readWrite must be set to true');
}


app.listen(port, () => {
  /* eslint-disable-next-line */
  console.log( `Design and Reconciliation mock server is running on port http://localhost:${port} `);
  /* eslint-disable-next-line */
  console.log('Sample API endpoints  (as per route.rest):');
  console.log(`http://localhost:${port}/discovery-and-reconciliation/v1/feature-packs`)

});

// ------------------------------------------------------------
// Mocking server responses...
// ------------------------------------------------------------

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* Access (Authorization) Control simulating BAM proxy cookie which
   should be present in browser in real world before make any calls from APP

   (as only adding the cookie now here with no specific call for it,
    this means can not provide from this fake server until
    make a server call from the client - i.e will only see cookie present (and say
    dnr-writer as user name  - until launch UI and then refresh browser when in dev mode) */

app.use((req, res, next) => {
  res.cookie('auth_id_token', _get_auth_id_token(), { maxAge: 900000, httpOnly: false });
  next();
});

/**
 * Feature pack management API
 */
app.use('/discovery-and-reconciliation/v1/feature-packs', featurePacksRouter);

/**
 * Jobs management API
 */
app.use('/discovery-and-reconciliation/v1/jobs', jobsRouter);

/**
 * Job schedules management API
 */
app.use('/discovery-and-reconciliation/v1/job-schedules', jobSchedulesRouter);
