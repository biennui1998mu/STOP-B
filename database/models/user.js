const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const  userSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    username : {
        type: String,
        required: true,
        unique: true},
    password : {
        type: String,
        required: true,
        // match: /^[a-zA-Z]\w{3,14}$/
    },
    name : {type: String, required: true},
    dob : {type: Date, required: true},
    avatar : String
});

module.exports = mongoose.model('User' ,userSchema);
