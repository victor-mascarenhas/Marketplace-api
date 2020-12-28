const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    icon: {
        type: String     
    },
    status: {
        type: Boolean,
        default: true
    }   
}, {autoCreate : true})

module.exports = mongoose.model('category', CategorySchema);