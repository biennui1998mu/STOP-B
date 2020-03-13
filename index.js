require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

/**
 * @type {{origin: string, optionsSuccessStatus: number}}
 */
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cookieParser());
app.use(cors(corsOptions));

/**
 * Allow user can access public folder.
 */
app.use(express.static(path.join(__dirname, "/stopb/dist/stopb"), { maxAge: 31557600000 }));

/**
 * Allow angular to use all get request from user;
 */
app.use(express.static(path.join(__dirname, "view"), { maxAge: 31557600000 }));
app.get('*', (req, res, next) => {
    res.sendFile(path.join(__dirname, '/stopb/dist/stopb/index.html'));
});

app.use('/test', require('./routes/general'));

app.get('/', (req, res) => {
    const abc = {
        username: 'nam',
        password: '1123'
    };
    res.json(abc);
});

app.listen(PORT, () => {
    console.log(`Server lives! Port: ${PORT}`);
});