const express = require("express"),
  app = express(),
  formidable = require('formidable'),
  util = require('util'),
  fs = require('fs-extra'),
  qt = require('quickthumb');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const routes = require('./app/routes');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use(qt.static(__dirname + '/'));

app.use('/api', routes);

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(process.env.PORT || 3000, function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log('running on 3000');
  }
});

module.exports = app;
