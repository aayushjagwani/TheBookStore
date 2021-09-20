const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product');
const User = require('./models/user');
const { urlencoded } = require('express');
const methodOverride = require('method-override');
const bcrypt = require('bcrypt');
const session = require('express-session');

mongoose.connect('mongodb://localhost:27017/bookStore', {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
      console.log("Mongo Connection Open!!");
  })
  .catch(err => {
      console.log("ERROR");
      console.log(err);
  })

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(session({ secret: 'aayushjagwani' , resave: false , saveUninitialized: true}));


mongoose.set('useFindAndModify', false);

const categories = ['fiction','sci-fi','romance','thriller','history'];

const requireLogin = (req,res,next) => {
    if(!req.session.user_id)
    {
        return res.redirect('/login');
    }
    else
    {
        next();
    }
}

app.get('/', (req,res) => {
    res.render("home");
})

app.post('/', async (req,res) => {
    const {username,password} = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password: hash
    });
    await user.save();
    res.redirect("home");
})

app.get('/login', (req,res) => {
    if(!req.session.user_id){
        res.render('login');
    }
    else
    {
        res.redirect('/products');
    }
    
})

app.post('/login', async (req,res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user)
    {
        return res.send("try again");
    }
    const validPwd = await bcrypt.compare(password, user.password);
    if(validPwd)
    {
        console.log('logged in!!');
        req.session.user_id = user._id;
        res.redirect('/products');
    }
    else
    {
        res.send("Try again");
    }
})

app.post('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/login');
})

app.get('/products',requireLogin, async (req,res) => {
    const products = await Product.find({});
    res.render("index", { products })
})

app.get('/products/new', requireLogin, (req,res) => {
    res.render('new', { categories})
})

app.post('/products', async (req,res) =>{
    const newData = new Product(req.body);
    await newData.save();
    res.redirect('/products')

})

app.get('/products/:id', requireLogin, async (req,res) => {
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('product', { product })
})

app.get('/products/:id/edit', requireLogin, async (req,res) =>{
    const {id} = req.params;
    const product = await Product.findById(id);
    res.render('edit', { product , categories})
})

app.put('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true});
    console.log(product);
    res.redirect('/products');
})

app.delete('/products/:id', async (req,res) => {
    const {id} = req.params;
    const product = await Product.findByIdAndDelete(id);
    res.redirect('/products');
})


app.listen(3000, () =>{
    console.log("Listening on port 3000")
})