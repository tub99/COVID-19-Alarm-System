const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());
const portNumber = 4500;

let d1 = require('./data-01');
let d2 = require('./data-02');

app.get('/covid-data-init', function (req, res) {
  console.log(`COVID Data Init`);
  res.send(d1);
});

app.get('/covid-data', function (req, res) {
  console.log(`COVID Data normal`);
  res.send(d2);
});

app.listen(4500, function () {
  console.log(`App started at ${portNumber}`)
});