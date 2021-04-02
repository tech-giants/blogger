const mysql = require('mysql')

const dbconfig = require('../config/database.json');

const connection = mysql.createConnection({
    host: dbconfig.host,
    user: dbconfig.user,
    password: dbconfig.password,
    database: dbconfig.database
});

module.exports = connection