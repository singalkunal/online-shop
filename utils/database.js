const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'kunal',
    database: 'node-complete',
    password: 'kunal123'
});

module.exports = pool.promise();