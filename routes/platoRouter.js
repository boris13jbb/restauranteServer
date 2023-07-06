const express=require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const authenticate=require('../authenticate');
const Platos= require('../model/platos');
const platoRouter=express.Router();
platoRouter.use(bodyParser.json());
platoRouter.route('/')
.get((req,res,next) => {
    Platos.find({})
    .then((plato) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    Platos.create(req.body)
    .then((plato) => {
        console.log('Plato creado ', plato);
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /menu');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Platos.deleteOne({})
    .then((resp) => {
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));    
})

platoRouter.route('/:dishId')
.get((req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /menu/'+ req.params.dishId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Platos.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true})
    .then((plato) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
    }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Platos.findByIdAndRemove(req.params.dishId)
    .then((plato) => {
        res.statusCode=200,
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
    }, (err) => next(err))
        .catch((err) => next(err));
});

platoRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if (plato != null){
            res.statusCode=200,
            res.setHeader('Content-Type', 'application/json');
            res.json(plato.comments);
        }
        else{
            err = new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if (plato != null){
            plato.comments.addToSet(req.body);
            plato.save()
            .then((plato) => {
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(plato);
            }, (err) => next(err));
        }
        else{
            err =new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /menu/'+ req.params.dishId + '/comments');
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if (plato != null){
            for (var i=(plato.comments.length -1); i>=0; i--)
                plato.comments.id(plato.comments[i]._id).remove();
            plato.save()
            .then((plato) => {
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(plato);
            }, (err) => next(err));
        }
        else{
            err =new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});

platoRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if(plato !=null && plato.comments.id(req.params.commentId)!= null){
            res.statusCode=200,
            res.setHeader('Content-Type', 'application/json');
            res.json(plato.comments.id(req.params.commentId));
        }
        else if (plato == null){
            err =new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else{
            err =new Error('Comentario '+ req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
    }, (err) => next(err))
        .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion POST no soportada en /menu/'+ req.params.dishId+ '/comments/'+req.params.commentId);
})
.put(authenticate.verifyUser, (req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if(plato !=null && plato.comments.id(req.params.commentId)!= null){
            if (req.body.rating)
                plato.comments.id(req.params.commentId).rating = req.body.rating;
            if (req.body.comment)
                plato.comments.id(req.params.commentId).comment = req.body.comment; 
            plato.save()
            .then((plato) => {
                res.statusCode=200,
                res.setHeader('Content-Type', 'application/json');
                res.json(plato);
            }, (err) => next (err));
        }
        else if (plato == null){
            err =new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else{
            err =new Error('Comentario '+ req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
    }, (err) => next(err))
        .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) => {
    Platos.findById(req.params.dishId)
    .then((plato) => {
        if(plato !=null && plato.comments.id(req.params.commentId)!= null){
            plato.comments.id(req.params.commentId).remove();
            plato.save()
            .then((plato) => {
                res.statusCode=200,
                res.setHeader('Content-Type', 'application/json');
                res.json(plato);
            }, (err) => next (err));
        }
        else if (plato == null){
            err =new Error('Plato '+ req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else{
            err =new Error('Comentario '+ req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
    }, (err) => next(err))
        .catch((err) => next(err));
});
module.exports=platoRouter;