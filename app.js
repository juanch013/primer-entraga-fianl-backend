require('dotenv').config();
const express = require('express');
const app = express();
const productsRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

let admin = false

app.use(express.json());

app.use('/productos',productsRoutes);
app.use('/carritos',cartRoutes);


app.listen(8080,()=>{
    console.log("server funcionando");
})