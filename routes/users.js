var express = require('express');
var passport = require('passport');
const bodyParser = require('body-parser');
var User = require('../model/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registrarse', (req, res, next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) =>{
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else{
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({status: 'Registrado correctamente', user: user});
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({succes: true, status: 'Acceso satisfactorio'});
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
