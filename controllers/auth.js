const User = require('../models/user')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')

exports.signup =async (req,resp) => {

   console.log("start of signup() in auth.js controller")

try {
   const user = await User.findOne({email:req.body.email})
   if(user)
         {
        return resp.status(403).json({error: "Sorry, email is taken."})
        }
    const newUser = await new User(req.body)
    await newUser.save()
    console.log("end of signup() in auth.js controller")
    return resp.status(200).json({msg:"user signup successful"})

} catch (err) {   
    console.log("error in signup()")
    console.log(err)
    return resp.status(400).json({error:"Unexpected error in signup"})
   }
    
} //end of signup()

exports.signin = async (req,resp) => {
debugger;
    console.log("start of signin() of auth.js controller")
    let token = "",user = "";
    //check if email is present in our db
    //left email is local var (key needed for json syntax), right email is what we got from req.body
try {
     const {email, password} = req.body;

     user = await User.findOne({email:email});
     if(!user)
        {
         console.log("this user is not registered. Pls signup before u can login")
         console.log(`${email} and ${password}`)
         return resp.status(401).json({error:"this user is not registered. Pls signup before u can login"})
        }
     //if email is present n user is found, then verify password
     if(!user.authenticate(password))
        {
         console.log("Login failed. Incorrect email/password crednetials.")
         return resp.status(401).json({error:"Login failed. Incorrect email/password crednetials."})
        }
    
    //control reached here means user is authenticated
    //so create token using JWT_SECRET & user detail(_id from db)   
    token = jwt.sign({id:user._id}, process.env.JWT_SECRET);
    
    //below is code to set timer for token in Auth header:
    //token = jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn:10})
    
    // console.log(process.env.JWT_SECRET)

    //persist the token in cookie
    resp.cookie("t", token, {expire: Date.now() + 9999} )

} catch (err) {
    console.log("error during signin()")
    console.log(err)
    return resp.json({error:"Unexpected error during signin"})
    }    
        
    //send token and user details in response
    const {name, _id, email} = user;
    resp.json({ token:token , user: {_id, name,email}})
    console.log("end of signin() of auth.js controller")
} //end of signin()

exports.signout = (req, resp) => {
console.log("start of signout()")
try {
    resp.clearCookie("t")
    resp.json({msg:"signout successful"})        
} catch (error) {
    console.log("error during signout")
    console.log(error)
    return resp.status(200).json({msg:"Unexpected error during signout"})
    }
   console.log("end of signout()")
}//end of signout

exports.userLoggedInChecker = expressJwt({
    secret:process.env.JWT_SECRET, //the key has to be named secret here.
    //it is a requirement of express-jwt package
    
    //next.. If token is validated by expressJwt, this will create req.auth variable...which has user object  who is logged in right now. So logged in user obj's properties like name, email etc can be accessed as: req.auth._id
    userProperty:"auth"
})


exports.loggedInVerifier = async (req, resp, next) => {

    console.log("start of loggedInVerifier()")
    let user
    let token    
    let decodedToken;

try{
    token= req.get('Authorization').split(" ")[1]
    console.log(token)
    decodedToken=await jwt.verify(token, process.env.JWT_SECRET)
} catch(err)
    {
        console.log("Error.. in catch of loggedInVerifier.. Issue with missing Authorization Header or when decoding token. End of method")
        console.log(err)
        return resp.status(500).json({error:"Error when authenticating.. pls ensure u are logged in"})
}

if(!decodedToken)
    {
        console.log("Decoded token is null.. End of method loggedInVerifier")
        return resp.status(401).json({msg:"Not authenticated"})
    }

    //console.log(decodedToken.id)

    try{
     user =await User.findById(decodedToken.id)
    }
    catch(err)
    {
        console.log("err in catch of loggedInVerifier() when verifying user id from header's token with user id in db ")
        console.log(err)
        return resp.status(400).json({error:"Err when checking user authentication"})
    }
    req.authUser = user
    req.userId = decodedToken.id //not needed as it is already available in req.authUser._id, but keep it..just in case
    
    console.log("end of loggedInVerifier()")
    //return resp.status(200).json({data:req.authUser})
    next()
}
