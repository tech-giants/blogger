const express = require('express')
const session = require('express-session')
const router = express.Router();
const connection = require('../models/db')


router.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.send(req.session.username);
    } else {
        res.redirect('/login');
    }
});


module.exports = router