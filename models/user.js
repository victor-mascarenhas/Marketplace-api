const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: String, 
    email: String,
    password: {
        type: String,
        select : false
    },
    shopping_cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    account_confirmed: Boolean
    
});

module.exports = mongoose.model('user', UserSchema)