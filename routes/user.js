const express = require('express')
const userRouter = express.Router();
const {getAllUsers , getUser, getUserProfileFromUrl , updateUser, deleteUser, profileUpdateAuthorizationCheck} = require('../controllers/user')
const {loggedInVerifier} =  require('../controllers/auth')

userRouter.get("/users",loggedInVerifier,getAllUsers)
//userRouter.get("/users",getAllUsers)

userRouter.get("/user/:userId",loggedInVerifier, getUser)

userRouter.put("/user/:userId",loggedInVerifier, profileUpdateAuthorizationCheck, updateUser)

userRouter.delete("/user/:userId",loggedInVerifier,profileUpdateAuthorizationCheck, deleteUser)

//if url has "userId" i.e. anything after /user , then execute func getUserProfileFromUrl
userRouter.param("userId",getUserProfileFromUrl) //to set req.profile
//this will add info about the user from the url, to request by creating a new field called profile. It can be accessed as req.profile
//in this func, we are creating a new field called profile in req. It can be accessed as req.profile
//then, based on which user id is there in url, if its a valid user id, v get that user obj and store it in req.profile
//so req.profile has user obj which is not logged in...but it  has user obj who's id is in url.


module.exports = userRouter



