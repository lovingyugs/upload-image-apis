const express = require("express");
const app = express();
const formidable = require('formidable');
const util = require('util');
const fs = require('fs-extra');
const qt = require('quickthumb');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const routes = require('./app/routes');


/*******************************************************
    MIDDLEWARES
********************************************************/
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));
app.use(qt.static(__dirname + '/'));


/*******************************************************
    BASE API ENDPOINT
********************************************************/
app.use('/api', routes);


/*
  Send the index file.
 */
app.get('/', function(req, res) {
  res.sendFile('public/index.html', { root: __dirname });
});

module.exports = app;