const express = require('express');
const mongoose = require('mongoose');
require('./config/config');

const app = express();

const bodyParser = require('body-parser');

// midelweit para las peticiones con parametros 
app.use(bodyParser.urlencoded({ extended: false }))

// midelweit para las peticiones con parametros eb archivo jeson
app.use(bodyParser.json())

app.use(require('./routes/usuario')); //importando todo el archivo 'routs' dentro del midelwait


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