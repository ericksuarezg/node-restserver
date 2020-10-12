const express = require('express');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken'); //libreria para generar 'toquen'

//================ validando TOKEN ================================================
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Usuarios = require('../models/usuario');
const app = express();



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

//============= configuraciones de google ===================================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();

    /* console.log(payload.name);
    console.log(payload.email);
    console.log(payload.picture);
    console.log(payload); */

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }

}





app.post('/google', async(req, res) => {
    let token = req.body.idtoken;

    let googleuser = await verify(token).catch((err) => {
        return res.status(403).json({
            ok: false,
            err: err
        })
    });



    Usuarios.findOne({ email: googleuser.email }, (err, usuarioDB) => {
            if (err) { // si hay error al momento de a consulta el usuario
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (usuarioDB) { // si el usuario exite pero se autentico por la aplicacion y no con google
                if (usuarioDB.google === false) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Debe de usar su autenticacion normal'
                        }
                    });
                } else {
                    let token = jwt.sign({
                        usuario: usuarioDB,
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token,
                    })
                }
            } else { //si el usuario no exiate en la base de datos

                let usuario = new Usuarios();

                usuario.nombre = googleuser.nombre;
                usuario.email = googleuser.email;
                usuario.img = googleuser.img;
                usuario.google = true;
                usuario.password = ':)'

                usuario.save((err, usuarioDB) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            err
                        });
                    }

                    let token = jwt.sign({
                        usuario: usuarioDB
                    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                    return res.json({
                        ok: true,
                        usuario: usuarioDB,
                        token
                    })
                })

            }

        })
        /*  res.json({
             usuario: googleuser
         }); */
});


module.exports = app;