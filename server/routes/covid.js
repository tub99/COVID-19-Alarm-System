const express = require("express");
const axios = require("axios");
const router = express.Router();
const StateMap = require("./../services/stateMap");

/* GET users listing. */
router.get("/", function(req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function(response) {
      // handle success
      let stateList = response.data.statewise;
      
     const stateWiseData = StateMap.getStateList(stateList);
      res.send(stateWiseData);
    })
    .catch(function(error) {
      // handle error
      res.error(error);
    })
 
});

router.get("/delta", function(req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function(response) {
      // handle success
      console.log(response.data)
      let stateList = response.data.statewise;
      
     const deltaList = StateMap.getDeltaList(stateList);
     console.log(deltaList.deltaMap);
      res.send(deltaList);
    })
    .catch(function(error) {
      // handle error
      res.error(error);
    })
 
});

module.exports = router;
