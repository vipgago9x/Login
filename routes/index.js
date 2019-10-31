var express = require('express');
var app = express();
let cookieParser = require('cookie-parser');
/* GET home page. */
app.use(cookieParser());

app.get('/', function(req, res, next) {
    let a = Math.random() * (99999 - 10000) + 10000;
    if (req.cookies.id) {
        console.log(req.cookies.id);
    } else {
        res.cookie('id', a.toString(), { maxAge: 1000 * 60 * 60 * 24 });
        console.log('Add id into cookie');
    }
    res.render('index', { req: req });
});


module.exports = app;