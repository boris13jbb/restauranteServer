const express=require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const authenticate=require('../authenticate');
const Promos= require('../modelos/promociones');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')

.get((req,res,next) => {
    Promos.find({})
    .then((promocion) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(promocion);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    Promos.create(req.body)
    .then((promocion) => {
        console.log('Promocion creada ', promocion);
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promocion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /promociones');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promos.deleteOne({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});


promoRouter.route('/:id')
.get((req,res,next) => {
    Promos.findById(req.params.id)
    .then((promocion) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(promocion);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /promociones/'+ req.params.id);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promos.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true})
    .then((promocion) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(promocion);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    Promos.findByIdAndRemove(req.params.id)
    .then((promocion) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(promocion);
    }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports=promoRouter;