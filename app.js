var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var sesion=require('express-session');
var FileStore=require('session-file-store')(sesion);
var passport = require('passport');
var authenticate = require('./authenticate');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var platoRouter=require('./routes/platoRouter');
var promoRouter=require('./routes/promoRouter');
var chefRouter=require('./routes/chefRouter');
var uploadRouter=require('./routes/uploadRouter');
const mongoose=require('mongoose');
const Platos= require('./modelos/platos');
var config=require('./config');
const url = config.mongoUrl;
const conexion = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
conexion.then((db) => {
  console.log('Conectado correctamente a MongoDB');
}).catch((err) => {
  console.error('Error al conectar con MongoDB:', err.message);
  console.error('Asegúrate de que MongoDB esté instalado y en ejecución (puerto 27017).');
});

var app = express();

// Favicon: responder antes de cualquier otra ruta para evitar 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Redirigir a HTTPS solo en producción (en desarrollo evita problemas con certificado autofirmado)
app.all('*', (req, res, next) => {
  if (req.secure || app.get('env') !== 'production') return next();
  res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/menu', platoRouter);
app.use('/menu/:dishId', platoRouter);
app.use('/promociones', promoRouter);
app.use('/promociones/:id', promoRouter);
app.use('/chefs', chefRouter);
app.use('/chefs/:id', chefRouter);
app.use('/imageUpload', uploadRouter);

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
