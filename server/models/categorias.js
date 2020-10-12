const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let categoriaSchema = new Schema({
    descripcion: { type: String, unique: true, required: [true, 'La descripción es obligatoria'] },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' } //hace referencia a loa id de 'Usuario'
});
module.exports = mongoose.model('Categoria', categoriaSchema);