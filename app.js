require('dotenv').config();
//console.log(process.env.NODE_ENV);
//const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

//Declare short-id
const ids = require('short-id');
ids.configure({
  length: 12,          // The length of the id strings to generate
  algorithm: 'sha1',  // The hashing algoritm to use in generating keys
  salt: Math.random   // A salt value or function
});

const indexRouter = require('./routes/index.Route');
const orderRouter = require('./routes/order.Route');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//body parser setup
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



//Setup CORS
app.use(function (req, res, next) {
  /*res.header("Access-Control-Allow-Origin", "http://localhost:3004");*/
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Custom-Header ,Content-Type, Accept,Authorization, token");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', indexRouter);
app.use('/api/v1/order', orderRouter);

module.exports = app;
