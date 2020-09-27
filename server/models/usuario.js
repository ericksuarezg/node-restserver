const mongoose = require('mongoose'); //requiriendo 'mongoose'
const uniqueValidator = require('mongoose-unique-validator'); //paquete para manejar atributos  
// como 'unique' en la base de datos mongo OJO

let rolesValidos = { // objeto con los valores de los campos que acepta el campo 'role'
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol valido' //el value es el valor que envio el usuario
}

let Schema = mongoose.Schema; //tomando la clase 'Squema'

let usuarioSchema = new Schema({ //instanciando la clase 'schema' para agregar una coleccion
    nombre: {
        type: String, // tipo de datoq ue va a almacenar 
        required: [true, 'el nombre es necesario']
    },
    email: {
        type: String,
        unique: true, // este atributo es manejado por el paquete 'mongoose-unique-validator'
        required: [true, 'El coreo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }

});


//creando un nuevo metodo para enviar de regreso los datos del usuario sin el password
// este metodo se ejecuta en el momento mismo de instanciar la clase
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

//diciendole al schema 'usuarioSchema' que utilice el paquete  'uniqueValidator'
//el 'PATH' se refiere a el atributo que debe ser unico 
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
//exportando el modelo pero colocandole el nombre 'Usuario'
module.exports = mongoose.model('Usuario', usuarioSchema);