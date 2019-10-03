const express = require('express')
const authRouter = express.Router();
const {signup,signin, signout} = require('../controllers/auth')

const {userSignupValidator} = require('../validator/index')

//const {userLoggedInChecker} =  require('../controllers/auth')
authRouter.post("/signup",userSignupValidator,signup)
//authRouter.post("/signup",signup)

authRouter.post("/signin",signin)


authRouter.get("/signout",signout)

module.exports = authRouter;