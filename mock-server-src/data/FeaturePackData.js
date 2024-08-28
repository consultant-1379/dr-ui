/**
 * Feature pack detail data for context
 * flyout detail data on Feature pack row click
 * from FeaturePackDto in schema
 */
const data = {
  "id": "12345",
  "name": "Feature pack file",
  "description": "Feature pack file",
  "createdAt": "string",
  "modifiedAt": "string",
  "applications": [
    {
      "id": "101",
      "name": "Reconciliation Application 1",
      "description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    },
    {
      "id": "102",
      "name": "Reconciliation Application 2",
      "description": "Reconciliation application description"
    },
    {
      "id": "103",
      "name": "Reconciliation Application 3",
      "description": "Reconciliation application description"
    },
  ],
  "listeners": [
    {
      "id": "string",
      "name": "string",
      "description": "string"
    }
  ],
  "inputs": [
    {
      "id": "301",
      "name": "Input Configurations 1 name",
      "description": "Input Configurations 1 description"
    },
    {
      "id": "302",
      "name": "Input Configurations 2 name (for job2-def keys)",
      "description": "Input Configurations 2 description"
    },
    {
      "id": "303",
      "name": "Input Configurations 3 name",
      "description": "Input Configurations 3 description"
    }

  ],
  "properties": [
    {
      "name": "prop1",
      "value": {}
    }
  ],
  "assets": [
    {
      "id": "12346",
      "name": "featurePackFile.zip",
      "description": "file uploaded from user file system",
    }
  ]
};

module.exports = data;