const express = require('express');
const router = express.Router();

router.get('/user', (req, res, next) => {
    const protocol = req.protocol;
    const hostName = req.get('host');
    const pathURL = req.originalUrl;
    console.log(`${protocol}://${hostName}${pathURL}`);
    res.json('123');
});

module.exports = router;