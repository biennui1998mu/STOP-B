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
        required: true
    },
    name : {type: String, required: true},
    dob : {type: Date, required: true},
    userStatus: Boolean,
    avatar : String,
    // friends: {type: [mongoose.Schema.Types.ObjectId]}
});

module.exports = mongoose.model('User' ,userSchema);
