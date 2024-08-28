/**
 * Job details for context flyout information
 * from JobDto in schema
 */
const data = {
  "id": "12345",
  "name": "job 1-0",
  "description": "description of job",
  "featurePackId": "12345",
  "featurePackName": "feature pack 1-0-xx",
  "applicationId": "101",
  "applicationName": "my-application-name",
  "applicationJobName": "job1-definition",
  "startDate": "2023-05-12T16:12:54Z",
  "completedDate": "2023-05-12T16:34:12Z",
  "status": "NEW",
  "jobScheduleId": "2",
  "inputs": {
    "reconcileInput1": "value1",
    "vimZone": "123",
    "vimProjectName": "projName",
    "sourceSubsystem": "enm",
    "targetSubsystem": "cts",
    "reconcileInput3": "value1",
    "other": "other 1value",
    "reconcileInput12": "value1",
    "vimZone3": "123",
    "vimProjectName3": "projName",
    "sourceSubsystem3": "enm",
    "targetSubsystem3": "cts",
    "reconcileInput4": "value1",
    "other5": "other 1value",
    "reconcileInput126": "value1",
  },
  "discoveredObjectsCount": 4,
  "reconciledObjectsCount": 10,
  "reconciledObjectsErrorCount": 2,
  "errorMessage": "DR-20:Execution step 'CommandStep' failed: 'Command '[bash, -c, python3 /tmp/assets/1/ctsDiscovery.py + \"TESTS_test cts\" \\ + \"TESTS_test enm\" \\ + \"gnbdu\"]' failed with output 'Traceback (most recent call last):\nFile \"/tmp/assets/1/ctsDiscovery.py\", line 518, in <module>\nwith open(exportFile, 'r') as f:\nFileNotFoundError: [Errno 2] No such file or directory: '/tmp/ctsExport_TESTS_test cts.json'''.;DR-20:Execution step 'CommandStep' failed: 'Command '[bash, -c, python3 /tmp/assets/1/enmdiscovery.py '{\n \"scopeType\": \"NODE_NAME\",\n \"matchCondition\": \"STARTS_WITH\",\n \"value\": \"TESTS\"\n}' \\\n + \"ManagedElement.(managedElementId); GNBDUFunction.(gNBDUFunctionId); GNBCUUPFunction.(gNBCUUPFunctionId,pLMNIdList,sNSSAIList); NRCellDU.(nRCellDUId,nRTAC,pLMNIdList,sNSSAIList,administrativeState,operationalState,cellLocalId); DU5qiTable.(dU5qiTableId,default5qiTable); DU5qi.(DU5qiId,profile5qi,priorityLevel); ResourcePartitions.(resourcePartitionsId); ResourcePartition.(resourcePartitionId,resourcePartitionName,related5qiTableRef); ResourcePartitionMember.(resourcePartitionMemberId,pLMNIdList,sNSSAIList)\" \\ + \"gnbdu\" \\ + \"gnbdu\" \\ + \"TESTS_test enm\" \\ + \"TESTS_test cts\" \\ + \"False\"]' failed with output 'Traceback (most recent call last):\nFile \"/tmp/assets/1/enmdiscovery.py\", line 543, in <module>\ncodeExit = Console().onecmd(jobMethod+\" \"+nms+\" \"+exportFile)\nFile \"/usr/lib64/python3.10/cmd.py\", line 217, in onecmd\nreturn func(arg)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 264, in do_gnbdu_rest\noutput = self.parseExport_ne(nms,fileName)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 169, in parseExport_ne\ndata = self.getENM(fileName)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 224, in getENM\nwith open(fileName, 'r') as myfile:\nFileNotFoundError: [Errno 2] No such file or directory: 'enm'''."
};
module.exports = data;