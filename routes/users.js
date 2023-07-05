var express = require('express');
const bodyParser = require('body-parser');
var User = require('../model/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registrarse', (req, res, next) => {
  User.findOne({username: req.body.username})
  .then((user) => {
    if(user != null){
      var err = new Error('Usuario ' + req.body.username + 'ya existe');
      err.status = 403;
      next(err);
    }
    else{
      return User.create({
        username: req.body.username,
        password: req.body.password
      })
    }
  })
  .then((user) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registrado correctamente', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) => {
  if(!req.session.user){
    var cabeceraAuth = req.headers.authorization;
    if(!cabeceraAuth){
      var err = new Error('No esta autenticado. No ingreso credenciales');
      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err);
    }
    var arregloCredencial = new Buffer.from(cabeceraAuth.split(' ')[1], 'base64').toString().split(':');
    var username = arregloCredencial[0];
    var password = arregloCredencial[1];
    User.findOne({username: username})
    .then((user) =>{
      if (user == null){
        var err = new Error('Usuario ' + username + ' no existe!');
        err.status = 403;
        return next(err);
      }
      else if(user.password !== password){
        var err = new Error('Su contraseña es incorrecta');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){
        req.session.user = "authenticated";
        res.setHeader('Content-Type', 'text/plain');
        res.end('Esta autenticado');
      }
    })
    .catch((err) => next (err));
  }
  else{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Esta autenticado');
  }
});

router.get('/logout', (req, res) => {
  if(req.session){
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else{
    var err = new Error('No esta logueado!!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
