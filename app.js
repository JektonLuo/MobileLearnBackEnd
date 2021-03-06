require('dotenv').load();
var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
//var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');

require('./server/model/db');
require('./server/config/passport');

// setup admin account, delete this line after created
// require('./install');

var routes = require('./server/routes/index');

var app = express();


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Since version 1.5.0, the cookie-parser middleware no longer
// needs to be used for this module to work
//app.use(cookieParser());
app.use(session({
    secret: 'CatOnKeyboard',
    resave: false,
    saveUninitialized: false,
    proxy: 'true',
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000    // a hour
    }
    
    // TODO: need a store for prodect
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());


app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
// Catch unauthorised errors
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401);
    res.json({"message" : err.name + ": " + err.message});
  }
});


// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
