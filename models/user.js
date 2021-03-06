const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String, 
    email: String,
    password: {
        type: String,
        select : false
    },
    photo: {
        type : String,
        default: "noimage.jpg"
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    account_confirmed: Boolean,
    partner: Boolean
    
});

module.exports = mongoose.model('user', UserSchema)