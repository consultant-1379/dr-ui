/**
 * Application details use for a create job form
 * from ApplicationConfigurationDto in schema
 */
const data = {
  "id": "101",
  "name": "myappconfig",
  "description": "test job which uses echo to return source and target nodes",
  "jobs": [{
    /* unused may not be a valid scenario for this response, but simulating RV team have job definitions
       appearing in filter dropdown that are not used in any current jobs */
    "name": "job-definition-unused1",
    "api": {
      "properties": [
        { name: "id" },
        { name: "source.name" },
        { name: "target.name" },
        { name: "list" }
      ]
    },
  },
    {
      "name": "job-definition-unused2",
      "api": {
        "properties": [
          { name: "id" },
          { name: "source.name" },
          { name: "target.name" },
          { name: "list" }
        ]
      },
    },{
    "name": "job1-definition",
    "description": "job 1 description",
    "api": {
      "properties": [
        { name: "id" },
        { name: "source.name" },
        { name: "target.name" },
        { name: "list" }
      ]
    },
    "discover": {
      "inputs": [{
        "name": "vimZone",
        "mandatory": true,
        "helpMessage": "Help message for vimZone",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "vimProjectName",
        "mandatory": true,
        "helpMessage": "Help message for vimProjectName",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "sourceSubsystem",
        "mandatory": true,
        "helpMessage": "Help message for sourceSubsystem",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "targetSubsystem",
        "mandatory": true,
        "helpMessage": "Help message for targetSubsystem"
      }
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
            "url": "http://external-system/targets",
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
        "filter2": {
          "condition": "sourceMismatchedInTarget",
          "arg": "prop1:prop1",
          "filterMatchText": "Mismatched in Target",
          "reconcile": "action2"
        }
      }
    },
    "reconcile": {
      "inputs": [
        {
          "name": "reconcileInput1",
          "mandatory": true,
          "description": "Help message for input1"
        },
        {
          "name": "reconcileInput2",
          "mandatory": false,
          "description": "Help message for input2"
        },
        {
          "name": "reconcileInput3",
          "mandatory": false,
          "description": "Help message for input3"
        }],
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
          "action2": {
            "type": "shell",
            "preFunction": null,
            "command": "reconcile2.sh {payload}",
            "outputFormat": "json",
            "postFunction": null,
            "mapping": {
              "result": ".result"
            }
          }
        }
      }
    }
  },
  {
    "name": "job2-definition",
    "description": "job 2 description",
    "properties": {
      "api": [{
        "name": "id"
      },
      {
        "name": "name"
      }
      ]
    },
    "discover": {
      "inputs": [{
        "name": "vimZone2",
        "mandatory": true,
        "helpMessage": "Help message for vimZone",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "vimProjectName2",
        "mandatory": true,
        "helpMessage": "Help message for vimProjectName",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "userName2",
        "mandatory": true,
        "helpMessage": "Help message for userName",
        "constraints": {
          "validValues": "validation1"
        }
      },
      {
        "name": "stepValue",
        "mandatory": true,
        "helpMessage": "Help message for stepValue"
      }
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
            "url": "http://external-system/targets",
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
          "condition": { name: "sourceNotInTarget", arg: "id:id" },
          "filterMatchText": "Missing in Target",
          "reconcileAction": "action1"
        },
        "filter2": {
          "condition": "sourceMismatchedInTarget",
          "arg": "prop1:prop1",
          "filterMatchText": "Mismatched in Target",
          "reconcile": "action2"
        }
      }
    },
    "reconcile": {
      "inputs": [],
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
          "action2": {
            "type": "shell",
            "preFunction": null,
            "command": "reconcile2.sh {payload}",
            "outputFormat": "json",
            "postFunction": null,
            "mapping": {
              "result": ".result"
            }
          }
        }
      }
    }
  }
  ]
};
module.exports = data;
