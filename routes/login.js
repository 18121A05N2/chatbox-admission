let express = require('express')
const { verifyUser } = require('../databaseHandler')
const {getJWT} = require('../jwtmanager')

let route = express.Router()
let {authorizationForLogin} = require('../middleware')
route.post('/',(req,res)=>{
    verifyUser(req,res,(err)=>{
        if(err){
            console.log(err)
            res.send(err)
        }else{
            getJWT(req.body.email,"authorized",(token)=>{
                console.log(token)
                req.session.jwt = token
                res.redirect('/home')
            })
        }
    })
})
route.get('/',authorizationForLogin,(req,res,next)=>{
    next()
})
module.exports = route