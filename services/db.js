const StateMap = require("./stateMap");
require('dotenv').config();

const fs = require('fs');

const dbFilePath = './database.json';

const getCurrentDT = () => {
  var currentdate = new Date();
  var datetime =
    currentdate.getDate() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getFullYear() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();

  return datetime;
};

function MongoWrapper() {
  this.db = null;

  this.syncFromFile = function () {
    if (fs.existsSync(dbFilePath)) {
      //Not using require to prevent concurrent instances to corrupt.
      this.db = JSON.parse(fs.readFileSync(dbFilePath, 'utf-8'));
    }
  };

  this.syncToFile = function () {
    fs.writeFileSync(dbFilePath, JSON.stringify(this.db, null, 2));
  };

  this.init = cb => {

    this.db = {
      delta: null
    };

    this.syncFromFile();

    cb(true);
  };

  this.storeDelta = function (stateList, cb) {
    const stateWiseData = StateMap.getStateList(stateList);

    this.syncFromFile();

    const deltaCollection = this.db.delta;

    if (!deltaCollection) {
      console.log('\t DB Has NO Delta yet.');
      const stateDeltaMap = StateMap.initDelta(stateWiseData);

      this.db.delta = {
        type: "delta",
        updatedAt: getCurrentDT(),
        deltaMap: stateDeltaMap
      };


    } else {
      console.log('\t DB HAS Delta');

      const {deltaMap} = deltaCollection;

      const deltaDiff = StateMap.findDelta(stateWiseData, deltaMap);

      const toUpdateDoc = {deltaMap: deltaDiff, updatedAt: getCurrentDT()};

      if (deltaDiff["Total"]["isChanged"]) {
        deltaCollection.deltaMap = toUpdateDoc.deltaMap;
        deltaCollection.updatedAt = toUpdateDoc.updatedAt;
        this.syncToFile();
        cb(null, toUpdateDoc);
      } else {
        cb(null, null);
      }
    }

    this.syncToFile();

  };

  this.getDelta = function (cb) {
    cb(this.db.delta);
  };
}

module.exports = new MongoWrapper();
