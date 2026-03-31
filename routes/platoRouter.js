const express=require('express');
const bodyParser=require('body-parser');
const mongoose= require('mongoose');
const authenticate=require('../authenticate');
const Platos= require('../modelos/platos');
const platoRouter=express.Router();
platoRouter.use(bodyParser.json());
platoRouter.route('/')

    .get(async (req, res, next) => {
        try {
            const plato = await Platos.find({}).populate('comments.author');
            res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
        } catch (err) {
            next(err);
        }
})
    .post(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const plato = await Platos.create(req.body);
        console.log('Plato creado ', plato);
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
        } catch (err) {
            next(err);
        }
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /menu');
})
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const resp = await Platos.deleteOne({});
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
        } catch (err) {
            next(err);
        }
})

platoRouter.route('/:dishId')
    .get(async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId).populate('comments.author');
            res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
        } catch (err) {
            next(err);
        }
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /menu/'+ req.params.dishId);
})
    .put(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const plato = await Platos.findByIdAndUpdate(req.params.dishId, {
                $set: req.body
            }, { new: true });
            res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
        } catch (err) {
            next(err);
        }
})
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const plato = await Platos.findByIdAndRemove(req.params.dishId);
            res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(plato);
        } catch (err) {
            next(err);
        }
});

platoRouter.route('/:dishId/comments')
    .get(async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId).populate('comments.author');
        if (plato != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(plato.comments);
        }
        else{
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
        } catch (err) {
            next(err);
        }
})
    .post(authenticate.verifyUser, async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId);
        if (plato != null){
            req.body.author = req.user._id;
            plato.comments.addToSet(req.body);
            await plato.save();
            const platoActualizado = await Platos.findById(plato._id).populate('comments.author');
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(platoActualizado);
        }
        else{
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
        } catch (err) {
            next(err);
        }
})
.put(authenticate.verifyUser, (req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /menu/'+ req.params.dishId + '/comments');
})
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId);
        if (plato != null){
            for (var i=(plato.comments.length -1); i>=0; i--)
                plato.comments.id(plato.comments[i]._id).remove();
            await plato.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(plato);
        }
        else{
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);
        }
        } catch (err) {
            next(err);
        }
});

platoRouter.route('/:dishId/comments/:commentId')
    .get(async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId).populate('comments.author');
        if(plato !=null && plato.comments.id(req.params.commentId)!= null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(plato.comments.id(req.params.commentId));
        }
        else if (plato == null){
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else{
            err = new Error('Comentario ' + req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
        } catch (err) {
            next(err);
        }
})
.post(authenticate.verifyUser, (req, res, next) =>{
    res.statusCode=403
    res.end('Operacion POST no soportada en /menu/'+ req.params.dishId+ '/comments/'+req.params.commentId);
})
    .put(authenticate.verifyUser, async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId);
        if(plato !=null && plato.comments.id(req.params.commentId)!= null && plato.comments.id(req.params.commentId).author.equals(req.user._id)){
            if (req.body.rating)
                plato.comments.id(req.params.commentId).rating = req.body.rating;
            if (req.body.comment)
                plato.comments.id(req.params.commentId).comment = req.body.comment; 
            await plato.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(plato);
        }
        else if (plato == null){
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else if (plato.comments.id(req.params.commentId) == null){
            err = new Error('Comentario ' + req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
        else {
            err= new Error('No autorizado a actualizar este comentario')
            err.statusCode=403;
            return next(err);
        }
    } catch (err) {
        next(err);
    }
})
    .delete(authenticate.verifyUser, async (req, res, next) => {
        try {
            const plato = await Platos.findById(req.params.dishId);
        if(plato !=null && plato.comments.id(req.params.commentId)!= null && plato.comments.id(req.params.commentId).author.equals(req.user._id)){
            plato.comments.id(req.params.commentId).remove();
            await plato.save();
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(plato);
        }
        else if (plato == null){
            err = new Error('Plato ' + req.params.dishId + 'no encontrado');
            err.statusCode=404;
            return next(err);            
        }
        else if (plato.comments.id(req.params.commentId) == null){
            err = new Error('Comentario ' + req.params.commentId + 'no encontrado');
            err.statusCode=404;
            return next(err);             
        }
        else{
            err= new Error('No autorizado a eliminar este comentario')
            err.statusCode=403;
            return next(err);            
        }
    } catch (err) {
        next(err);
    }
});
module.exports=platoRouter;