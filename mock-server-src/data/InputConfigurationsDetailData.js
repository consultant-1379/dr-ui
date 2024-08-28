/**
 * Inputs for create job - from inputs property in
 * InputConfigurationDto in schema
 */
const data =

{
  "301": {

    "id": "301",
    "name": "my inputs",
    "description": "A description of 301 inputs",
    "inputs": [
      {
        "name": "vimZone",
        "value": "cork"
      },
      {
        "name": "vimProjectName",
        "value": "erad"
      },
      {
        "name": "userName",
        "value": "joe"
      },
      {
        "name": "stepValue",
        "pickList": [
          1,
          2,
          3
        ]
      }]
  },
  "302": {
    "id": "302",
    "name": "my inputs",
    "description": "A description of 302 inputs",
    "inputs": [
      {
        "name": "vimZone2",
        "value": "athlone"
      },
      {
        "name": "vimProjectName2",
        "value": "anvil"
      },
      {
        "name": "userName2",
        "value": "jane"
      },
      {
        "name": "stepValue",
        "pickList": [
          "dick",
          "moe",
          "larry"
        ]
      }]
  },
  "303": {
    "id": "303",
    "name": "my inputs",
    "description": "A description of 203 inputs",
    "inputs": [
      {
        "name": "vimZone",
        "value": "athlone"
      },
      {
        "name": "vimProjectName",
        "value": "autumn"
      },
      {
        "name": "userName",
        "value": "harry"
      },
      {
        "name": "stepValue",
        "value": "some text"

      }]

  }
};
module.exports = data;