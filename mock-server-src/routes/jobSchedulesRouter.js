const router = require('express').Router();
const util = require('util');
const codes = require('../constants/statusCodes.js');
const jobSchedulesController = require('../controllers/job-schedules-controller.js');

// eslint-disable-next-line no-unused-vars
const { throwAnErrorToUI } = require('../utils/ErrorGenerator.js');

/* Error handling dialog manual test
   e.g paste :  throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
   e.g paste : throwAnErrorToUI(res, 500);
   in place of responses below
*/

router.route('/')

  .get((req, res, next) => {
    console.log(`Job Schedules Router: GET: ${decodeURI(util.inspect(req.originalUrl))}`);

    /* comment in to simulate a fetch "get all job schedules" error */
    //  if (req.query.limit === undefined){
    //   throwAnErrorToUI(res, 500, 'DR-500', "Some issue fetching all job schedules");
    //  }

    //XXX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    //XXX res.json({items: [], totalCount: 0});
    jobSchedulesController.getJobSchedules(req, res);
  })

  .post((req, res, next) => {
    console.log(`Job Schedules Router: POST: ${decodeURI(util.inspect(req.originalUrl))}`);
    //XX throwAnErrorToUI(res, 500, 'DR-500', `Internal server error: 'Some fault has occurred in the server'`);
    jobSchedulesController.addJobSchedule(req, res);
  });

router.route('/:id')

  .get((req, res, next) => {
    console.log(`Job Schedules Router (single details): GET : ${decodeURI(util.inspect(req.originalUrl))}`);
    // throwAnErrorToUI(res, 404, 'DR-38', `Job schedule '${req.params.id}' does not exist.`);
    jobSchedulesController.getJobScheduleById(req, res);
  })

  .delete((req, res, next) => {
    console.log(`Job Schedules Router: DELETE: ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 404, 'DR-38', `Job schedule '${req.params.id}' does not exist.`);
    jobSchedulesController.deleteJobSchedule(req, res);
  })

  .patch((req, res, next) => {
    console.log(`Job Schedules Router: PATCH: ${decodeURI(util.inspect(req.originalUrl))}`);
    // XX throwAnErrorToUI(res, 404, 'DR-38', `Job schedule '${req.params.jobScheduleId}' does not exist.`);
    jobSchedulesController.enableDisableJobSchedule(req, res);
  });

module.exports = router;
