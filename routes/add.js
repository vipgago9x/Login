let express = require('express');
let app = express();
let model = require('../models/model');
let Products = model.products;
let util = require('util');
let formidable = require('formidable');
let fs = require('fs');
let sql = require('mssql');
let config = {
    server: 'localhost',
    database: 'TestImg',
    user: 'zero',
    password: 'hoakute9x',
};


app.route('/add')
    .get((req, res) => {
        if (req.isAuthenticated()) {
            res.render('add', { req: req });
        } else {
            res.redirect('/login');
        }
    })
    .post((req, res) => {
        let form = new formidable.IncomingForm();
        form.uploadDir = './public/uploads/';
        form.parse(req, (err, fields, files) => {
            if (err) throw err;
            let path = files.files.path;
            let newpath = form.uploadDir + files.files.name;
            fs.rename(path, newpath, (err) => {
                if (err) throw err;
                console.log('doi ten thanh cong');
            });
            let image = 'uploads/' + files.files.name;
            let name = util.inspect(fields.name1),
                description = util.inspect(fields.description),
                category = util.inspect(fields.category),
                price = util.inspect(fields.price),
                sex = util.inspect(fields.sex);
            name = name.slice(1, name.length - 1);
            description = description.slice(1, description.length - 1);
            category = category.slice(1, category.length - 1);
            price = price.slice(1, price.length - 1);
            sex = sex.slice(1, sex.length - 1);
            let data = {
                name: name,
                description: description,
                category: category,
                price: price,
                image: image,
                sex: sex,
            }
            let saveInfo = async ()=>{
                let pool = await sql.connect(config);
                await pool.request()
                    .input('name',)
            }
        });
        return res.redirect('/');
    });

module.exports = app;