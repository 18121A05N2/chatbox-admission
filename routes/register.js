let route = require('express').Router()
let {userExists,createUser} = require('../databaseHandler')
let {authorizationForLogin,eligibleForOtp} = require('../middleware')
const { sessionStore, session } = require('../sessionManager.js')
let {sendOtp} = require('../mailer')
let {getJWT} = require('../jwtmanager')

route.get('/',authorizationForLogin,(req,res,next)=>{
    next()
})
route.post('/',authorizationForLogin,(req,res,next)=>{
    userExists(req,res,(err)=>{
        if(err){
            console.log(err)
            res.send(err)
        }else{
            sendOtp(req,res,req.body.email,(err)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    sessionStore.set(req.session.id,{fullname:req.body.fullname,password:req.body.password,email:req.body.email,otp:otp},(err)=>{
                        if(err){
                            console.log(err)
                            res.send('error occcured...')
                        }
                        else{
                            getJWT(email,"requiredotp",(token)=>{
                            req.session.jwt= token
                            console.log('assigned token')
                            res.redirect('register/verification')
                            })
                        }
                    })
                }
            })
        }
    });
})
route.get('/verification',eligibleForOtp,(req,res,next)=>{
    next()
})

route.post('/verification',(req,res,next)=>{
    sessionStore.get(req.session.id,(err,session)=>{
        if(req.body.otp==session.otp){
            createUser(req,res,session,(err)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                }else{
                    req.session.destroy((err)=>{
                        if(err){
                            console.log(err)
                            res.send(err)
                        }else{
                            res.redirect('/login')
                        }
                    })
                    
                }
            })
        }
        else{
            res.send('wrong otp...renter')
        }
        
    })
})
module.exports = route