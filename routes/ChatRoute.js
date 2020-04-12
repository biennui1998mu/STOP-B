const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require("../middleware/check-auth");

// -------------------------------------------------------------------------------------
// io.sockets.emit gửi tới toàn bộ server
// socket.emit gửi tới chính nó
// socket.broadcast.emit gửi tới toàn bộ server trừ chính nó
// io.to("socketid").emit() gửi tới người có socketid
// socket.adapter.rooms Show danh sách room đang có


// Socket.io cho chat

module.exports = router;
