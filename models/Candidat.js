const mongoose = require('mongoose');
const { fa } = require('@faker-js/faker');

const VoteSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: false
    },
    description: {
        type: String,
        required: true,
        unique: false
    },
    image: {
        type: String,
        required: false,
    },
    vote: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote', required: true }, // Référence à l'utilisateur


},{timestamps: true});



module.exports = mongoose.model('Candidat', VoteSchema);
