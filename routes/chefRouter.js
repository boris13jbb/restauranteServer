const express=require('express');
const bodyParser=require('body-parser');
const chefRouter=express.Router();
chefRouter.use(bodyParser.json());
chefRouter.route('/')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar todos los datos de los chefs');
})
.post((req, res, next) =>{
    res.end('Se va agregar el chef:'+ req.body.name + 'con los datos: '+ req.body.description);
})
.put((req,res,next) => {
    res.statusCode=403;
    res.end('La operacion PUT no esta permitida en /chef');
})
.delete((req,res,next) => {
    res.end('Borrando todos los chefs!');
});

chefRouter.route('/:id')
.all((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) => {
    res.end('Se van a enviar detalles del chef: '+ req.params.id+' a ti!');
})
.post((req, res, next) =>{
    res.statusCode=403
    res.end('Operacion no soportada en /chefs/'+ req.params.id);
})
.put((req,res,next) => {
    res.write('Actualizando el chef: '+ req.params.id+'\n');
    res.end('Se va a actualizar el chef: '+ req.body.name+ ' con los detalles '+ req.body.description);
})
.delete((req,res,next) => {
    res.end('Borrando el chef: '+ req.params.id);
});
module.exports=chefRouter;