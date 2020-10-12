const { constant } = require("underscore");

const express = require('express');

let { verificaToken, verificaRoleAdmin } = require('../middlewares/autenticacion');
let app = express();
let Categoria = require('../models/categorias');
const usuario = require("../models/usuario");
const { findById } = require("../models/usuario");
//============================================================================================
//            muestra odas las categorias
//============================================================================================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion') //ordena la consulta segun lo que se espesifique, en este caso alfabeticamente
        .populate('usuario', 'nombre email') //permite ver la estructura del objeto almacenado 'Usuario' contiene 'Categorias'
        //el segundo argumento especfica los campos que queremos ver
        .exec((err, categoriasDB) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categorias: categoriasDB
            });
        })
});

//============================================================================================
//            muestra una categroia por id
//============================================================================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Categoria.findById(id, (err, categoriasDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriasDB) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'el id  no se encuentra en la base de datos '
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriasDB
        });
    })
});

//============================================================================================
//         crea una nueva categoria
//============================================================================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // si hay error al momento de a consulta el usuario
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================================================================================
//         actualizar categorias
//============================================================================================
app.put('/categoria/:id', (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    }
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // si hay error al momento de a consulta el usuario
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================================================================================
//         borrar categorias
//============================================================================================
app.delete('/categoria/:id', [verificaToken, verificaRoleAdmin], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) { // si hay error al momento de a consulta el usuario
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el id no existe'
                }
            });
        }
        res.json({
            ok: true,
            message: 'categoria borrada'
        });
    })
});



module.exports = app;