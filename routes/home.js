let route = require('express').Router()
let {authorization} = require('../middleware')


route.get('/',authorization,(req,res,next)=>{
    next()
})
module.exports = route