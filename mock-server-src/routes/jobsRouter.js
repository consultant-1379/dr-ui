const router = require('express').Router();
const util = require('util');
const jobsController = require('../controllers/jobs-controller');

// eslint-disable-next-line no-unused-vars
const { throwAnErrorToUI } = require('../utils/ErrorGenerator');

/* Error handling dialog manual test
   e.g paste :  throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
   e.g paste : throwAnErrorToUI(res, 500);
   in place of responses below
*/

router.route('/')

  .get((req, res, next) => {
    console.log(`Jobs Router: GET: ${decodeURI(util.inspect(req.originalUrl))}`);
    //XX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    //XX res.json({items: [], totalCount: 0});
    jobsController.getJobs(req, res);
  })

  .post((req, res, next) => {
    console.log(`JobRouter: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
    jobsController.createDiscoveryJob(req, res);
  })

  .delete((req, res, next) => { /* multiple delete (from filter) */
    console.log(`Jobs Router: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
    jobsController.deleteJobs(req, res);
  });

router.route('/:id')

  .get((req, res, next) => {
    console.log(`Jobs Router (single details): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 404, 'DR-17', `Job '${req.params.id}' does not exist.`);
    jobsController.getJobById(req, res);
  })

  .delete((req, res, next) => {
    console.log(`Jobs Router: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
    jobsController.deleteJob(req, res);
  });

router.route('/:id/duplicate')

  .post((req, res, next) => {
    console.log(`Jobs Router (execute a duplication): POST : ${decodeURI(util.inspect(req.originalUrl))}`);

     // XX throwAnErrorToUI(res, 404, 'DR-xx', `Job with given id: '${req.params.id}' does not exist.`);
    jobsController.duplicateJob(req, res);
});


router.route('/:id/discovered-objects')

  .get((req, res, next) => {
    console.log(`Jobs Router (get discovered objects): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    jobsController.getDiscoveredObjects(req, res);
  });

router.route('/:id/reconciliations')

  .post((req, res, next) => {
    console.log(`Jobs Router (execute a reconcile): POST : ${decodeURI(util.inspect(req.originalUrl))}`);

     // XX throwAnErrorToUI(res, 400, 'DR-19', `Jinja Substitution failed: '${req.params.id}'.`);
    jobsController.executeReconcile(req, res);
  });

module.exports = router;