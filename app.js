var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
require('dotenv').config();


var indexRouter = require("./routes/index");
var covidRouter = require("./routes/covid");

const useMock = process.env.USE_MOCK;

console.log(`useMock = ${!!useMock}`);

let covidApiURL = useMock ? 'http://localhost:4500/covid-data-init' : 'https://api.covid19india.org/data.json';

const MongoWrapper = require("./services/db");
const axios = require("axios");

var app = express();
var cors = require("cors");
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "build")));

app.use("/", indexRouter);
app.use("/covid-data", covidRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

//utilty
const getCurrentDT = () => {
  var currentdate = new Date();
  var datetime =
    "Last Sync: " +
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
// store delta
/**
 * Connect to MongoDB.
 *
 */

const deltaStore = () => {

  console.log(`Handling deltaStore`);

  axios
    .get(covidApiURL)
    .then(function (response) {
      // handle success
      let stateList = response.data.statewise;


      MongoWrapper.storeDelta(stateList,
        (err, data) => {
          if (err) console.error('storeDelta error', err);
          if (data) console.log("Store Success");
          if (!err && !data) console.log('No updates happened');
        });
    })
    .catch(function (error) {
      // handle error
      console.error('deltaStore axios', error);
    });
};

// added a timeout because of the HERUKU error.
MongoWrapper.init((data) => {
  console.log('\t DB initialized');
  setTimeout(() => {
    console.log('\t\t DB initialized');
    deltaStore();
  }, 1000);
});

console.log(`APP.js loaded.`);

module.exports = app;
