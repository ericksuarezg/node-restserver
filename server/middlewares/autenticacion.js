const jwt = require('jsonwebtoken');

//=======================
// verificar token
//=======================

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //tomando el toquen de la cabecera de la peticion get

    //verificando el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario; //si la verificacion tiene exito me devuelve el token decodificado
        // por ende el 'decoded.usuario' almacena el 'payload'del token
        next();
    });

    /*    res.json({
           token: token
       }); */
    //para continuar con la ejecucuion donde se esta utilizando este middleware
}

let verificaRoleAdmin = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();

    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }



}


//=======================
// verificar token para imagen por url
//=======================

let verificaTokenUrlImg = (req, res, next) => {
    //NOTA este token de debe ser pegado como parametro en la pagina html en la etiqueta 'img scr'
    let token = req.query.token;
    //verificando el token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario; //si la verificacion tiene exito me devuelve el token decodificado
        // por ende el 'decoded.usuario' almacena el 'payload'del token
        next();
    });


}

module.exports = {
    verificaToken,
    verificaRoleAdmin,
    verificaTokenUrlImg
}