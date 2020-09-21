const express = require('express');
require('./config/config');
const app = express()
const bodyParser = require('body-parser');

// midelweit para las peticiones con parametros 
app.use(bodyParser.urlencoded({ extended: false }))

// midelweit para las peticiones con parametros eb archivo jeson
app.use(bodyParser.json())

app.get('/usuarios', function(req, res) {
    res.json('get usuario');
})
app.post('/usuarios', function(req, res) {
    let body = req.body; //obtiene el cuerpo de la peticon del navegador 

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'el nombre es necesario'
        })
    } else {
        res.json({
            persona: body
        });
    }

})

// metodo 'put' para actualizar infromacion  
app.put('/usuarios/:id', function(req, res) {
    // con la propiedad 'params' del 'req' se obtienen los valores de los parametros enviados
    let id = req.params.id
    res.json({
        id: id
    });
})
app.delete('/usuarios', function(req, res) {
    res.json('delete usuario');
})

app.listen(process.env.PORT, () => {
    console.log(`escuchando peticiones por el puerto 3000`);
});