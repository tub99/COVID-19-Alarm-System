const axios = require("axios");
const useMock = process.env.USE_MOCK;
const fetchGap = process.env.FETCH_GAP;

console.log(`useMock = ${!!useMock}`);

let covidApiURL = useMock ? 'http://localhost:4500/covid-data' : 'https://api.covid19india.org/data.json';

let lastFetchTime = Date.now();
let fetchPromise = null;

function getPromise() {

  if (!fetchPromise) {
    fetchPromise = new Promise((resolve) => {
      axios.get(covidApiURL).then(function (response) {
        console.log(`\t [fetcher] Fresh Data fetched.`);
        resolve(response);
      })
    });
  } else {
    console.log(`\t [fetcher] Cached data sent.`);
  }
  return fetchPromise;
}


function getCovidData() {

  var dn = Date.now();

  let gapNow = dn - lastFetchTime;

  let dTime = fetchGap - gapNow;

  console.log(`\t [fetcher] time to next refresh = ${dTime / 1000} seconds`);

  if (dTime < 0) {
    console.log(`\t [fetcher] Reset time reached. Will get fresh response`);
    lastFetchTime = dn;
    fetchPromise = null;
  } else {
  }

  return getPromise()
}

module.exports.getCovidData = getCovidData;