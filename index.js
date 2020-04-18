require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const User = require('./database/models/user');
const Message = require('./database/models/message');
const Room = require('./database/models/room');
const friendRequestSchema = require('./database/models/friendRequest');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb://${username}:${password}@nosama-shard-00-00-dstgw.gcp.mongodb.net:27017,nosama-shard-00-01-dstgw.gcp.mongodb.net:27017,nosama-shard-00-02-dstgw.gcp.mongodb.net:27017/${dbName}?replicaSet=NOsama-shard-0&ssl=true&authSource=admin`, {
    useNewUrlParser: true,
});

const app = express();
const PORT = process.env.PORT || 5000;

const noteRoutes = require('./routes/noteRoute');
const projectRoutes = require('./routes/projectRoute');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/taskRoute');
const friendRoutes = require('./routes/friendRoute');
const messageRoutes = require('./routes/messageRoute');

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

//hiện dưới terminal
app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());


app.use(cookieParser());

//routes handle request
app.use('/notes', noteRoutes);
app.use('/projects', projectRoutes);
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use('/friends', friendRoutes);
app.use('/messages', messageRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

// -------------------------------------------------------------------------------------
// io.sockets.emit gửi tới toàn bộ server
// socket.emit gửi tới chính nó
// socket.broadcast.emit gửi tới toàn bộ server trừ chính nó
// io.to(socketId).emit() gửi tới người có socketid
// socket.adapter.rooms Show danh sách room đang có


// Socket.io cho chat
const http = require('http').Server(app);
const io = require('socket.io')(http);

io.use(async function (socket, next) {
    if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
            socket.handshake.query.token,
            process.env.JWT_KEY,
            function (err, decoded) {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                // show token connect
                console.log('Đăng nhập mới: ' + username);
                next();
            });
    } else {
        next(new Error('Authentication error'));
    }
}).on('connection', async (socket) => {
    const decoded = socket.decoded;
    const username = decoded.username;
    const userId = decoded.userId;
    // set user online
    await User.updateOne({username: username}, {$set: {status: 1}}).exec();

    // show token disconnect
    socket.on('disconnect', async function () {
        console.log('User: ' + username + ' đã out');
        await User.updateOne({username: username}, {$set: {status: 2}}).exec();
        friendRequestSchema.find({
            $or: [
                {requester: userId},
                {recipient: userId},
            ],
            status: 1
        }).exec().then(result => {
            socket.broadcast.emit("Offline", result);
        })
    });

    // lắng nghe sự kiện join room
    socket.on("user-join-room-chat", function (room) {
        Room.findOne({_id: room._id})
            .exec()
            .then(data => {
                socket.join(data._id);

                // user sẽ tự join vào room mới tạo
                socket.emit("Joined", data);

                // lắng nghe user send message
                socket.on("send-Message-toServer", function (messageData) {
                    io.to(data._id).emit("Server-send-message", messageData);
                });
            });
    });
});

http.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});




