const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    genre: {
        type: String,
        enum: ['fiction','sci-fi','romance','thriller','history']
    },
    img: {
        type: String,
    }, 
    author: {
        type: String,
        required: true
    },
    qty: {
        type: Number,
        required: true
    }
})
const Product = mongoose.model('Product', productSchema);

module.exports = Product;