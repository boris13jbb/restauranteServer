var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt=require('passport-jwt').ExtractJwt;
var jwt= require('jsonwebtoken');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./modelos/user');
const config = require('./config');

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, cb) => {
    process.nextTick(() => cb(null, { id: user.id, username: user.username, admin: user.admin }));
});
passport.deserializeUser((user, cb) => {
    process.nextTick(() => cb(null, user));
});

exports.getToken= function(user){
    return jwt.sign(user, config.secretKey, 
        {expiresIn: 3600});
};
var opts={};
opts.jwtFromRequest=ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey= config.secretKey;
exports.jwPassport= passport.use(new JwtStrategy (opts,
    async (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        try {
            const user = await User.findOne({ _id: jwt_payload._id });
            if (user)
                return done(null, user);
            else
                return done(null,false);
        } catch (err) {
            return done(err, false);
        }
    }));

exports.verifyUser = passport.authenticate('jwt', { session: false});

exports.verifyAdmin = async function (req, res, next) {
    try {
        const user = await User.findOne({ _id: req.user._id });
        if (user && user.admin) {
            next();
        }
        else {
            err = new Error('No autorizado a realizar esta accion!');
            err.status = 403;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
};