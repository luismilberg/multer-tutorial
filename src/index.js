const express = require('express');
const ejs = require('ejs');
const path = require('path');
const multer = require('multer');
const { v4: uuid } = require('uuid');

// Inicializaciones
const app = express();

// Settings
app.set('port',3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middlewares
const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, uuid() + path.extname(file.originalname));
    },
    destination: path.join(__dirname, 'public/uploads')
});

const multerUpload = multer({
    dest: path.join(__dirname, 'public/uploads'), 
    storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/;
        const mimetype = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null,true);
        };
        cb('Error: el archivo subido no es una imágen');
    }
}).single('image');

app.use(multerUpload);


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(require('./routes/index'));

// Iniciar el servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});