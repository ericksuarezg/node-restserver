const express = require('express');
const app = express();


app.use(require('./usuario')); //importando todo el archivo 'usuario' dentro del midelwait
app.use(require('./login')); //importando todo el archivo 'login' dentro del midelwait
app.use(require('./categorias')); //importando todo el archivo 'categorias' dentro del midelwait
app.use(require('./producto')); //importando todo el archivo 'categorias' dentro del midelwait
app.use(require('./uploads')); //importando todo el archivo 'uploads' dentro del midelwait
app.use(require('./img')); //importando todo el archivo 'img' dentro del midelwait

module.exports = app;