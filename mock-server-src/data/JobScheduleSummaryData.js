/**
 * Job Schedule table row item (in an array to be iterable)
 * from JobScheduleSummaryDto in schema
 */

const executionJobData = require('./ExecuteJobData.js');

const data = [{
  id: '12345',
  name: 'Analyst 1-0 Schedule',
  description: 'The description of the job schedule ',
  createdAt: '2023-05-12T16:12:54Z',
  expression: '0 0 9-17 * * MON-FRI',
  enabled: true,
  jobSpecification: executionJobData

}];
module.exports = data;
