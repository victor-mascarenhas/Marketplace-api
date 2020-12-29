const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    status: {
        type: Boolean,
        default: true
    }   
}, {autoCreate : true})

module.exports = mongoose.model('category', CategorySchema);