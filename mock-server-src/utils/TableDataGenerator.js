const { getIndexedId } = require('./Utils.js');

const STARTS_WITH_FILTER = 'startsWith';
const ENDS_WITH_FILTER = 'endsWith';
const CONTAINS_FILTER = 'contains';
const EQUALS_FILTER  = 'equals';
const DEFAULT_NUMBER_OF_RECORDS = 92;

/**
 * Generate table data cache for a rest end point for FIQL based queries
 *
 * @param {*} baseJSON         - single row of data typically - as will want to scale
 * @param {*} maxRecordCount   - (optional) set a value from controller in case where expect
 *                               low number of rows, such that would not be displaying that data is paginated
 * @param {*} rowCallBack      - (optional) function might call on the row
 * @param {*} noScale          - (optional) set true to just use base data directly
 */
function TableDataGenerator(baseJSON, maxRecordCount = DEFAULT_NUMBER_OF_RECORDS, rowCallBack, noScale) {

  this.data = (noScale) ? baseJSON : scaleData(baseJSON, maxRecordCount, rowCallBack);

  this.getData = function (queryParams) {
    return getPaginatedData(Object.values(this.data), queryParams);
  };

  this.getTotalData = function () {
    return Object.values(this.data);
  };

  this.getKeys = function () {
    return Object.keys(this.data);
  };

  this.delete = function (id) {
    return deleteItem(this.data, id);
  };

  // Delete ONE object that has the specified attribute name / value pair.
  this.deleteItemWithAttribute = function (attributeName, attributeValue) {
    return deleteItemWithAttribute(this.data, attributeName, attributeValue);
  };

  this.addNewData = function (newItem, uniqueAttrName = 'id') {
    return addNewItem(this.data, newItem, uniqueAttrName);
  };

  this.updateData = function (updatedItem) {
    return updateItem(this.data, updatedItem);
  };

  this.find = function (attributeName, attributeValue) {
    return find(this.data, attributeName, attributeValue);
  };

  this.patchData = function (idAttributeName, idValue, updatedValues) {
    const item = find(this.data, idAttributeName, idValue);
    return patchData(item, updatedValues);
  };

  this.getPage = function (idValue, limit) {
    return findPage(this.data, idValue, limit);
  };
}

/**
 * E.g. of queryParams - FIQL
 * {
 *    sort:  "+name"
 *    offset: 10,
 *    limit: 5
 * }
 */
function getPaginatedData(items, queryParams) {
  console.log(`TableDataGenerator #getPaginatedData: queryParams = ${JSON.stringify(queryParams)}`);

  let filteredItems;
  let sortedItems;

  if (queryParams.filters) {

    filteredItems = applyFilters(items, queryParams.filters);
  }

  if (queryParams.sort) {
    sortedItems = applySort((filteredItems || items), queryParams.sort);
  } else {
    sortedItems = filteredItems || items;
  }

  const totalItemsLength = sortedItems.length;

  const offset = (queryParams.offset) ? parseInt(queryParams.offset) : 0;
  const limit = (queryParams.limit) ? parseInt(queryParams.limit) : totalItemsLength;
  const max = ((offset + limit) > totalItemsLength) ? totalItemsLength : (offset + limit);

  const batchedItems = sortedItems.slice(offset, max);
  console.log(`!!!! Paginated grid call : req.offset: ${offset} req.limit: ${limit} returning batch from ${offset} to ${max}`);

  // NOTE: the total is the total number of ALL found items, not the total of the items
  // we're sending back to the client.
  return {
    items: batchedItems,
    totalCount: totalItemsLength,
  };
}

function deleteItem(items, itemId) {
  if (items[itemId]) {
    delete items[itemId];
    return true;
  }
  return false;
}

function deleteItemWithAttribute(items, attributeName, attributeValue) {
  for (const itemId of Object.keys(items)) {
    const item = items[itemId];
    if (item[attributeName] === attributeValue) {
      deleteItem(items, itemId);
      break;
    }
  }
}

function find(items, attributeName, attributeValue) {
  for (const itemId of Object.keys(items)) {
    const item = items[itemId];
    if (item[attributeName] == attributeValue) {
      return item;
    }
  }
  return false;
}

function addNewItem(items, newItem, uniqueAttrName) {
  newItem.id = newItem[uniqueAttrName];
  items[newItem.id] = newItem;
}

function updateItem(items, updatedItem) {
  items[updatedItem.id] = updatedItem;
}

function patchData(item, updatedValues) {
  if (item) {
    Object.keys(updatedValues).forEach((key) => {
      item[key] = updatedValues[key];
    });
  }
}

function findPage(data, idValue, limit) {
  let ix = -1;
  Object.keys(data).find((item) => {
    ix += 1;
    return item === idValue;
  });
  return Math.floor(ix / limit) + 1;
}


function createFilterParamsFromFIQL (filterKeysWithOperations) {
  const filterParams = {};  /* probably a 3pp could do this */
  filterKeysWithOperations.forEach((item) => {
    const equalsIndex = item.lastIndexOf("==");
    const equalsLength = "==".length;
    const filterKey = item.substring(0, equalsIndex);
    const filterValue = item.substring(equalsIndex + equalsLength, item.length);

    console.log("TableDataGenerator #createFilterParamsFromFIQL : Key to filter: " + filterKey);
    console.log("TableDataGenerator #createFilterParamsFromFIQL : Value to filter: " + filterValue);

    const wildCardAtStart = filterValue.startsWith('*');
    const wildCardAtEnd = filterValue.endsWith('*');

    let filterType;
    if (wildCardAtStart && !wildCardAtEnd) {
      filterType = ENDS_WITH_FILTER;
    } else if (!wildCardAtStart && wildCardAtEnd) {
      filterType = STARTS_WITH_FILTER;
    } else if (wildCardAtStart && wildCardAtEnd) {
      filterType = CONTAINS_FILTER;
    } else {
      filterType = EQUALS_FILTER;
    }
    // replaceAll requires Node.js 15.0.0
    const filterValueWildCardRemoved = filterValue.replace(/\*/g, ''); // i.e. replaceAll('*', '')
    filterParams[filterKey] = { value: filterValueWildCardRemoved, filterType };
  });

  return filterParams;

}

/**
 * Using FIQL for filters with a a "filters" key word
 * and they will (from UI) be AND separators (;) as apposed to OR filter joiners (,) and only pass '==' operator.
 *
 * So like: /v1/artifacts?filters=type==SOME_ENUM_TYPE;name==*22
 *
 * with  use of * wildcard for free text
 * 1) contains filter: name == *fred*  
 * 2) startsWith filter: name == fred*
 * 3) endsWith filter: name == *fred
 * 4) equals filter: name == fred
 *
 * @items rowItems  - table row items to filter
 * @param filtersFIQLString - like type==SOME_ENUM_TYPE;name==*something*
 */
function applyFilters(rowItems, filtersFIQLString) {

  /* UI will normally only be making an AND filter, i.e. ";" joiner rather than a "," (OR filter)
    (side note: for filtered jobs for multiple delete use case,
     will use a "," (OR condition) filter - but will handle that case directly in job-controller as have id list)
  */

  const filterKeysWithOperations = filtersFIQLString.split(';');

  if (filterKeysWithOperations.length == 0 && filterKeysWithOperations.constructor == Object) {
    console.log(`TableDataGenerator #applyFilters - no filter found`);
    return items; // no filters
  }
  console.log(`TableDataGenerator #applyFilters: filtersFIQLString is ${filtersFIQLString}`);

  const filterParams = createFilterParamsFromFIQL(filterKeysWithOperations); /* probably a 3pp could do this */

  /* UI will only be passing "==" (Equal To) basic operator and support using wildcards (*)
     on both ends if it is a "contains" filter or at the end only for a starts with */
  const filterKeys = Object.keys(filterParams);
  const filteredResult = rowItems.filter((item) => {
    for (let i = 0; i < filterKeys.length; i++) {

      const columnItemText = item[filterKeys[i]] != null ? String(item[filterKeys[i]]) : '';

      const filterParamObject = filterParams[filterKeys[i]];

      let foundCondition;
      switch (filterParamObject.filterType) {
        case STARTS_WITH_FILTER:
          foundCondition = columnItemText.startsWith(filterParamObject.value);
          break;
        case ENDS_WITH_FILTER:
          foundCondition = columnItemText.endsWith(filterParamObject.value);
          break;
        case CONTAINS_FILTER:
          foundCondition = columnItemText.indexOf(filterParamObject.value) !== -1;
          break;
        default:
          /* EQUALS_FILTER */
          foundCondition = columnItemText === filterParamObject.value;
      }

      if (!foundCondition) {
        return false;
      }
    }
    return true; // must satisfy ALL in filter
  });
  return filteredResult;
}

/**
 * Sort items based on an attribute
 * @param {*} items      items to sort
 * @param {*} sortValue  FIQL sort value, e.g "+name" or "-name" for sorting on name attribute
 * @returns  sorted item objects
 */
function applySort(items, sortValue) {
  const val = sortValue.replace(/\s/g, '');
  const firstChar = val.charAt(0);

  console.log(`TableDataGenerator #applySort: FIQL firstChar is ${firstChar}  (+ or - would be desired)`);
  // + not getting through to here
  const sortDir = (firstChar == '-') ? '-' : '+';
  const sortAttr = (firstChar == '-' || firstChar == '+') ? val.substring(1, sortValue.length) : val;

  console.log(`TableDataGenerator #applySort: Sorting data by ${sortAttr} in ${(sortDir == '+' ? 'an ascending' : 'a descending')} order`);


  function numberCompare (item1, item2, isAscending){
    const num1 = parseFloat(item1[sortAttr]);
    const num2 = parseFloat(item2[sortAttr]);
    return isAscending ? num1 - num2 : num2 - num1;
  }

  // check item 1 - (all column has same types)
  function isItemOneANumber(item1) {
    return !isNaN(parseFloat(item1[sortAttr])) && isFinite(item1[sortAttr]);
  }

  function ascComparator(item1, item2) {
    if (item1[sortAttr] && item2[sortAttr]) {
      if (isItemOneANumber(item1)){
        return numberCompare(item1, item2, true);
      }
      return (item1[sortAttr].toString()).localeCompare(item2[sortAttr].toString());
    }
    return (item2[sortAttr] == null ? 0 : 1);
  }

  function descendingComparator(item1, item2) {
    if (item1[sortAttr] && item2[sortAttr]) {
      if (isItemOneANumber(item1)){
        return numberCompare(item1, item2, false);
      }
      return (item2[sortAttr].toString()).localeCompare(item1[sortAttr].toString());
    }
    return (item1[sortAttr] == null ? 0 : 1);
  }

  if (sortDir == '+') {
    items.sort(ascComparator);
  } else {
    items.sort(descendingComparator);
  }
  return items;
}

function scaleData(baseJSON, desiredRecordCount, rowCallBack) {
  const itemMap = {};
  if (desiredRecordCount > 0) {
    var item;

    // If baseJSON has multiple values, add them all to itemMap.
    let startIndex = 0;
    for (let entry of baseJSON) {
      item = JSON.parse(JSON.stringify(entry));
      const id = item.id || item.objectId;
      itemMap[id] = item;
    }

    for (let i = startIndex + 1; i < desiredRecordCount; i++) {
      item = JSON.parse(JSON.stringify(baseJSON[0]));

      item.id = getIndexedId(); // all tables have to have id (its is indexed not a UUID)
      if (item.name) {
        item.name = `${item.name}-${i}`;
      }

      if (item.description) {
        item.description = `${item.description} ${i}`;
      }

      Object.keys(item).forEach((key) => {
        if (isBoolean(item[key])) {
          item[key] = Math.floor(Math.random() * 2) === 0;
        } else if (isIpAddr(item[key])) {
          item[key] = generateIpAddr();
        } else if (isDate(item[key])) {
          item[key] = generateDate();
        }
      });
      if (rowCallBack) {
        item = rowCallBack(item, i);
      }
      itemMap[item.id] = item;
    }
  }

  return itemMap;
}

function isIpAddr(v) {
  return (typeof (v) === 'string' && v.match(/^\d+\.\d+\.\d+\.\d+$/g) !== null);
}

function generateIpAddr() {
  return `${rnd(255)}.${rnd(255)}.${rnd(255)}.${rnd(255)}`;
}

function isDate(v) {
  return (typeof (v) === 'string' && v.match(/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\dZ$/g) !== null);
}

// Dates from server will be ISO-8601 -> 1970-01-01T00:00:00Z.
function generateDate() {
  return `2023-0${rnd(8) + 1}-${rnd(2)}${rnd(8)+1}T${rnd(1)}${rnd(9)}:${rnd(5)}${rnd(9)}:${rnd(5)}${rnd(9)}Z`;
}

function isBoolean(v) {
  return (v === 'true' || v === 'false' || typeof (v) === 'boolean');
}

function rnd(maxValue) {
  return Math.round(Math.random() * maxValue);
}

module.exports = TableDataGenerator;
