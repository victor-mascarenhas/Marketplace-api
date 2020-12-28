const mongoose = require('mongoose');

const opts = { 
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  };


const ProductSchema = new mongoose.Schema({    
    photo: {
        type : String,
        required : true
    },
    title: {
        type : String,
        required : true
    },
    partner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'partner',
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    highlight: {
        type : Boolean,
        default: false
    },
    description: {
        type : String,
        required : true
    },
    price: {
        type : Number,
        min: 1,
        required : true
    },
    status: {
        type : Boolean,
        default : true
    },  
}, opts)

module.exports = mongoose.model('product', ProductSchema);