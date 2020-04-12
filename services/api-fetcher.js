const axios = require("axios");


let lastFetchTime = Date.now();
let lastFetchData = false;
let isFetching = true;
let fetchPromise = null;

let all = [];
let expects = [];


function getPromise(someStr) {

  if (!fetchPromise) {
    fetchPromise = new Promise((resolve) => {
      setTimeout(() => {
        lastFetchTime = Date.now();
        resolve(someStr);
      }, 100);
    });
  }
  return fetchPromise;
}

function getCovidData(id) {

  var dn = Date.now();

  console.log(`dn - lastFetch =  ${dn - lastFetchTime}`);

  if (dn > (3000 + lastFetchTime)) {
    lastFetchTime = dn;
    fetchPromise = null;
  }

  getPromise(id).then(function (data) {
    all.push(data);
  });
}

function getDataTest() {


  getCovidData('TEST1-0');
  getCovidData('TEST2-0');
  getCovidData('TEST3-0');

  expects.push('TEST1-0');
  expects.push('TEST1-0');
  expects.push('TEST1-0');

  setTimeout(function () {
    console.log('Timeout 500');

    getCovidData('TEST1-500');
    getCovidData('TEST2-500');
    getCovidData('TEST3-500');

    expects.push('TEST1-0');
    expects.push('TEST1-0');
    expects.push('TEST1-0');

  }, 500);

  setTimeout(function () {
    console.log('Timeout 3500');
    getCovidData('TEST1-3500');
    getCovidData('TEST2-3500');
    getCovidData('TEST3-3500');
    expects.push('TEST1-3500');
    expects.push('TEST1-3500');
    expects.push('TEST1-3500');
  }, 3500);

  setTimeout(function () {
    console.log('Timeout 5000');
    getCovidData('TEST1-5000');
    getCovidData('TEST2-5000');
    getCovidData('TEST3-5000');

    expects.push('TEST1-3500');
    expects.push('TEST1-3500');
    expects.push('TEST1-3500');
    require('fs').writeFileSync('./responses.json', JSON.stringify({all, expects}, null, 2));
    console.log('Data written');
  }, 5000);

}

getDataTest();