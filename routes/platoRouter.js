const express=require('express');
const bodyParser=require('body-parser');
const platoRouter=express.Router();
platoRouter.use(bodyParser.json());
platoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar todos los datos de los platos');
})
.post((req, res, next) =>{
    res.end('Se va agregar el plato:'+ req.body.name + 'con los datos: '+ req.body.description);
})
.put((req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /menu');
})
.delete((req,res,next) => {
    res.end('Borrando todos los platos!');
});

platoRouter.route('/:dishId')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar detalles del plato: '+ req.params.dishId+' a ti!');
})
.post((req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /dishId'+ req.params.dishId);
})
.put((req,res,next) => {
    res.write('Actualizando el plato: '+ req.params.dishId+'\n');
    res.end('Se va a actualizar el plato: '+ req.body.name+ ' con los detalles '+ req.body.description);
})
.delete((req,res,next) => {
    res.end('Borrando el plato: '+ req.params.dishId);
});
module.exports=platoRouter;