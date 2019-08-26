let mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Work');

let userSchema = mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
});

let userGGSchema = mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
});
let userFBSchema = mongoose.Schema({
    name: String,
    email: String,
    pwd: String,
});


let User = mongoose.model('user', userSchema);
let UserGG = mongoose.model('usergg', userGGSchema);
let UserFB = mongoose.model('userfb', userFBSchema);


module.exports.user = User;
module.exports.usergg = UserGG;
module.exports.userfb = UserFB;