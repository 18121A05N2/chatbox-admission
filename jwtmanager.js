require('dotenv').config()
var jwt = require('jsonwebtoken');
function getJWT(email,state,callback){
    jwt.sign({ email:email,state:state }, process.env.JWT_SECRETE,{expiresIn:'2d'},(err,token)=>{
        callback(token)
    })

}
function verifyJWT(jwtdata,callback){
    jwt.verify(jwtdata,process.env.JWT_SECRETE,(err,decoded)=>{
        callback(err,decoded)
    })
}
module.exports.getJWT=getJWT
module.exports.verifyJWT = verifyJWT