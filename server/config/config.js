//====================
//     puerto
//====================
//la variable 'PORT' la establece heroku
process.env.PORT = process.env.PORT || 3000; //o en produccion o en desarrollo

//===================
//     Entorno
//===================
//la variable 'NODE_ENV' la establece heroku

//si la variable 'NODE_ENV' existe quiere decir que estmos en produccion y sino es desarrollo
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//====================
//Vencomiento del token
//====================
//60 segundos 
//60 minutos 
//24 horas
//30 dias 

process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

//============================
// clave o  'SEED' de autenticacion
//============================

process.env.SEED = process.env.SEED || 'este-es-el-seed-de-desarrolo';






// ===========================
//       base de datos
// ===========================


let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI; // esta variable'MONGO_URI' ser toma de 'heroku config:set"variable deentorno" '
    //para este caso'mongodb+srv://ericson:JJ2y0Dn9Vj0SyB3H@cluster0.alcjq.mongodb.net/cafe' que
    //es la ruta donde se encuenra la base de datos 
}


process.env.URLDB = urlDB;