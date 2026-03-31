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

// Conexión a MongoDB sin opciones obsoletas (Mongoose 8+)
mongoose.connect(url)
  .then((db) => {
    console.log('Conectado correctamente a MongoDB');
  })
  .catch((err) => {
    console.error('Error al conectar con MongoDB:', err.message);
    console.error('Asegúrate de que MongoDB esté instalado y en ejecución (puerto 27017).');
  });

var app = express();

// Favicon: responder antes de cualquier otra ruta para evitar 404
app.get('/favicon.ico', (req, res) => res.status(204).end());

// Redirección a HTTPS deshabilitada temporalmente (solo HTTP para desarrollo)

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

// Rutas para las vistas HTML (deben ir ANTES de los redireccionamientos)
app.get('/menu/vista', (req, res) => {
  res.render('menu', { title: 'Nuestro Menú - Restaurante Delicioso' });
});
app.get('/promociones/vista', (req, res) => {
  res.render('promociones', { title: 'Promociones - Restaurante Delicioso' });
});

// Redireccionar /menu y /promociones a sus respectivas vistas
app.get('/menu', (req, res) => {
  res.redirect('/menu/vista');
});
app.get('/promociones', (req, res) => {
  res.redirect('/promociones/vista');
});

// Endpoints API para datos
app.use('/menu/api-data', platoRouter);
app.use('/menu/:dishId', platoRouter);
app.use('/promociones/api-data', promoRouter);
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
