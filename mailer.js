const nodemailer = require("nodemailer");
const { getJWT } = require("./jwtmanager");
const { sessionStore } = require("./sessionManager");
  
function sendOtp(req,res,email) {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.ADMIN_EMAIL, // generated ethereal user
        pass: process.env.ADMIN_EMAIL_PASSWORD, // generated ethereal password
      },
    })


    let otp = Math.floor(Math.random()*(999999-100000+1)+100000)


    let info = transporter.sendMail({
      from: process.env.ADMIN_EMAIL, // sender address
      to: email, // list of receivers
      subject: "from website by umesh", // Subject line
      text: "Hello student", // plain text body
      html: `<b>your otp is ${otp}</b>`, // html body
    },(err)=>{
      if(err){
        console.log(err)
        res.send(err)
      }else{
        console.log('here')
        console.log('otp sent',req.body.fullname)
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
module.exports.sendOtp=sendOtp