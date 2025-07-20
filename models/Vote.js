const mongoose = require('mongoose');
const { fa } = require('@faker-js/faker');

const VoteSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: false
    },
    candidats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Candidat' }], // Référence aux posts
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Référence à l'utilisateur

},{timestamps: true});



module.exports = mongoose.model('Vote', VoteSchema);
