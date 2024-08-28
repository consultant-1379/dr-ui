import { ActionFilterStatus } from "src/app/models/enums/action-filter-status.enum";
import { DiscoveredObjects } from "src/app/models/discovered-objects.model";
import { DiscoveredObjectsItemsResponse } from "src/app/models/discovered-objects-items-response.model";
import { DiscoveredObjectsStatus } from "src/app/models/enums/discovered-objects-status.enum";
import { DisplayOrientation } from "src/app/enums/information-display-mode";
import { DynamicInputsDisplayComponent } from "../dynamic-inputs-display/dynamic-inputs-display.component";
import { Job } from "src/app/models/job.model";
import { JobStatus } from "src/app/models/enums/job-status.enum";
import { TranslateService } from '@ngx-translate/core';
import { ViewStyle } from "@erad/components";
import { of } from "rxjs";

let translateService: TranslateService;

export const mockResponse = {
  "id": "101",
  "name": "myappconfig",
  "description": "Example Application Configuration",
  "jobs": [
    {
      "name": "job1-definition",
      "description": "job 1 description",
      "properties": {
        "api": [
          {
            "name": "id"
          },
          {
            "name": "name"
          }
        ]
      },
      "discover": {
        "inputs": [
          {
            "name": "vimZone",
            "mandatory": true,
            "helpMessage": "Help message for vimZone",
            "constraints": {
              "validValues": "validation1"
            }
          },
        ],
        "source": {
          "fetchAction": {
            "type": "shell",
            "preFunction": null,
            "command": "cat sources.json",
            "outputFormat": "json",
            "postFunction": null,
            "mapping": {
              "id": ".id",
              "name": ".name"
            }
          },
          "enrichAction": null
        },
        "target": {
          "fetchAction": {
            "type": "rest",
            "preFunction": null,
            "outputFormat": "json",
            "properties": {
              "url": "https://external-system/targets",
              "method": "GET",
              "headers": {
                "Content-Type": [
                  "application/json"
                ]
              }
            },
            "postFunction": null,
            "mapping": {
              "id": ".id",
              "name": ".name"
            }
          },
          "enrich": null
        },
        "linkSourceAndTarget": "id:id",
        "filters": {
          "filter1": {
            "condition": {
              "name": "sourceNotInTarget"
            },
            "filterMatchText": "Missing in Target",
            "reconcileAction": "action1"
          },
        }
      },
      "reconcile": {
        "inputs": [
          {
            "name": "reconcileInput1",
            "mandatory": true,
            "description": "Help message for input1"
          },

        ],
        "source": {
          "enrichAction": null
        },
        "target": {
          "enrichAction": null,
          "reconcileActions": {
            "action1": {
              "type": "shell",
              "preFunction": null,
              "command": "reconcile.sh {payload}",
              "outputFormat": "json",
              "postFunction": null,
              "mapping": {
                "result": ".result"
              }
            },

          }
        }
      }
    },
  ]
};

export const jobMock: Job = {
  'id': '12345',
  'name': 'Analyst 1-0',
  'description': 'The Reconciliation Analyst is responsible for researching all missing and unapplied payments and ensuring they are posted to the appropriate account in HMS system',
  'featurePackId': '691fd10c-ff9b-11ed-be56-0242ac120002',
  'featurePackName': 'Feature pack 1-0-XX',
  'applicationId': '101',
  'applicationName': 'Reconciliation Application 1',
  'applicationJobName': 'job1-definition',
  'startDate': '2023-05-12T16:12:54Z',
  'completedDate': '2023-05-12T16:34:12Z',
};

export const discoveredObjectsMock: DiscoveredObjectsItemsResponse = {
  items: [
    {
      objectId: '1',
      discrepancies: [
        'Missing in ecm'
      ],
      properties: {
        flavorName: 'ECM_CORE',
        ephemeralDiskSize: '0',
        diskSize: '64',
        isPublic: 'false',
        id: '444',
        numberOfCPU: '4',
        ramMemorySize: '12288',
        assignedObjectId: '1',
        receivedTransmitFactor: '1.0'
      },
      filters: [
        {
          name: 'filter one',
          reconcileAction: {
            status: ActionFilterStatus.FAILED,
            command: 'Method: POST',
            commandOutput: 'command output message',
            errorMessage: 'DR-20:Execution step.'
          }
        }
      ],
      errorMessage: '',
      status: DiscoveredObjectsStatus.RECONCILED
    }
  ],
  totalCount: 50
};

export const selectedItemsMock: DiscoveredObjects[] = [
  {
    "objectId": "137",
    "discrepancies": [
      "Missing in ecm 1",
      "ephemeralDiskSize is different 1",
      "diskSize is different 1",
      "isPublic is different 1",
      "numberOfCPU is different 1",
      "ramMemorySize is different 1",
      "assignedObjectId is different 1",
      "receivedTransmitFactor is different 1",
      "flavorName is different 1"
    ],
    "properties": {
      "flavorName": "ECM_CORE",
      "ephemeralDiskSize": "0",
      "diskSize": "64",
      "isPublic": "false",
      "numberOfCPU": "4",
      "ramMemorySize": "12288",
      "assignedObjectId": "1",
      "receivedTransmitFactor": "1.0",
      "name": "object1",
      "target.prop2": 1,
      "target.prop1": "value1",
      "source.prop1": "value1",
      "id": "222",
    },
    "filters": [
      {
        "name": "filter one",
        "reconcileAction": {
          "status": ActionFilterStatus.FAILED,
          "command": "Method: POST\nURL: http://host.docker.internal:3002/reconcile/targets/1\nHeaders: [Content-Type:\"application/json\"]",
          "commandOutput": "</html>n</html>",
          "errorMessage": "DR-20:Execution step."
        }
      },
    ],
    "errorMessage": "",
    "status": DiscoveredObjectsStatus.NEW
  }
];

export const jobDetailsMock: Job = {
  "id": "136",
  "name": "Analyst 1-0-40",
  "description": "The Reconciliation Analyst",
  "featurePackId": "1",
  "featurePackName": "Feature pack 1-0-XX",
  "applicationId": "101",
  "applicationName": "Reconciliation Application 1",
  "applicationJobName": "job1-definition",
  "startDate": "2023-08-17T08:02:13Z",
  "completedDate": "2023-07-18T03:13:15Z",
  "status": JobStatus.DISCOVERY_FAILED,
  "inputs": {
    "jobProp1": "value1",
    "jobProp2": "value2",
    "jobProp3": "value3"
  },
  "discoveredObjectsCount": 4,
  "reconciledObjectsCount": 10,
  "reconciledObjectsErrorCount": 2,
  "errorMessage": "DR-20:Execution step 'CommandStep' failed: 'Command '[bash, -c, python3 /tmp/assets/1/ctsDiscovery.py + \"TESTS_test cts\" \\ + \"TESTS_test enm\" \\ + \"gnbdu\"]' failed with output 'Traceback (most recent call last):\nFile \"/tmp/assets/1/ctsDiscovery.py\", line 518, in <module>\nwith open(exportFile, 'r') as f:\nFileNotFoundError: [Errno 2] No such file or directory: '/tmp/ctsExport_TESTS_test cts.json'''.;DR-20:Execution step 'CommandStep' failed: 'Command '[bash, -c, python3 /tmp/assets/1/enmdiscovery.py '{\n \"scopeType\": \"NODE_NAME\",\n \"matchCondition\": \"STARTS_WITH\",\n \"value\": \"TESTS\"\n}' \\\n + \"ManagedElement.(managedElementId); GNBDUFunction.(gNBDUFunctionId); GNBCUUPFunction.(gNBCUUPFunctionId,pLMNIdList,sNSSAIList); NRCellDU.(nRCellDUId,nRTAC,pLMNIdList,sNSSAIList,administrativeState,operationalState,cellLocalId); DU5qiTable.(dU5qiTableId,default5qiTable); DU5qi.(DU5qiId,profile5qi,priorityLevel); ResourcePartitions.(resourcePartitionsId); ResourcePartition.(resourcePartitionId,resourcePartitionName,related5qiTableRef); ResourcePartitionMember.(resourcePartitionMemberId,pLMNIdList,sNSSAIList)\" \\ + \"gnbdu\" \\ + \"gnbdu\" \\ + \"TESTS_test enm\" \\ + \"TESTS_test cts\" \\ + \"False\"]' failed with output 'Traceback (most recent call last):\nFile \"/tmp/assets/1/enmdiscovery.py\", line 543, in <module>\ncodeExit = Console().onecmd(jobMethod+\" \"+nms+\" \"+exportFile)\nFile \"/usr/lib64/python3.10/cmd.py\", line 217, in onecmd\nreturn func(arg)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 264, in do_gnbdu_rest\noutput = self.parseExport_ne(nms,fileName)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 169, in parseExport_ne\ndata = self.getENM(fileName)\nFile \"/tmp/assets/1/enmdiscovery.py\", line 224, in getENM\nwith open(fileName, 'r') as myfile:\nFileNotFoundError: [Errno 2] No such file or directory: 'enm'''."
};

export const mockDynamicInputsDisplay: DynamicInputsDisplayComponent = {
  isFormValid: () => true,
  inputDataArray: [
    {
      "name": "reconcileInput1",
      "mandatory": true,
    }
  ],
  horizontalLayout: DisplayOrientation.horizontal,
  formData: {},
  viewStyle: ViewStyle.Bordered,
  safeStringPattern: '^[^<>%*&]*$',
  invalidInputChars: '<>&',
  selectDropDownPlaceholder: {
    "value": null,
    "label": "Select"
  },
  dropdownsForNameCache: {},
  getFormValues: () => { return {} },
  hasPickListValues: undefined,
  onDropDownOptionChange: undefined,
  createDropDownOptions: undefined,
  _removePlaceholder: undefined,
  _clearExistingValues: undefined,
  _prePopulateFormValues: undefined,
  ngOnChanges: undefined,
  translateService: translateService

};

export const MatDialogRefSpy = {
  close: () => {
     // empty method okay (comment here for SONAR compliance)
  },
  afterClosed: () => of(true)
};