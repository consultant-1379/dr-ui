/**
 * Scheduling job data jobSpecification
 * (array of ExecuteJobDto in schema)
 */
const data =
{

  "name": "Analyst 1-0",
  "description": "The Reconciliation Analyst is responsible for researching all missing and unapplied payments and ensuring they are posted to the appropriate account in HMS system",
  "featurePackId": "12345",
  "featurePackName": "Feature pack 1-0-XX",
  "applicationId": "101",
  "applicationName": "Reconciliation Application 1",
  "applicationJobName": "job1-definition",
  "executionOptions": {
    autoReconcile: false
  },
  "inputs": {
    "reconcileInput1": "value1",
    "vimZone": "123",
    "vimProjectName": "projName",
    "sourceSubsystem": "enm",
    "targetSubsystem": "cts",
    "reconcileInput2": "value1",
    "reconcileInput3": "value1"
  }
};
module.exports = data;