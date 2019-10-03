const fs = require('fs')
const _ = require('lodash')
const User = require('../models/user')
//------------------------------------------------------------------------
exports.getUserProfileFromUrl = async (req, resp, next, id) => {
console.log("inside getUserProfileFromUrl() of user.js controller")
//any code which is async type and takes time i.e. any code which uses await has to be put in try block
    let user=""
try {
     user= await User.findById(id)
       
} catch (error) {
    console.log("error in getUserProfileFromUrl() of user.js controller. End of method ")
    console.log(error)
    return resp.status(400).json({msg:"user not found"})
} 

  if(!user)
    {
        console.log("empty null user returned in getUserProfileFromUrl(). End of method hence")
        return resp.status(400).json({msg:"user not found"})
    }
    //if control reached here, means valid user is obtained.

    //create a new property in req called profile
    //it will have the user object of user who's id is present in url
   
    req.profile = user;

   
   // console.log(req.profile.name)
    console.log("end of getUserProfileFromUrl() of user.js controller")
    next()
}
//------------------------------------------------------------------------

exports.profileUpdateAuthorizationCheck = (req, resp, next) => {

    console.log("start of profileUpdateAuthorizationCheck() in user.js controller")

    if(!(req.profile && req.authUser && req.profile._id.toString()=== req.authUser._id.toString()))
    {
        console.log("Error..Unauthorized action in updateUser()..")
        //status 403 means user is authenticated , but not authorized to perform this action
        return resp.status(403).json({error:"U are not authorized to perform this action"})
    }

    //control reached here means user is authorized to do this
    console.log("successful end of profileUpdateAuthorizationCheck() in user.js controller")

    next()
}

//------------------------------------------------------------------------
exports.hasAuthorization = (req, resp) => {
console.log("start of hasAuthorization() in user.js controller")
    console.log(req.profile +" "+req.auth._id)
    const sameUserChecker = req.profile && req.auth && req.profile._id === req.auth._id

    //check if req.profile is set ! It will only b set if in url, there is "userId" written..and it is followed by a valid user id. req.profile refers to user who's id is present in such a url

    //check if req.auth is set ! This is for logged in users

    //comparing id of both is to ensure that user who's profile is being tried to change (req.profile) is same as the user who is logged in (req.auth)
    if(!this.sameUserChecker)
    {
        console.log("Error in hasAuthorization(). Unauthorized action. End of method hence")
        //status 403 means user is authenticated , but not authorized to perform this action
        return resp.status(403).json({msg:"U are not authorized to perform this action"})
    }
console.log("end of hasAuthorization() of user.js controller ")    
}

//------------------------------------------------------------------------
exports.getAllUsers = async (req, resp) => {
    console.log("start of getAllUsers() of user.js controller")
    let userList=""
try{
    userList = await User.find().select("name email created")

} catch(err){
    console.log("error in getAllUsers() of user.js controller")
    console.log(err)
    return resp.status(200).json({error:"error when trying to retrieve user list."})
}

   if(!userList)
    {
      console.log("null returned. No user found. End of method getAllUsers()")
      return resp.status(200).json({data:"No user found"})
    }
    
    console.log("end of getAllUsers() of user.js controller")
    return resp.json({ userList})
} 
//------------------------------------------------------------------------
exports.getUser = (req, resp) => {

    console.log("start of getUser() of user.js controller")
try
{    
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined
    console.log("req.profile.name = "+req.profile.name)
    console.log("end of getUser() of user.js controller")
    return resp.json(req.profile)    
}
catch(error) 
{
    console.log("error.. in catch of getUser(). Exiting method ")
    console.log(error)
    resp.json({err:error})
}
}
//------------------------------------------------------------------------
exports.updateUser = async (req, resp) => {
    console.log("start of updateUser() of user.js controller")
  
    let user = req.profile
try {
    user = await _.extend(user, req.body)
    console.log(user)

    if(req.file)
    {
        user.photo.data =fs.readFileSync(req.file.path);
        user.photo.contentType = req.file.mimetype
        user.photo.filename = req.file.originalname
    }
     
    user.updated = Date.now()
    user = await user.save() 
} 
catch (err) {
       console.log("error in catch of updateUser(). Exitting method")
       console.log(err)
       return resp.json({error: "Unexpected error when updating user "})
   } 

   if(!user)
   {
        console.log("null user found in updateUser(). Exitting method")
        return resp.json({error: "No user found to update"})
   }

   user.hashed_password = undefined
   user.salt = undefined
   console.log("end of updateUser() of user.js controller")
   return resp.json({user})
}
//------------------------------------------------------------------------
exports.deleteUser = (req, resp) => {
console.log("start of deleteUser() of user.js controller")
    const user = req.profile
try {
    user.remove()
} catch (err) {
    console.log("error in deleteUser()")
    console.log(err)
    return resp.status(400).json({error:" Error when trying to delete the user"})
}
    console.log("end of deleteUser() of user.js controller")
    return resp.json({data:"user deleted successfully"})
}



    

