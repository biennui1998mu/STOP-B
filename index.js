require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const username = process.env.DB_USER;
const password = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;

mongoose.connect(`mongodb://${username}:${password}@nosama-shard-00-00-dstgw.gcp.mongodb.net:27017,nosama-shard-00-01-dstgw.gcp.mongodb.net:27017,nosama-shard-00-02-dstgw.gcp.mongodb.net:27017/${dbName}?replicaSet=NOsama-shard-0&ssl=true&authSource=admin`, {
    useNewUrlParser: true,
}, (status) => {
    console.log(status);
});

const app = express();
const PORT = process.env.PORT || 5000;

const noteRoutes = require('./routes/noteRoute');
const projectRoutes = require('./routes/projectRoute');
const userRoutes = require('./routes/userRoute');
const taskRoutes = require('./routes/taskRoute')

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

//hiện dưới terminal
app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads'))
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

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
});

// Socket.io cho chat
const http = require('http').Server(app);
const io = require('socket.io')(http);

const user = ["nohope1"];

io.on('connection', (socket) => {
    console.log('Đăng nhập mới: ' + socket.id);
    socket.on('disconnect', function () {
        console.log('ID: ' + socket.id + ' đã out');
    });
    socket.on("SENT-USER-LOGIN-TO-CLIENT", function (data) {
        if (user.indexOf(data) >= 0) {
            //fail
            socket.emit("SERVER-SEND-LOGIN-FAIL");
        } else {
            // success
            user.push(data);
            socket.emit("SERVER-SEND-DK-TC", data);
        }
    })
});

http.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});




