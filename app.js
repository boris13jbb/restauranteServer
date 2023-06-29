var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var platoRouter=require('./routes/platoRouter');
var promoRouter=require('./routes/promoRouter');
var chefRouter=require('./routes/chefRouter');

const mongoose = require ('mongoose');
const PLatos = require ('./model/platos.js');
const url = 'mongodb://localhost:27017/restaurantebdd';
const conexion = mongoose.connect(url);
conexion.then((db) => {
  console.log('Conectado correctamente a MongoDB');
}, (err) => { console.log(err);
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('12345-67890-09876-54321'));
function auth(req, res, next){
  console.log(req.signedCookies);
  if(!req.signedCookies.user){
    var cabeceraAuth = req.headers.authorization;
    if(!cabeceraAuth){
      var err = new Error('No esta autenticado. No ingreso credenciales');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var arregloCredencial = new Buffer.from(cabeceraAuth.split(' ')[1], 'base64').toString().split(':');
    var usuario = arregloCredencial[0];
    var password = arregloCredencial[1];
    if (usuario === 'admin' && password === '1234'){
      res.cookie('user', 'admin', {signed:true});
      next();
    }
    else{
      var err = new Error('No esta autenticado. Credenciales incorrectas');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
  }
  else{
    if(req.signedCookies.user === 'admin'){
      next();
    }
    else{
      var err = new Error('No esta autenticado');
      err.statur = 401;
      return next(err);
    }
  }
}
app.use(auth);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/menu', platoRouter);
app.use('/menu/:dishId', platoRouter);
app.use('/promociones', promoRouter);
app.use('/promociones/:id', promoRouter);
app.use('/chefs', chefRouter);
app.use('/chefs/:id', chefRouter);


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
