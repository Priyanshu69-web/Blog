var mysql = require('mysql2/promise');

var con = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "blogdb"
});

module.exports=con;