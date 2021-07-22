let {express,app} = require('./getApp.js')
require('dotenv').config()
let{authorizationForLogin,authorization,eligibleForOtp}= require('./middleware.js')
const { sessionStore, session } = require('./sessionManager.js')
const { createPoolCluster } = require('mysql')

//request handling after middle ware...
let loginroute = require('./routes/login')
let registerroute = require('./routes/register')
let homeroute = require('./routes/home')
require('./middleware.js')
app.use('/login',loginroute)
app.use('/register',registerroute)
app.use('/home',homeroute)
app.get('/logout',(req,res,next)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
            res.send('error occured...')
        }else{
            res.redirect('/login')
        }
    })
})
app.use(express.static('public'))
app.listen(process.env.SERVER_PORT)














//////////

//require and imports required
/*let {verifyUser,registerUser}=require('./databaseHandler')
let express = require('express');
let app = express()
app.use(express.urlencoded());
let server = app.listen(80,()=>{
    console.log("connected...")
})



io.on('connection',(socket)=>{
    socket.emit('ping','Hello from ping server')
    console.log("userlogged")
    socket.on('postingdetails',(message)=>{
        registerUser(message)
    })    
})
/////////////////////////////////////////////////////
//middle ware
app.use(parser())
app.use(session({
    secret:"I LOVE APPLE",
    resave:false,
    saveUninitialized:false
}))
function redirectLogin(req,res,next){
    
}
//////////////////////////////////////////////////////
app.post('/user',(req,res)=>{

})
app.post('/register',(req,res)=>{

})
app.use(express.static('public'))
*/