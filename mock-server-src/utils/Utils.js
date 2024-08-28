const MAX_INDEXED_ID = 1000;

let indexedIdPool = null;

/* shared pool for feature pack ids, job ids and object ids */
const _generateIndexedIds = function () {
  const idPool = [];
  for (let i = 1; i < MAX_INDEXED_ID; i++) {
    idPool.push(i);
  }
  return idPool;
}

function getIndexedId () {
  if (!indexedIdPool || indexedIdPool.length === 0){
    indexedIdPool = _generateIndexedIds();
  }
  return indexedIdPool.shift().toString();
}

function createUUID() {
    let dt = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}
module.exports = {
    createUUID,
    getIndexedId,
};
