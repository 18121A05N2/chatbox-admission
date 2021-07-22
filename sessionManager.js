let session = require('express-session')
let MySQLStore = require('express-mysql-session')(session)
let mysql = require('mysql')
var options = {
    
    host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME

}
//similar to create database
let connection = mysql.createPool(options);
let sessionStore = new MySQLStore({
    clearExpired:true,
    checkExpirationInterval:1000,
    expiration:60000
},connection);

module.exports.session=session
module.exports.sessionStore = sessionStore

