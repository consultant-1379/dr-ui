const util = require('util');
const { getIndexedId } = require('../utils/Utils.js');
const codes = require('../constants/statusCodes.js');
const { throwAnErrorToUI } = require('../utils/ErrorGenerator.js');
const jobDetailData = require('../data/JobData.js');
const baseData = require('../data/JobSummaryData.js');
const discoveredObjectsData = require('../data/DiscoveredObjectData.js');

const DataGenerator = require('../utils/TableDataGenerator.js');

const discoveredObjectStatuses = ['NEW', 'DISCOVERED', 'RECONCILING', 'RECONCILE_FAILED', 'RECONCILED'];
const jobStatuses = ['NEW', 'DISCOVERY_INPROGRESS', 'DISCOVERY_FAILED', 'DISCOVERED', 'RECONCILE_REQUESTED', 'RECONCILE_INPROGRESS', 'PARTIALLY_RECONCILED', 'COMPLETED'];

function _getDataGenerator() {
  if (!this.jobsGenerator) {
    const generateScheduleId = function (record) {
      if (Math.random() > 0.5) {
        // jobScheduleId present only if job was created by schedule.
        // (ideally want an id here that is present in the schedule table data)
        record.jobScheduleId = (Math.floor(Math.random() * 10) + 1).toString();
      } else {
        delete record.jobScheduleId;
      }
      return record;
    };
    this.jobsGenerator = new DataGenerator(baseData, 41, generateScheduleId);
  }
  return this.jobsGenerator;
}

function updateDiscoveredObjectData(rowData, i) {
  rowData.objectId = getIndexedId();
  rowData.discrepancies = rowData.discrepancies.map((d) => d += ' ' + i);
  return rowData;
}

function _getDiscoveredObjectsDataGenerator() {
  if (!this.discoveredObjectsGenerator) {
    this.discoveredObjectsGenerator = new DataGenerator(discoveredObjectsData, 50, (data, i) => updateDiscoveredObjectData(data, i));
  }
  return this.discoveredObjectsGenerator;
}

/**
 * Get paginated table data for Jobs pack with items and totalCount
 *
 * @param {*} req  request obj   FIQL requests for filtering and sorting - though potentially just sort
 *                               (potentially without offSet and limit)
 * @param {*} res  response obj
 */
function getJobs(req, res) {
  console.log(`Jobs Controller: GET: ${decodeURI(util.inspect(req.originalUrl))}`);
  const tableDataGenerator = _getDataGenerator();
  const jobResults = tableDataGenerator.getData(req.query);

  console.log(`Jobs results result total ${jobResults.totalCount}`);

  jobResults.items.forEach((job) => {
    if (!req.query.filters || req.query.filters.indexOf('status') < 0) {
      job.status = _generateStatus();
    }

    // job1-definition, job2-definition as defined in ApplicationSingleData.js
    job.applicationJobName = ['job1-definition', 'job2-definition'][Math.floor(Math.random() * 2)];
  });

  /* object with values items and totalCount keys */
  setTimeout(() => {
    res.json(jobResults);
    // This simulates that the jobs may not be instantly available.
  }, Math.random(1000));
}

function createDiscoveryJob(req, res) {

  console.log(`Jobs Controller: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
  console.log(`Request body: ${util.inspect(req.body)}`);
  _createJob(jobDetailData, req, res);
}

function duplicateJob(req, res) {
  console.log(`Jobs Controller: (duplicate job) POST: ${decodeURI(util.inspect(req.originalUrl))}`);
  const foundRecord = _getDataGenerator().find('id', req.params.id);
  if (!foundRecord) {
    throwAnErrorToUI(res, 404, 'DR-17', `Job with id: '${req.params.id}' does not exist.`);
    return;
  }
  _createJob(foundRecord, req, res);
}

function _createJob(baseData, req, res) {
  const tableDataGenerator = _getDataGenerator();
  const jobData = { ...baseData };
  jobData.id = getIndexedId();

  if (req.body.name) {
    jobData.name = req.body.name;
    jobData.description = req.body.description;
    jobData.featurePackId = req.body.featurePackId;
    jobData.applicationId = req.body.applicationId;
    jobData.applicationJobName = req.body.applicationJobName;
    jobData.inputs = req.body.inputs;
  }
  jobData.startDate = new Date().toISOString();
  jobData.inProgressStartTime = new Date().toISOString();
  jobData.status = "NEW";

  for (const [key, value] of Object.entries(jobData)) {
    if (!value && key !== 'description') {
      throwAnErrorToUI(res, 500, 'DR-16', `Mandatory inputs '${key}' are missing'`);
      return;
    }
  }
  console.log(`Jobs Controller: NEW JOB ID: ${jobData.id}`);
  this.inProgressJob = jobData;

  tableDataGenerator.addNewData(jobData);
  res.status(codes.ACCEPTED).json({ id: jobData.id });  // swagger has a 202 for create
}

function getJobById(req, res) {

  console.log(`Jobs Controller: (single by id) GET: ${decodeURI(util.inspect(req.originalUrl))}`);
  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);
  console.log(`Jobs Controller: found record ${util.inspect(foundRecord)}`);

  if (foundRecord) {
    const jobData = { ...jobDetailData };
    jobData.id = req.params.id;
    jobData.name = foundRecord.name;
    jobData.description = foundRecord.description;
    jobData.featurePackId = foundRecord.featurePackId;
    jobData.featurePackName = foundRecord.featurePackName;
    jobData.applicationId = foundRecord.applicationId;
    jobData.applicationName = foundRecord.applicationName;
    jobData.applicationJobName = ['job1-definition', 'job2-definition'][Math.round(Math.random(1))];
    jobData.startDate = foundRecord.startDate;
    jobData.completedDate = foundRecord.completedDate;
    jobData.status = foundRecord.status;
    jobData.jobScheduleId = foundRecord.jobScheduleId;

    if (jobData.status !== 'DISCOVERY_FAILED') {
      delete jobData.errorMessage;
    }
    console.log(`Jobs Controller: found record ${util.inspect(jobData)}`);

    res.json(jobData);
  } else {
    throwAnErrorToUI(res, 404, 'DR-17', `Job with id: '${req.params.id}' does not exist.`);
  }
}

function deleteJob(req, res) {
  console.log(`Jobs Controller: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
  const isForceDelete = req.headers['force'] === 'true';
  console.log(`Jobs Controller: DELETE: isForceDelete: ${isForceDelete}`);

  const foundRecord = _getDataGenerator().find('id', req.params.id);
  if (foundRecord) {
    console.log(`Jobs Controller: found record ${util.inspect(foundRecord)}`);
    if (isForceDelete || _isDeletable(foundRecord.status)) {
      const result = _getDataGenerator().delete(req.params.id);
      if (result) {
        console.log(`Delete was successful: ${result}`);
        res.status(codes.NO_CONTENT).send();
      } else {
        console.log(`Delete failed (not found): ${result}`);
        res.status(codes.NOT_FOUND).send();
      }
    } else {
      throwAnErrorToUI(res, 500, 'DR-18', `Job with id '${req.params.id}' can not be deleted as it has status '${foundRecord.status}'.`);
    }
  } else {
    throwAnErrorToUI(res, 404, 'DR-17', `Job with id: '${req.params.id}' does not exist.`);
  }
}

/**
 * Delete using filter, for example
 * DELETE http://dr.docker.localhost/discovery-and-reconciliation/v1/jobs?filters=name==*test*
 * DELETE http://dr.docker.localhost/discovery-and-reconciliation/v1/jobs?filters=jobScheduleId==73
 *
 * and OR filters using id for multiple delete
 *
 * DELETE v1/jobs?filters=id==12,id==7,id==36,id==6
 */
function deleteJobs(req, res) {
  console.log(`Jobs Controller: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);

  if (!!req.query.filters) {
    let filteredItems = {};

    if (req.query.filters.indexOf("id") !== -1) {
      const ids = _extractIdsFromCommaFiql(req.query.filters);
      filteredItems.items = [];
      ids.forEach((id) => filteredItems.items.push({id}));
    } else {
      filteredItems = _getDataGenerator().getData(req.query);
    }

    if (filteredItems.items?.length > 0) {
      deleteJobsUsingFilters(filteredItems.items, res);
    } else {
      // no real server error for this case
      console.log(`Jobs Controller: No jobs found for the given filter criteria`);
      res.status(codes.OK).send({ "deleted": 0 });
    }
  } else {
    console.log(`Jobs Controller: DELETE: No filters provided`);
    throwAnErrorToUI(res, 404, 'DR-500', `No filters provided for delete.`);
  }
};

/**
 * Extract from FIQL OR list of ids
 * @param {*} filterString e.g. id==12,id==7,id==36,id==6
 * @returns  array of id values
 */
function _extractIdsFromCommaFiql(filterString) {

  return filterString.split(',')
    .map(keyPair => keyPair.split('==')[1]);
}

function deleteJobsUsingFilters(foundFilterItems, res) {
  let deleteCount = 0;
  try {
    foundFilterItems.forEach((item) => {
      if (_isDeletable(item.status)) {
        const result = _getDataGenerator().delete(item.id);
        if (result){
          console.log(`deleteJobsUsingFilters: Delete job with id '${item.id}' was successful: ${result}`);
          deleteCount++;
        } else {
          console.log(`deleteJobsUsingFilters: Delete job with id '${item.id}' failed (not found): ${result}`);
        }
      } else {
        console.log(`deleteJobsUsingFilters: Job with id '${item.id}' can not be deleted as it has status '${item.status}'.`);
      }
    });
  } catch (error) {
    console.log(`deleteJobsUsingFilters: failed '${error}'.`);
    throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: '${error}'.`);
  }
  console.log(`Jobs Controller: DELETE: ${deleteCount} jobs deleted`);
  res.status(codes.OK).send({ "deleted": deleteCount});
}

function getDiscoveredObjects(req, res) {
  console.log(`Jobs Controller: (discovered objects) GET: ${decodeURI(util.inspect(req.originalUrl))}`);

  const foundRecord = _getDataGenerator().find('id', req.params.id);

  if (!foundRecord) {
    throwAnErrorToUI(res, 404, `Job with id: '${req.params.id}' does not exist.`);
  }

  if (_isJobInProgress(req.params.id, this.inProgressJob)) {
    if (_inProgressJobDelayExpired(foundRecord)) {
      this.inProgressJob = null;
      foundRecord.inProgressStartTime = null;
      foundRecord.status = (foundRecord.status === 'NEW') ? 'DISCOVERED' : 'COMPLETED';

    } else if (foundRecord.status === 'NEW') {
      // For a newly created Job, return inprogress or item count of 0 for the a short time after the job creation.
      const result = { items: [], totalCount: 0 };
      setTimeout(() => {
        res.json(result);
        // This simulates that the discovered objects may not be instantly available.
      }, Math.random(1000));
      return;
    }
  }

  const discoveredObjGenerator = _getDiscoveredObjectsDataGenerator();
  const results = discoveredObjGenerator.getData(req.query);

  results.items.forEach((obj) => {
    obj.status = _generateStatus(discoveredObjectStatuses);
    delete obj.id; // id attr is objectId
    /* populate the overall ("outer") errorMessage in the object (as apposed to errorMessages in the filters) */
    obj.errorMessage = obj.status === 'RECONCILE_FAILED' ? "An I/O error occurred during reconcile enrichment" : '';

  });
  console.log(`Discovered objects results result total ${results.totalCount}`);

  setTimeout(() => {
    /* object with values items and totalCount keys */
    res.json(results);
    // This simulates that the discovered objects may not be instantly available.
  }, Math.random(1000));
}

function executeReconcile(req, res) {
  /* different bodies would be passed for Perform reconcile on all discovered objects and
     and Perform reconcile on selected discovered objects */

  console.log(`Jobs Controller: (execute reconcile) POST: ${decodeURI(util.inspect(req.originalUrl))}`);

  const requestBody = req.body;

  const numberOfKeys = Object.keys(requestBody).length;
  console.log(`Request body: ${util.inspect(requestBody)}, \ni.e. has ${numberOfKeys} keys`);

  const foundRecord = _getDataGenerator().find('id', req.params.id);
  if (!foundRecord) {
    throwAnErrorToUI(res, 404, `Job with id: '${req.params.id}' does not exist.`);
    return;
  }

  // Force failure if first reconcile input = fail
  if (requestBody?.inputs?.reconcileInput1 === 'fail') {
    throwAnErrorToUI(res, 500, 'DR-11', `The request body is not valid: '${util.inspect(requestBody)}'`);
  }

  /* add some very basic validation */
  if (numberOfKeys === 1 && 'inputs' in requestBody) {
    console.log("Jobs Controller: reconcile ALL discovered objects - accepted request");
    _startReconcile(foundRecord);
    this.inProgressJob = foundRecord;
    res.status(codes.ACCEPTED).send();
  } else if (numberOfKeys === 2 && 'inputs' in requestBody && 'objects' in requestBody) {
    console.log("Jobs Controller: reconcile selected discovered objects - accepted request");
    _startReconcile(foundRecord);
    this.inProgressJob = foundRecord;
    res.status(codes.ACCEPTED).send();
  } else {
    throwAnErrorToUI(res, 500, 'DR-11', `The request body is not valid: '${util.inspect(requestBody)}'`);
    return;
  }
}

function _startReconcile(foundRecord) {
  foundRecord.inProgressStartTime = new Date().toISOString();
  foundRecord.status = "RECONCILE_INPROGRESS";
}

function _generateStatus(statuses = jobStatuses) {
  const randomIndex = Math.floor(Math.random() * statuses.length);
  return statuses[randomIndex];
}

function _isDeletable(status) {
  return typeof status == 'undefined' || !status.includes('INPROGRESS');
}

function _isJobInProgress(jobId, inProgressJob) {
  return (jobId === inProgressJob?.id);
}

function _inProgressJobDelayExpired(job) {
  const startTimeInMilliseconds = new Date(job.inProgressStartTime);
  return (Date.now() - startTimeInMilliseconds > 30000);
}

module.exports = {
  getJobs,
  createDiscoveryJob,
  getJobById,
  deleteJob,
  deleteJobs,
  getDiscoveredObjects,
  executeReconcile,
  duplicateJob,
};
