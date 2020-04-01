require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const mongoDB = 'mongodb://localhost:27017/stopb';
mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.Promise = global.Promise;

const app = express();
const PORT = process.env.PORT || 5000;

const noteRoutes = require('./routes/noteRoute');
const planRoutes = require('./routes/planRoute');
const userRoutes = require('./routes/userRoute');

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
app.use('/plans', planRoutes);
app.use('/users', userRoutes);

app.use((req, res, next) => {
    const error = new Error('not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error : {
            message: error.message
        }
    })
});

// Socket.io cho chat
const http = require('http').Server(app);
const io = require('socket.io')(http);

const user=["nohope1"];

io.on('connection', (socket) => {
    console.log('Đăng nhập mới: ' + socket.id);
    socket.on('disconnect', function () {
        console.log('ID: ' + socket.id + ' đã out');
    });
    socket.on("SENT-USER-LOGIN-TO-CLIENT", function (data) {
        if(user.indexOf(data) >= 0){
            //fail
            socket.emit("SERVER-SEND-LOGIN-FAIL");
        }else{
            // success
            user.push(data);
            socket.emit("SERVER-SEND-DK-TC", data);
        }
    })
});

http.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});




