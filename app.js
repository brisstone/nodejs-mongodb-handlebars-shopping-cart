var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
const dotenv = require('dotenv');
var session = require('express-session')
var passport = require('passport');
var flash = require('connect-flash');
var mongoose = require('mongoose');
var validator = require('express-validator')
var MongoStore = require('connect-mongo')(session);

dotenv.config();

mongoose.connect(process.env.MONGOD_URL, {useNewUrlParser: true, useUnifiedTopology: true }, (err)=>{
  if(err){
    console.log('mongodb connection unsuccessful' + err)
  } else{
    console.log('mongodb connection successfull')
  }
})

var routes = require('./routes/index');
var LoginRouter = require('./routes/users/userlogin')
var RegisterRouter = require('./routes/users/userregister');
var ProfileRouter = require('./routes/users/profile');
var LogoutRouter = require('./routes/users/Logout');
var app = express();
require('./config/passport');




// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(session({
  secret: 'superman',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 60 * 1000}
}))
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session())

//create a middleware containing global variable accessible in all templates views
app.use(function(req, res, next){
  // create a variable "login" which is used in the header.hbs to control display of login dropdown(to check authentication)
  res.locals.login = req.isAuthenticated(); 
  //create a variable "session" to make session available in all templates
  res.locals.session = req.session; 
  next()
})

app.use('/', routes);
app.use('/user', LoginRouter);
app.use('/user',RegisterRouter)
app.use('/user',ProfileRouter)
app.use('/user', LogoutRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

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
