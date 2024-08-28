/* eslint-disable no-use-before-define */
/**
 * Controller class for Job Schedules API
 */
const util = require('util');

const { getIndexedId } = require('../utils/Utils.js');
const codes = require('../constants/statusCodes.js');
const { throwAnErrorToUI } = require('../utils/ErrorGenerator.js');
const baseData = require('../data/JobScheduleSummaryData.js');
const DataGenerator = require('../utils/TableDataGenerator.js');

function _getDataGenerator() {
  if (!this.schedulesGenerator) {
    this.schedulesGenerator = new DataGenerator(baseData, 41);
  }
  return this.schedulesGenerator;
}

/**
 * Get paginated table data for Job Schedules with items and totalCount
 *
 * @param {*} req  request obj   FIQL requests for filtering and sorting
 * @param {*} res  response obj
 */
function getJobSchedules(req, res) {
  console.log(`Job Schedules Controller: GET: ${decodeURI(util.inspect(req.originalUrl))}`);
  const tableDataGenerator = _getDataGenerator();
  const jobScheduleResults = tableDataGenerator.getData(req.query);

  console.log(`Job Schedules results result total ${jobScheduleResults.totalCount}`);

  /* object with values items and totalCount keys */
  setTimeout(() => {
    res.json(jobScheduleResults);
  }, Math.random(1000));
}

function addJobSchedule(req, res) {

  console.log(`Job Schedules Controller: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
  console.log(`Request body: ${util.inspect(req.body)}`)

  const tableDataGenerator = _getDataGenerator();

   // name does need to be unique
  if (tableDataGenerator.getData({}).items.some((i) => i.name === req.body.name)) {
    throwAnErrorToUI(res, 409, 'DR-39', `Job schedule with name '${req.body.name}' already exists'`);
    return;
  }

  console.log(`limited checking of cron expression ${req.body.expression}`);

  if (!_isValidCronExpression(req.body.expression)) {
    throwAnErrorToUI(res, 400, 'DR-40', `Cron expression '${req.body.expression}' is not valid. The expression takes 6 fields (second, minute, hour, day, month, and weekday), e.g '*/30 * * * * *'."'`);
    return;
  }

  const scheduleData = { ...baseData[0] };
  scheduleData.id = getIndexedId();
  scheduleData.name = req.body.name;
  scheduleData.description = req.body.description;
  scheduleData.expression = req.body.expression;
  scheduleData.createdAt = new Date().toISOString();
  scheduleData.enabled = true;
  scheduleData.jobSpecification = req.body.jobSpecification;

  console.log(`Creating schedule:  ${util.inspect(scheduleData)}`);

  for (const [key, value] of Object.entries(scheduleData)) {
    if (!value && key !== 'description') {
      throwAnErrorToUI(res, 500, 'DR-16', `Mandatory inputs '${key}' are missing'`);
      return;
    }
  }
  console.log(`Job Schedules Controller: NEW Schedule ID: ${scheduleData.id}`);

  tableDataGenerator.addNewData(scheduleData);
  res.status(codes.CREATED).json(scheduleData);
}

function getJobScheduleById(req, res) {

  console.log(`Job Schedules Controller: (single by id) GET: ${decodeURI(util.inspect(req.originalUrl))}`);
  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);
  console.log(`Job Schedules Controller: found record ${util.inspect(foundRecord)}`);

  if (foundRecord) {
    console.log(`Job Schedules Controller: found record ${util.inspect(foundRecord)}`);
    res.json(foundRecord);
  } else {
    throwAnErrorToUI(res, 404, 'DR-38', `Job schedule with id  '${req.params.id}' does not exist.`);
  }
}

function deleteJobSchedule(req, res) {
  console.log(`Job Schedules Controller: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);

  const foundRecord = _getDataGenerator().find('id', req.params.id);
  if (foundRecord) {
    console.log(`Job Schedules Controller: found record ${util.inspect(foundRecord)}`);
    // no status on the schedule - so can delete it
    const result = _getDataGenerator().delete(req.params.id);
    if (result) {
      console.log(`Delete was successful: ${result}`);
      res.status(codes.NO_CONTENT).send();
    } else {
      console.log(`Delete failed (not found): ${result}`);
      res.status(codes.NOT_FOUND).send();
    }
  } else {
    throwAnErrorToUI(res, 404, 'DR-38', `Job schedule with id '${req.params.id}' does not exist.`);
  }
}

function enableDisableJobSchedule(req, res) {
  console.log(`Job Schedules Controller: PATCH: ${decodeURI(util.inspect(req.originalUrl))}`);

  const foundRecord = _getDataGenerator().find('id', req.params.id);
  if (foundRecord) {
    console.log(`Job Schedules Controller: found record ${util.inspect(foundRecord)}`);
    if (req.body.enabled !== undefined) {
      foundRecord.enabled = req.body.enabled;
      console.log(`Job Schedules Controller: changing schedule enabled to ${foundRecord.enabled}`);
      res.status(codes.NO_CONTENT).send();
    } else {
      throwAnErrorToUI(res, 500, 'DR-16', `Mandatory inputs 'enabled' are missing`);
    }
  } else {
    throwAnErrorToUI(res, 404, 'DR-38', `Job schedule with id '${req.params.id}' does not exist.`);
  }
}

function _isValidCronExpression(expression) {
  /* we can not use the cron-parser 3pp as it is for unix cron */
  return (!expression.includes('FAIL')) && expression.match('^([^ ]+ ){5}[^ ]+$') !== null;
}


module.exports = {
  getJobSchedules,
  addJobSchedule,
  getJobScheduleById,
  deleteJobSchedule,
  enableDisableJobSchedule
};
