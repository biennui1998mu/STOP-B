const express = require('express');
const mongoose = require('mongoose');

const mongoDB = 'mongodb://localhost:27017/stopb';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


