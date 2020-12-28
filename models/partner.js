const mongoose = require('mongoose')
const { Schema } = mongoose;

const PartnerSchema = new Schema({
    name: String,  
    email: String,
    password: {
        type: String,
        select : false
    },
    products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
    }],
    account_confirmed: Boolean
    
});

module.exports = mongoose.model('partner', PartnerSchema)