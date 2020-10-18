const express = require('express');
const fs = require('fs');
const path = require('path');
const { verificaTokenUrlImg } = require('../middlewares/autenticacion');

let app = express();

app.get('/imagen/:tipo/:img', verificaTokenUrlImg, (req, res) => {

    let tipo = req.params.tipo; //el tipo (usuario o producto)
    let img = req.params.img; //el nombre de la imagen
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);


    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        //esta fncion resuelve la ruta '__dirname' es el directorio actual y el resto la ruta a donde qeremos llegar
        let pathNoImg = path.resolve(__dirname, '../assets/no-image.jpg');
        // esta funcion lee el 'conten/type' del archivo y eso es lo que regresa 
        // como parametro lleva la ruta donde se encuentra importante  usar 'Path'
        res.sendFile(pathNoImg);
    }


});









module.exports = app;