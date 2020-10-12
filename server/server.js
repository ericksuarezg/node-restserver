const express = require('express'); //crea servidor y recibe peticiones
const mongoose = require('mongoose'); //manejador de base de datos
const path = require('path'); //paquete nativo de Node  para crear path correctamente al llamra al 
//a la carpeta 'public' con la funcion app.use(express.static(__dirname + '../public')) con el html
require('./config/config');

const app = express(); //clase instanciada de la libreria express a su vez instancia un objeto

const bodyParser = require('body-parser'); //crea un objeto para 

// midelweit para las peticiones con parametros (permite analizar peticiones con parametros en 
//la URL tipo 'Get' o 'Put')
app.use(bodyParser.urlencoded({ extended: false }))

// midelweit para las peticiones con parametros en archivo json, permite analizar peticiones 
// que traen archivos Json
app.use(bodyParser.json());

//===============================================================================================
//   habilitar la carpeta public para que sea accedida desde cualquier lugar
//===============================================================================================

/* app.use(express.static(path.resolve(__dirname, './public'))); */
app.use(express.static(__dirname + '/public')); //solo se ejjecuta en el  directorio raiz

//console.log(path.resolve(__dirname, '../public'));//metodo de Node para verificar un path







app.use(require('./routes/index')); //importando en el app todo el archivo 'index' dentro del midelwait


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('conectado a la base de datos');
});



app.listen(process.env.PORT, () => {
    console.log(`escuchando peticiones por el puerto 3000`);
});