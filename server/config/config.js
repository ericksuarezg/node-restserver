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


// ===========================
//       base de datos
// ===========================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://ericson:JJ2y0Dn9Vj0SyB3H@cluster0.alcjq.mongodb.net/cafe';
}


process.env.URLDB = urlDB;