let express = require('express');
let app = express();
let mongodb = require('mongodb');
let model = require('../models/model');
let Products = model.products;
app.use(express.static(__dirname + '../public'));
app.get('/:sex/:category/:page', (req, res) => {
    const perPage = 3;
    let page = req.params.page || 1;
    let sex = req.params.sex;
    let change = {
        "bags": "Bags",
        "caps&hats": "Caps & Hats",
        "hoodies&sweatshirts": "Hoodies & Sweatshirts",
        "t-shirts": "T-Shirts",
        "shirts": "Shirts",
        "shoes-boots&trainers": "Shoes, Boots & Trainers",
        "shorts": "Shorts",
        "suits&blazers": "Suits & Blazers",
    }
    let category = req.params.category;
    let newCategory = change[category];
    console.log(newCategory);
    Products.find({ sex: sex }, (err, data) => {
        let items = data.filter((item, index, data) => {
            console.log(item.category);
            if (item.category == newCategory) { return item };
        });
        items.splice(0, perPage * (page - 1));
        items.splice(perPage, items.length);
        let quantityPage = Math.ceil(data.length / perPage);
        return res.render('products', { items: items, req: req, quantityPage: quantityPage });
    });
});

module.exports = app;