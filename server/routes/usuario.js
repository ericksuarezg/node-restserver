const express = require('express');
const bcript = require('bcrypt'); //paquete para encriptar datos (contraseña en este caso)
const _ = require('underscore'); // paquete para validaciones para peticiones 'put' 'actualizar'
const app = express();
const { verificaToken } = require('../middlewares/autenticacion');
const { verificaRoleAdmin } = require('../middlewares/autenticacion');
const Usuarios = require('../models/usuario');
//const usuario = require('../models/usuario');



//'verificaToken' es un middleware va como segundo parametro y si se ejecuta, el siguiene parametro
//no se 'funcion anonima' no se ejecutara si no sellama al'next' del middleware 
app.get('/usuarios', verificaToken, function(req, res) {

        return res.json({
            usuario: req.usuario,
            nombre: req.usuario.nombre,
            email: req.usuario.email
        });



        /* res.json(req.query); */ //la el atributo 'query' del 'req' devuelve las variebles enviadas por el ususario
        let desde = req.query.desde || 0;
        desde = Number(desde);

        let limite = req.query.limite || 5;
        limite = Number(limite);

        //busca usuarios con 'role'  de 'actor' y solo me retornara las propiedades 'nombre' 'email' 
        Usuarios.find({ /* role: 'actor' */ }, 'nombre email') //el modelo define el metodo que busca los reguistros
            /* .skip(desde)
            .limit(limite) */
            .exec((err, usuarios) => { // ejecuta la query
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                res.json({
                    ok: true,
                    usuarios
                })
            })
    }) // arreglo de middlewest
app.post('/usuarios', [verificaToken, verificaRoleAdmin], function(req, res) {

    let body = req.body; //obtiene el cuerpo de la peticon del navegador 

    let usuario = new Usuarios({ //instanciando nuevamente la clase para darle a los parametros enviados
        nombre: body.nombre,
        email: body.email,
        password: bcript.hashSync(body.password, 10), //encriptando contraseña 
        // dos agumentos, la variable a encriptar y el nivel de dificultad
        role: body.role
    })



    usuario.save((err, usuarioDB) => { //funcion para guardar los adtos en la base de datos
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })

    /*  if (body.nombre === undefined) {
         res.status(400).json({
             ok: false,
             mensaje: 'el nombre es necesario'
         })

     } else {
         res.json({
             persona: body
         });
     } */

})

// metodo 'put' para actualizar infromacion  
app.put('/usuarios/:id', [verificaToken, verificaRoleAdmin], function(req, res) {
    // con la propiedad 'params' del 'req' se obtienen los valores de los parametros enviados
    let id = req.params.id;
    let body = req.body;

    if (body.role != 'ADMIN_ROLE' && 'USER_ROLE') {
        delete body.role;
    }

    //desde el modelo se actualiza la base de datos 
    Usuarios.findByIdAndUpdate(id, body, { new: true }, (err, usuarioDB) => {
        if (err) {
            res.status.json({
                ok: false,
                err
            })
        } else {
            res.json({
                ok: true,
                usuario: usuarioDB
            });
        }


    })

})
app.delete('/usuarios/:id', [verificaToken, verificaRoleAdmin], function(req, res) {
    let id = req.params.id;
    let estado = {
        estado: false
    }

    Usuarios.findByIdAndUpdate(id, estado, (err, usuarioborrado) => {
        if (err) {
            res.status.json({
                ok: false,
                err
            })
        }
        if (usuarioborrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'usuario no encontrado'
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuarioborrado
        });
    })
})



module.exports = app; // !importante¡ este modulo puede exportar todo el archivo como en este caso
// o solamente una variable en formato json