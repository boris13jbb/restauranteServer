const express=require('express');
const bodyParser=require('body-parser');
const promoRouter=express.Router();
promoRouter.use(bodyParser.json());
promoRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar todas las promociones a ti');
})
.post((req, res, next) =>{
    res.end('Se va agregar la promocion:'+ req.body.name + 'con los datos: '+ req.body.description);
})
.put((req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permita en /promociones');
})
.delete((req,res,next) => {
    res.end('Borrando todos las promociones!');
});

promoRouter.route('/:id')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar detalles de la promocion: '+ req.params.id+' a ti!');
})
.post((req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /promociones/'+ req.params.id);
})
.put((req,res,next) => {
    res.write('Actualizando la promocion: '+ req.params.id+'\n');
    res.end('Se va a actualizar la promocion: '+ req.body.name+ ' con los detalles '+ req.body.description);
})
.delete((req,res,next) => {
    res.end('Borrando la promocion: '+ req.params.id);
});
module.exports=promoRouter;