const axios = require("axios");


let lastFetchTime = Date.now();
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

  console.log(`promiseCompletes = ${++promiseCompletes}`);
  return fetchPromise;
}

let promiseCompletes = 0;


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
  expects.push('TEST1-0');
  expects.push('TEST1-0');
  expects.push('TEST1-0');

  setTimeout(function () {
    console.log('Timeout 500');

    getCovidData('TEST1-500');
    getCovidData('TEST2-500');
    getCovidData('TEST3-500');


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


    setTimeout(() => {
      require('fs').writeFileSync('./responses.json', JSON.stringify({all, expects}, null, 2));
      console.log('Data written');
    }, 5000);
  }, 5000);

}

getDataTest();