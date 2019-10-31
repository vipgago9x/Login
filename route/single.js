let express = require('express');
let app = express();
let model = require('../models/model');
let Products = model.products;
app.get('/single/:id', (req, res) => {
    let id = req.params.id;
    Products.find((err, data) => {
        let product = data.find(products => products._id == id);
        return res.render('single', { req: req, product: product });
    });
});
module.exports = app;