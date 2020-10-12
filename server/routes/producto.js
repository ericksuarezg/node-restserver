const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');
const { populate } = require('../models/producto');
const producto = require('../models/producto');

const app = express();

let Producto = require('../models/producto');


//=============================================================================
// obtener todos los productos
//=============================================================================


app.get('/productos', verificaToken, (req, res) => {
    //paginando
    let desde = req.query.desde || 0;
    desde = Number(desde); //transformando lo que viene en stirng a Numero

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                productoDB
            })
        })

});

//=============================================================================
// obtener un producto por id
//=============================================================================


app.get('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) { // si hay error al momento de a consulta el usuario
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'el producto no existe'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });



});

//=============================================================================
// buscar productos
//=============================================================================

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i') //Funcion para expresion regular que permite busquedas
        //con terminos de palabras cercanos a lo que hay en la base de datos
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productosDB) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            });
        });
});



//=============================================================================
// crear un producto
//=============================================================================


app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible || true,
        usuario: req.usuario._id,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    })







});

//=============================================================================
// actualizar productos
//=============================================================================


app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.descripcion = body.descripcion;
        productoDB.disponible = body.disponible;
        productoDB.categoria = body.categoria;

        productoDB.save((err, productoGuardado) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoGuardado
            })
        })
    });
});

//=============================================================================
// borrar un producto
//=============================================================================


app.delete('/productos/:id', verificaToken, (req, res) => {

    let id = req.params.id

    Producto.findById(id, (err, productoDB) => {
        if (err) { // si hay error al momento de a consulta el usuario
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) { // si hay error al momento de a consulta el usuario
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'el producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                producto: productoBorrado,
                message: 'producto borrado'
            });
        });
    });

});


module.exports = app;