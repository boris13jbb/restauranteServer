const express=require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const authenticate=require('../authenticate');
const Chefs= require('../model/chefs');
const chefRouter=express.Router();
chefRouter.use(bodyParser.json());
chefRouter.route('/')
.get((req,res,next) => {
    Chefs.find({})
    .then((chef) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(chef);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    Chefs.create(req.body)
    .then((chef) => {
        console.log('Chef creado ', chef);
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(chef);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /chefs');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Chefs.deleteOne({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
});

chefRouter.route('/:id')
.get((req,res,next) => {
    Chefs.findById(req.params.id)
    .then((chef) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(chef);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /chefs/'+ req.params.id);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Chefs.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, {new: true})
    .then((chef) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(chef);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Chefs.findByIdAndRemove(req.params.id)
    .then((chef) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(chef);
    }, (err) => next(err))
        .catch((err) => next(err));
});

module.exports=chefRouter;