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
        select: false // loai field password ra khoi tat ca cac query default.
    },
    name : {type: String, required: true},
    dob : {type: Date, required: true},
    userStatus: Number,
    avatar : String
});

module.exports = mongoose.model('User' ,userSchema);
