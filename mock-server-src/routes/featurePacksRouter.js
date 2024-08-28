const router = require('express').Router();
const util = require('util');
const codes = require('../constants/statusCodes.js');
const featurePacksController = require('../controllers/feature-packs-controller.js');

// eslint-disable-next-line no-unused-vars
const { throwAnErrorToUI } = require('../utils/ErrorGenerator.js');

/* Error handling dialog manual test
   e.g paste :  throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
   e.g paste : throwAnErrorToUI(res, 500);
   in place of responses below
*/

router.route('/')

  .get((req, res, next) => {
    console.log(`Feature Packs Router: GET: ${decodeURI(util.inspect(req.originalUrl))}`);

    /* comment in to simulate a fetch "get all feature packs" error */
    //  if (req.query.limit === undefined){
    //   throwAnErrorToUI(res, 500, 'DR-500', "Some issue fetching all Feature packs");
    //  }

    //XXX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    //XXX res.json({items: [], totalCount: 0});
    featurePacksController.getFeaturePacks(req, res);
  })

  .post((req, res, next) => {
    console.log(`Feature Packs Router: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
    req.accepts('multipart/form-data');
    //XX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    featurePacksController.addFeaturePack(req, res);
  });

router.route('/:id')

  .get((req, res, next) => {
    console.log(`Feature Packs Router (single details): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // throwAnErrorToUI(res, 404, 'DR-01', `Feature pack '${req.params.id}' does not exist.`);
    featurePacksController.getFeaturePackById(req, res);
  })

  .delete((req, res, next) => {
    console.log(`Feature Packs Router: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 404, 'DR-01', `Feature pack '${req.params.id}' does not exist.`);
    featurePacksController.deleteFeaturePack(req, res);
  })

  .put((req, res, next) => {
    console.log(`Feature Packs Router: PUT: ${decodeURI(util.inspect(req.originalUrl))}`);
    req.accepts('multipart/form-data');
    // XX throwAnErrorToUI(res, 404, 'DR-01', `Feature pack '${req.params.id}' does not exist.`);
    featurePacksController.replaceFeaturePack(req, res);
  });


router.route('/:id/applications')

  .get((req, res, next) => {
    console.log(`Feature Packs Router (applications): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 404, 'DR-01', `Feature pack '${req.params.id}' does not exist.`);
    featurePacksController.getFeaturePackApplications(req, res);
  });


router.route('/:id/applications/:appId')

  .get((req, res, next) => {
    console.log(`Feature Packs Router (applicationId): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    //XX throwAnErrorToUI(res, 500, 'DR-06', `Application with id '${req.params.appId}' not found in feature pack with id '${req.params.id}'.`);
    featurePacksController.getFeaturePackApplicationById(req, res);
  });

router.route('/:id/input-configurations')

  .get((req, res, next) => {
    console.log(`Feature Packs Router (input-configurations): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    featurePacksController.getInputConfigurations(req, res);
  });

router.route('/:id/input-configurations/:configurationId')

  .get((req, res, next) => {
    console.log(`Feature Packs Router (configurationId): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 500, 'DR-31', `Configuration with id '${req.params.configurationId}' not found in feature pack with id '${req.params.id}'.`);
    featurePacksController.getInputConfigurationById(req, res);
  });

router.route('/:id/files')

  .get((req, res, next) => {
    console.log(`Feature Packs Router - Download call: GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 500, 'DR-02', `I/O error reading feature pack archive '${req.params.id}'.`);
    res.status(codes.OK).send();
  });

module.exports = router;
