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
    });
 
});

router.get("/today", function(req, res, next) {
  axios
    .get("https://api.covid19india.org/data.json")
    .then(function(response) {
      
      let stateList = response.data.statewise;
      
     const todayList = StateMap.getTodayData(stateList);
      res.send(todayList);
    })
    .catch(function(error) {
      // handle error
      res.send(error);
    });
 
});

router.get("/delta", function(req, res, next) {
  axios
    .get("http://localhost:3000/covid-data/today")
    .then(function(response) {
     const delta = StateMap.getDelta();
      res.send(delta);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
      res.send(error);
    });
 
});

module.exports = router;
