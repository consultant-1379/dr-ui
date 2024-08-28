/* eslint-disable no-use-before-define */
const util = require('util');
const { getIndexedId } = require('../utils/Utils.js');
const codes = require('../constants/statusCodes.js');
const { throwAnErrorToUI } = require('../utils/ErrorGenerator.js');
const detailData = require('../data/FeaturePackData.js');
const baseData = require('../data/FeaturePackSummaryData.js');
const applicationSingleData = require('../data/ApplicationConfigurationData.js');
const inputConfigurationsSingleData = require('../data/InputConfigurationsDetailData.js');

const DataGenerator = require('../utils/TableDataGenerator.js');

function _getDataGenerator() {
  if (!this.featurePackDataGenerator) {
    this.featurePackDataGenerator = new DataGenerator(baseData);
  }
  return this.featurePackDataGenerator;
}

/**
 * Get paginated table data for feature pack with items and totalCount
 *
 * @param {*} req  request obj   FIQL requests for filtering and sorting - though potentially just sort
 *                               (potentially without offSet and limit)
 * @param {*} res  response obj
 */
function getFeaturePacks(req, res) {
  console.log(`Feature Packs Controller: GET: ${decodeURI(util.inspect(req.originalUrl))}`);
  const tableDataGenerator = _getDataGenerator();
  const featurePackResults = tableDataGenerator.getData(req.query);

  console.log(`Feature Pack results result total ${featurePackResults.totalCount}`);

  /* already in desired object with values items and totalCount keys */
  // XXX res.json({items: [], totalCount: 0})
  setTimeout(() => {
    res.json(featurePackResults);
    // This simulates that the feature packs may not be instantly available.
  }, Math.random(1000));
}

/**
 * Single detail call contains more information that the call when multiple rows
 * (returning fake data)
 */
function getFeaturePackById(req, res, type) {
  console.log(`Feature Packs Controller: (single by id) GET: ${decodeURI(util.inspect(req.originalUrl))}`);

  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);
  console.log(`Feature Packs Controller: found record ${util.inspect(foundRecord)}`);
  if (foundRecord) {
    _updateFeaturePackDetails(foundRecord, req.params.id);

    const varyingData = { ...detailData }; // applications length is 3 applications

    const appId2 = req.params.id + "2";
    const secondApplication = {  // won't have data for it but will see id number change in UI
      id: "" + appId2,
      name: `Reconciliation Application ${appId2}`,
      /* no description (its optional) */
    };

    if (Math.random() > 0.5) { // rnd chance of more than 2 apps
      varyingData.applications = [detailData.applications[0], secondApplication];  // test application number change
    } else {
      const appId3 = req.params.id + "3";
      const thirdApplication = {  // won't have data for it but will see id number change in UI
        id: appId3,
        name: `Reconciliation Application ${appId3}`,
        description: detailData.applications[2].description
      };
      varyingData.applications = [detailData.applications[0], secondApplication, thirdApplication];
    }

    switch (type) {
      // DnR doesn't filter/sort on applications/input-configurations so ignore query param
      case 'applications':
        res.json(_getItemsResponse(varyingData.applications));
        break;
      case 'input-configurations':
        res.json(_getItemsResponse(detailData.inputs)); // not varying inputs
        break;
      default:
        res.json(varyingData);
    }
  } else {
    // TODO should this be an inline message on a table blocking whole table  (dialog better ???)
    throwAnErrorToUI(res, 404, "DR-01", `Feature pack '${req.params.id}' does not exist.`);
  }
}

function _getItemsResponse(values = []) {
  return {
    items: values,
    totalCount: values.length,
  };
}

function deleteFeaturePack(req, res) {
  console.log(`Feature Packs Controller: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
  const result = _getDataGenerator().delete(req.params.id);
  if (result) {
    console.log(`Delete was successful: ${result}`);
    res.status(codes.NO_CONTENT).send();
  } else {
    console.log(`Delete failed (not found): ${result}`);
    res.status(codes.NOT_FOUND).send();
  }
}

/**
 * Support onboarding feature pack (for API completeness),
 * should it ever be required
 * (need data generator to support in any case)
 */
function addFeaturePack(req, res) {
  console.log(`Feature Packs Controller: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
  console.log(`Request body: ${util.inspect(req.body)}`)

  const newRowItem = {};
  const totalCount = _getDataGenerator().getTotalData().length;
  newRowItem.id = getIndexedId();
  newRowItem.name = req.body && req.body.name ? req.body.name : `feature pack 1-${totalCount + 1}`;
  newRowItem.description = req.body && req.body.description ? req.body.description : "feature pack onboard";
  newRowItem.createdAt = new Date().toISOString();
  newRowItem.modifiedAt = null;

  _getDataGenerator().addNewData(newRowItem);
  _updateFeaturePackDetails(newRowItem, newRowItem.id);
  res.status(codes.CREATED).json(detailData);
  // XXX throwAnErrorToUI(res, 404, "DR-03", `The archive for feature pack '${newRowItem.name}' is empty or is not a valid zip archive.`);
}

function _updateFeaturePackDetails(featurePackRow, id) {
  detailData.id = id;
  detailData.name = featurePackRow.name;
  detailData.description = featurePackRow.description;
  detailData.createdAt = featurePackRow.createdAt;
  detailData.modifiedAt = featurePackRow.modifiedAt;
  /* rest is application, listeners, inputs, assets - leave as default file */
}

/**
 * Support replacing feature pack (for API completeness),
 * should it ever be required
 */
function replaceFeaturePack(req, res) {
  // (this is  fake data - not going reading multipart/form-data)
  console.log(`Feature Packs Controller: PUT: ${decodeURI(util.inspect(req.originalUrl))}`);
  console.log(`Request body: ${util.inspect(req.body)}`)

  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);

  console.log(`Feature Packs Controller: Replace - found record ${util.inspect(foundRecord)}`);
  if (foundRecord) {
    detailData.id = req.params.id;
    detailData.name = foundRecord.name;
    detailData.description = req.body && req.body.description ? req.body.description : "feature pack replace",
      detailData.createdAt = foundRecord.createdAt;
    detailData.modifiedAt = new Date().toISOString();
    /* rest is application, listeners, inputs, assets - leave as default file */
    res.json(detailData);
  } else {
    /* test script XSS attack - not alerted from DOM - when upload with a fake id*/
    //XXX throwAnErrorToUI(res, 404, "DR-01", `Feature pack '${req.params.id}' does not ${'<script>alert("XSS Attack test!");</script>'} exist.`);
    throwAnErrorToUI(res, 404, "DR-01", `Feature pack '${req.params.id}' does not exist.`);

  }
}

function getFeaturePackApplications(req, res) {
  getFeaturePackById(req, res, 'applications');
}

function getInputConfigurations(req, res) {
  getFeaturePackById(req, res, 'input-configurations');
}

function getFeaturePackApplicationById(req, res) {
  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);

  if (foundRecord) {
    const applicationId = req.params.appId;
    applicationSingleData.id = applicationId;
    res.json(applicationSingleData);    // don't fail
  } else {
    throwAnErrorToUI(res, 404, "DR-01", `Feature pack '${req.params.id}' does not exist.`);
  }
}

function getInputConfigurationById(req, res) {
  const tableDataGenerator = _getDataGenerator();
  const foundRecord = tableDataGenerator.find('id', req.params.id);

  const configId = req.params.configurationId;

  if (foundRecord) {
    console.log("Feature packs controller get config for " + configId);
    if (inputConfigurationsSingleData[configId]) {
      res.json(inputConfigurationsSingleData[configId]);
    } else {
      inputConfigurationsSingleData.id = configId;
      res.json(inputConfigurationsSingleData);    // don't fail
    }

  } else {
    throwAnErrorToUI(res, 404, "DR-01", `Feature pack '${req.params.id}' does not exist.`);
  }
}

module.exports = {
  getFeaturePacks,
  getFeaturePackById,
  deleteFeaturePack,
  addFeaturePack,
  replaceFeaturePack,
  getFeaturePackApplications,
  getFeaturePackApplicationById,
  getInputConfigurations,
  getInputConfigurationById
};
