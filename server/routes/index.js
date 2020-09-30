const express = require('express');
const app = express();


app.use(require('./usuario')); //importando todo el archivo 'usuario' dentro del midelwait
app.use(require('./login')); //importando todo el archivo 'login' dentro del midelwait

module.exports = app;