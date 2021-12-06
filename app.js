const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const methodOverride = require('method-override')
const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const auth = require('./components/auth/guard')

// passport
const passportConfig = require('./components/auth/passport-config')
passportConfig(passport)

// hbs helpers
const hbs = require('hbs')
hbs.registerHelper('equals', function (v1, v2) {
  return v1 == v2;
});
hbs.registerHelper('inc', (v) => v+1)
hbs.registerHelper('dec', (v) => v-1)
hbs.registerHelper('in', (v, pool) => pool.includes(v))

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middlewares
// app.use(logger('dev'));
// app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())

// Global consts
app.use((req,res,next) => {
  res.locals.successMes = req.flash('successMes')
  res.locals.errorMes = req.flash('errorMes')
  if (req.user) res.locals.adminName = req.user.name
  next()
})

// Routes
app.use('/', require('./routes/index'));
app.use('/', require('./components/auth'));
app.use('/products', auth.authGuard, require('./components/product'));
app.use('/accounts', auth.authGuard, require('./components/admin'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
