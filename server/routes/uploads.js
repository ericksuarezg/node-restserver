const express = require('express');
const fileUpload = require('express-fileupload');
const { report } = require('./producto');
const app = express();
const fs = require('fs'); //verificar archivos del sistema
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

app.use(fileUpload({ useTempFiles: true })); // carga el archivo enviado en 'req.file'

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    //valida tipos 

    let tiposValidos = ['productos', 'usuarios']

    if (tiposValidos.indexOf(tipo) < 0) {


        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'los tipos permitidos son ' + tiposValidos.join(', ')
                }
            })
    }

    //si no existe el archivo O si el archivo esta vacio........
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'no se ha seleccionado ningun archivo'
                }
            });
    }


    let archivo = req.files.archivo; //'archivo' biene de la cabecera de la peticion con ese nombre


    //'split()' segmenta a partir del punto en un array en este caso
    let nombreArchivo = archivo.name.split('.');


    //obteniendo la ultima pocision del array que es donde esta la extencion
    let extencionArchivo = nombreArchivo[nombreArchivo.length - 1]


    //restirngiendo extennciones de archivo
    // extebnciones permitidas 

    let extencionesPermitidas = ['png', 'jpg', 'gif', 'jpge'];




    //busca dentro del array 'extencionesPermitidas' una variable que contenga la extencion del archivo enviado
    if (extencionesPermitidas.indexOf(extencionArchivo) < 0) {

        return req.status(400)
            .json({
                ok: false,
                err: {
                    message: 'el archivo no contiene una extencion permitida'
                }
            })
    }


    //cambiando el nombre al arhivo

    let newNombreArchivo = id + '-' + new Date().getMilliseconds() + '.' + extencionArchivo

    //el archivo cuenta con un metodo 'mv' que lo ubica en la ruta que se le de como parametro
    archivo.mv('uploads/' + tipo + '/' + newNombreArchivo, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        /*  res.json({
             ok: true, // 'join' une las variables del array con lo que va de parametro ', '
             message: 'el archivo se almaceno con exito' + extencionesPermitidas.join(', '),
             extencion: extencionArchivo
         }); */
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, newNombreArchivo);
        } else {
            imagenProducto(id, res, newNombreArchivo);
        }


    });

});

function imagenUsuario(id, res, newNombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {

            borraArchivo(newNombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borraArchivo(newNombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        /*   //creando la ruta incluido el archivo para despues veificar si existe
          let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`)
              // esta funcion verifica si existe la ruta dentro del sistema de archivos   
          if (fs.existsSync(pathImagen)) { //si existe ............
              //funcion 'fs' para borrar archivos
              fs.unlinkSync(pathImagen);
          } */
        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = newNombreArchivo

        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: newNombreArchivo
            })
        })
    });
}

function imagenProducto(id, res, newNombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {

            borraArchivo(newNombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borraArchivo(newNombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        /*   //creando la ruta incluido el archivo para despues veificar si existe
          let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioDB.img}`)
              // esta funcion verifica si existe la ruta dentro del sistema de archivos   
          if (fs.existsSync(pathImagen)) { //si existe ............
              //funcion 'fs' para borrar archivos
              fs.unlinkSync(pathImagen);
          } */
        borraArchivo(productoDB.img, 'productos');

        productoDB.img = newNombreArchivo

        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: newNombreArchivo
            })
        })
    });
}

function borraArchivo(nombreImagen, tipo) {
    //creando la ruta incluido el archivo para despues veificar si existe
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`)
        // esta funcion verifica si existe la ruta dentro del sistema de archivos   
    if (fs.existsSync(pathImagen)) { //si existe ............
        //funcion 'fs' para borrar archivos
        fs.unlinkSync(pathImagen);
    }
}

module.exports = app;