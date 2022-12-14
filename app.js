const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');



const indexRouter = require('./routes/index.Route');
const dashboardRouter = require('./routes/dashboard.Route');
const orderRouter = require('./routes/order.Route');
const dishesRouter = require('./routes/dishes.Route');

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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Custom-Header ,Content-Type, Accept,Authorization, token");
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

app.use('/', indexRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/order', orderRouter);
app.use('/api/v1/dishes', dishesRouter);

module.exports = app;
