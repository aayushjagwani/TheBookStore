const mongoose = require('mongoose');
const Product = require('../models/product');
const book = require('./seed');

mongoose.connect('mongodb://localhost:27017/bookStore', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
      console.log("Mongo Connection Open!!");
  })
  .catch(err => {
      console.log("ERROR");
      console.log(err);
  })

const seedDB = async () => {
    await Product.deleteMany({});
    for(let i=0;i<book.length;i++) {
        const store = new Product({
            name: book[i].name,
            price: book[i].price,
            genre: book[i].genre,
            img: book[i].img,
            author: book[i].author,
            qty: book[i].qty
        });
        await store.save();
    }
    
}

seedDB();