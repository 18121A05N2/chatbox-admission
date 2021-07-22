let {app,express} = require('./getApp.js')
let {session,sessionStore} = require('./sessionManager.js')
let {verifyJWT} = require('./jwtmanager.js')
const { decode } = require('jsonwebtoken')

//authorization middle ware functions for server.js
function eligibleForOtp(req,res,next){
    if(!req.session || !req.session.jwt){
        res.redirect("home")
    }
    else{
        verifyJWT(req.session.jwt,(err,decoded)=>{
            if(err){
                res.redirect('/register')
            }
            else{
                if(decoded.state=='requiredotp'){
                    next()
                }else if(decoded.state=='authorized'){
                    res.redirect('/home')
                }else{
                    res.redirect('/')
                }
            }
        })
    }
}
function authorization(req,res,next){
    let sess = req.session
    console.log("ok")
    if(!sess || !req.session.jwt){
        res.redirect('/login')
    }
    else{
        verifyJWT(req.session.jwt,(err,decoded)=>{
            if(err){
                console.log(err)
                res.redirect('error occured... ')
            }
            else{
                if(decoded.state=='requiredotp'){
                    res.redirect('register/verification')
                }else if(decoded.state=='authorized'){
                    next()
                }
                else{
                    res.redirect('/')
                }
            }
        })
    }
}

function authorizationForLogin(req,res,next){
    let sess = req.session
    if(!sess || !req.session.jwt){
        next()
    }
    else{
        verifyJWT(req.session.jwt,(err,decoded)=>{
            if(err){
                console.log(err)
                res.send('error occured...')
            }
            else{
                if(decoded.state == 'requiredotp'){
                    res.redirect('register/verification')
                }
                else if(decoded.state =='authorized'){
                    res.redirect('home')
                }
                else{
                    res.redirect('/')
                }
            }
        })
    }
}

// for the post body encoding 
app.use(express.urlencoded())

//for creating session for each request
app.use(session({
    secret:"I LOVE APPLE",
    resave:false,
    saveUninitialized:true,
    rolling:true,
    cookie:{
        maxAge:10*60*1000
    }
}))

//prevent pages from caching...
app.use((req,res,next)=>{
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); // HTTP 1.1.
    res.setHeader("Pragma", "no-cache"); // HTTP 1.0.
    res.setHeader("Expires", "0");
    next()
})
/////

module.exports.authorization=authorization
module.exports.authorizationForLogin=authorizationForLogin
module.exports.eligibleForOtp=eligibleForOtp