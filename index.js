require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwtDecode = require('jwt-decode');

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

io.on('connection', (socket) => {
    const User = require('./database/models/user');
    const Message = require('./database/models/message');
    const Room = require('./database/models/room');
    const friendRequestSchema = require('./database/models/friendRequest');

    const token = socket.handshake.query.token;
    try {
        const decoded = jwtDecode(token);
        const username = decoded.username;
        const userId = decoded.userId;

        // show token connect
        console.log('Đăng nhập mới: ' + username);
        User.updateOne({username: username}, {$set: {status: 1}})
            .exec();
        // .then(result => {
        //     console.log(result);
        // });

        // show token disconnect
        socket.on('disconnect', function () {
            console.log('User: ' + username + ' đã out');
            User.updateOne({username: username}, {$set: {userStatus: 2}})
                .exec();
                // .then(result => {
                //     console.log(result);
                // })
            friendRequestSchema.find({
                $or: [
                    {requester: userId},
                    {recipient: userId},
                ],
                status: 1
            })
                .exec()
                .then(result => {
                    // console.log(result);
                    socket.broadcast.emit("Offline", result);
                })
        });

        // // lắng nghe có người gõ chữ
        // socket.on("input-inFocus", function () {
        //     const noti = username + " is typing";
        //     socket.broadcast.emit("isTyping", noti);
        // });
        //
        // // lắng nghe có người gõ chữ xong rồi
        // socket.on("input-outFocus", function () {
        //     socket.broadcast.emit("isNotTyping");
        // });

        // lắng nghe sự kiện join room
        socket.on("userJoinRoom", function (room) {
            Room.findOne({_id: room._id})
                .exec()
                .then(data => {
                    // user leave room
                    socket.leave(data._id);

                    socket.join(data._id);

                    // user sẽ tự join vào room mới tạo
                    socket.emit("Joined", data);

                    // lắng nghe user send message
                    socket.on("send-Message-toServer", function (messageData) {
                        io.to(data._id).emit("Server-send-message", messageData);
                    });
                });
            console.log(socket.adapter.rooms);
        });

    } catch (error) {

    }
});

http.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});




