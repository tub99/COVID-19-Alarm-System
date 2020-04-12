const MongoClient = require("mongodb").MongoClient;
const StateMap = require("./stateMap");
require('dotenv').config();

const Constants = {
  MONGODB_URI: process.env.DB_URI
};


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
  this.init = cb => {
    const uri = Constants.MONGODB_URI;
    const client = new MongoClient(uri, {useNewUrlParser: true});
    client.connect(err => {
      console.log("DB connected");
      this.db = client.db("covid_db");
      cb(true);
    });
  };

  this.storeDelta = function (stateList, cb) {
    const stateWiseData = StateMap.getStateList(stateList);

    const deltaCollection = this.db.collection("delta");

    deltaCollection.findOne({type: "delta"}, (err, item) => {
      if (err) {
        console.error('MongoWrapper.storeDelta', err);
        cb(err, null);
      }

      if (!item) {
        console.log('\t DB Has NO Delta yet.');
        const stateDeltaMap = StateMap.initDelta(stateWiseData);
        const delta = {
          type: "delta",
          updatedAt: getCurrentDT(),
          deltaMap: stateDeltaMap
        };
        deltaCollection.save(delta, {w: 1}, (err, result) => {
          if (err) cb(err, null);
          cb(null, result);
        });
      } else {
        console.log('\t DB HAS Delta');

        const {deltaMap} = item;

        const deltaDiff = StateMap.findDelta(stateWiseData, deltaMap);

        const toUpdateDoc = {deltaMap: deltaDiff, updatedAt: getCurrentDT()};

        if (deltaDiff["Total"]["isChanged"]) {
          deltaCollection.update(
            {type: "delta"},
            {$set: toUpdateDoc},
            (err, res) => {
              if (err) {
                console.error('\t No Updates happened');
                cb(err, null);
              } else {
                console.log('\t New Updates Happened');
                cb(null, toUpdateDoc);
              }

            }
          );
        } else {
          cb(null, null);

        }
      }
    });
  };

  this.getDelta = function (cb) {
    const deltaCollection = this.db.collection("delta");
    deltaCollection.findOne({type: "delta"}, (err, item) => {
      if (err) {
        console.log(err);
        cb(err);
      }
      cb(item);
    });
  };
}

module.exports = new MongoWrapper();
