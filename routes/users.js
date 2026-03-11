var express = require('express');
var passport= require('passport');
var authenticate=require('../authenticate');
//const {authenticate} = require('passport');
const bodyParser=require('body-parser');
var User=require('../modelos/user');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', authenticate.verifyUser, authenticate.verifyAdmin,  function(req, res, next) {
  User.find({})
  .then((users) =>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
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
  const done = (err) => {
    if (err) return res.status(500).json({ err: err.message || err });
    res.redirect('/');
  };
  // Passport 0.6 requiere callback; versiones anteriores no.
  if (typeof req.logout === 'function' && req.logout.length > 0) req.logout(done);
  else {
    try { req.logout(); } catch (e) { return done(e); }
    done();
  }
});

module.exports = router;
