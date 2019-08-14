let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let passport = require('passport');
let flash = require('connect-flash');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session)
let morgan = require('morgan')
let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let apiRouter = require('./routes/api');
let MongoClient = require('mongodb')
let app = express();

// HTTP logging
app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode < 400
  }, stream: process.stderr
}));

app.use(morgan('dev', {
  skip: function (req, res) {
      return res.statusCode >= 400
  }, stream: process.stdout
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    store: new MongoStore({
      clientPromise: MongoClient.connect(process.env.MONGODB_CONNECTION_STRING, { useNewUrlParser: true })
    }),
    secret: '1j2kanoppim4iqi',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
