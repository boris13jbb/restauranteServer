var express = require('express');
var passport= require('passport');
var authenticate=require('../authenticate');
//const {authenticate} = require('passport');
const bodyParser=require('body-parser');
var User=require('../model/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/registrarse', (req,res,next) => {
  User.register(new User({username: req.body.username}),
  req.body.password, (err, user) => {
    if(err){
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});      
    }
    else{
      passport.authenticate('local')(req, res, () => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: true, status: 'Registro correcto!'});
      });
    }
  });
});

router.post('/login', passport.authenticate('local'), (req,res,next) => { 
  var token= authenticate.getToken({_id: req.user._id});
  res.statusCode=200;
  res.setHeader('Content-Type', 'application/json');
  res.json({success: true, token: token, status: 'Acceso satisfactorio'});
});

router.get('/logout', (req,res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
