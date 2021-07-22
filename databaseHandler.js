let mysql= require('mysql')
const { sessionStore } = require('./sessionManager')
const {sendOtp} = require("./mailer.js")
require('dotenv').config()
//let nodemailer=require('nodemailer')
//let transporter = await nodemailer.createTransport('')


//db.connect(console.log("connected to database..."))
function createdb(req,res){
    let db = mysql.createConnection({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME
    })
    return db
}
function verifyUser(req,res,callback){
    let db = createdb()
    db.connect(console.log("In database for verification..."))
    let data = req.body
    let sql = `select * from useraccount where email='${data.email}'`
    db.query(sql,[],(err,result)=>{
        if(err){
            console.log(err)
            res.send('<h1>Error Occured...<brTry again</h1>')
        }
        else{
            if(result.length==0){
                res.redirect('/register')
            }
            else{
                //need to apply hashing hear...
                console.log(result)
                if(result[0].password===data.password){
                    callback(null)
                }
                else{
                    callback(new Error("incorrect password"))
                }
            }
        }
    })
    db.end()
}
function userExists(req,res,callback){
    let sql = `select * from useraccount where email='${req.body.email}'`
    let data  = req.body
    let db = createdb()
    db.query(sql,[],(err,result)=>{
        if(err){
            res.send(err)
        }
        if(result.length==0){
            callback(null)     
        }
        else{
            callback(new Error("user already exists..."))
        }
    })
    db.end()
}
function createUser(req,res,session,callback){
    
    let db = createdb()
    let sql = `insert into useraccount values ('${session.fullname}','${session.email}','${session.password}','default.png')`
    db.query(sql,[],(err,result)=>{
        callback(err)
    })
    db.end()
}
 module.exports.verifyUser= verifyUser
 module.exports.userExists=userExists
module.exports.createUser=createUser
















