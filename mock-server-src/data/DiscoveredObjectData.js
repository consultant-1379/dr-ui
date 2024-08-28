/**
 * Discovered Object detail data for context
 * flyout detail data on Job details object table row click
 * from DiscoveredObjectDto in schema
 */
const data = [
  {
    objectId: "1607",
    discrepancies: [
      "Missing in ecm",
      "source.name is different",
      "target.name is different",
      "abc is different",
    ],
    properties: {
      "source.name": "object2",
      id: "2",
    },
    filters: [
      {
        name: "filter1",
        reconcileAction: {
          name: "default",
          status: "NOT_STARTED",
        },
      },
    ],
    status: "DISCOVERED",
  },
  {
    objectId: "1608",
    discrepancies: ["Missing in Target"],
    properties: {
      "source.name": "object3",
      id: "3",
    },
    filters: [
      {
        name: "filter1",
        reconcileAction: {
          name: "default",
          status: "NOT_STARTED",
        },
      },
    ],
    status: "DISCOVERED",
  },
  {
    objectId: "1609",
    discrepancies: ["Missing in Target"],
    properties: {
      "source.name": "object4",
      id: "4",
      list: ["one", "two"],
    },
    filters: [
      {
        name: "filter1",
        reconcileAction: {
          name: "default",
          status: "NOT_STARTED",
        },
      },
    ],
    status: "DISCOVERED",
  },
  {
    objectId: "1610",
    discrepancies: ["Missing in Source"],
    properties: {
      "target.name": "object10",
      id: "10",
    },
    "filters": [
      {
        "name": "filter one",
        "reconcileAction": {
          "name": "action1",
          "status": "FAILED",
          "command": "Method: POST\nURL: http://host.docker.internal:3002/reconcile/targets_and_this_is_a_long_string/1\nHeaders: [Content-Type:\"application/json\"]",
          "commandOutput": "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /reconcile/targets/1</pre>\n</body>\n</html>\n",
          "errorMessage": "DR-20:Execution step 'CommandStep' failed: 'Command 'Method: POST\nURL: http://host.docker.internal:3002/reconcile/targets_and_this_is_a_long_string/1\nHeaders: [Content-Type:\"application/json\"]' failed with output '<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n<title>Error</title>\n</head>\n<body>\n<pre>Cannot POST /reconcile/targets/1</pre>\n</body>\n</html>\n''."
        }
      },
      {
        "name": "filter two",
        "reconcileAction": {
          "name": "action2",
          "status": "INPROGRESS",
          "command": "cmd2",
          "commandOutput":'{"result": "SUCCESS", "message": "the server passed parsable JSON object"}',
          "errorMessage": ""
        }
      },
      {
        "name": "filter three",
        "reconcileAction": {
          "name": "action3",
          "status": "COMPLETED",
          "command": "cmd3",
          "commandOutput": "output_string3",
          "errorMessage": ""
        }
      },
      {
        "name": "filter four",
        "reconcileAction": {
          "name": "action4",
          "status": "FAILED",
          "command": "cmd4",
          "commandOutput": `Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet. Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui. Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum.`,
          "errorMessage": "This error occurred during  action4"
        }
      },
      {
        "name": "filter five",
        "reconcileAction": {
          "name": "action5",
          "status": "NOT_STARTED",
          "command": "cmd1"
        }
      },
    ],
    errorMessage: "An error occurred during reconcile enrichment",
    status: "DISCOVERED",
  },
];
module.exports = data;
