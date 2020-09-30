const express = require('express');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken'); //libreria para generar 'toquen'
const Usuarios = require('../models/usuario');
const app = express();

module.exports = app;


app.post('/login', (req, res) => {

    let body = req.body;
    Usuarios.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(usuario) o contraseña incorrectas'
                }
            });
        }
        // esta funcion compara las contraseña en encriptacion
        if (!bcript.compareSync(body.password, usuarioDB.password)) {

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario o (contraseña) incorrectas'
                }
            });

        }
        let token = jwt.sign({ // esta funcion genera un toquen cuando se llama
            usuario: usuarioDB //payload o la informacion que queremos enviar 
                //este parametro sera la clave o semilla'seed' que queremos || este parametro es la fecah de caducidad 
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })
    });

});