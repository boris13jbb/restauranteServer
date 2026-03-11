const express= require('express');
const bodyParser=require('body-parser');
const authenticate=require('../authenticate');
const multer=require('multer');
const path = require('path');
const fs = require('fs');

const imagesDir = path.join(__dirname, '..', 'public', 'images');
fs.mkdirSync(imagesDir, { recursive: true });
const storage=multer.diskStorage({
    destination: (req,file, cb) => {
        cb(null, imagesDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});
const imageFileFilter= (req,file,cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){
        return cb(new Error('Solo se puede subir imagenes!!'), false);
    }
    cb(null,true);
};
const upload = multer({storage: storage, fileFilter: imageFileFilter});
const uploadRouter=express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode=403;
    res.end('Operacion GET no soportada en /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req,res,next) =>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode=403;
    res.end('Operacion PUT no soportada en /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    res.statusCode=403;
    res.end('Operacion DELETE no soportada en /imageUpload');    
})

module.exports=uploadRouter;