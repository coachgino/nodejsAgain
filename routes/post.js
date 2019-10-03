const express = require('express')
const {getPosts , createPost, postsByUser, getPostInfoFromUrl , checkUserTryingToModifyPostIsItsOwnerOrNot, deletePost, updatePost} = require('../controllers/post')
const {loggedInVerifier} = require('../controllers/auth')
const {validationResult} = require('express-validator')
const {createPostValidator} = require('../validator/index')
const { getUserProfileFromUrl} = require('../controllers/user')

const router = express.Router();

/*
// express-validator using async, await and run(req)
const checkerMiddleware = async (req,resp,next)=>
{   
    console.log('inside my middleware function')
    await check('title','title caaaaaant b mpty').not().isEmpty().run(req)
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        console.log("gino error hai")
        return resp.status(400).json({err: errors.array()})
    }
    next()
    
}
*/


/*
const finalfunc = (req,resp)=>{
    
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        console.log("gino error hai")
        return resp.status(400).json({err: errors.array()})
    }

    return resp.status(200).send("data sent")
}
*/
router.get("/allposts", loggedInVerifier,getPosts )
//router.get("/allposts",getPosts )

router.post("/post",loggedInVerifier,createPostValidator,createPost)
//router.post("/post",loggedInVerifier,createPost)
//hasAuthorization used to ensure the user doesnt create a post by using another user's id. He should only create post in his own name

router.get("/post/by/:userId",loggedInVerifier, postsByUser)
router.param("userId",getUserProfileFromUrl) //to set req.profile
//if url has "userId" i.e. anything after /post/by/ , then execute func getUserProfileFromUrl
//this will add info about the user from the url, to request by creating a new field called profile. It can be accessed as req.profile
//in this func, we are creating a new field called profile in req. It can be accessed as req.profile
//then, based on which user id is there in url, if its a valid user id, v get that user obj and store it in req.profile
//so req.profile has user obj which is not logged in...but it  has user obj who's id is in url.

router.delete("/post/:postId",loggedInVerifier,checkUserTryingToModifyPostIsItsOwnerOrNot, deletePost)
router.put("/post/:postId", loggedInVerifier, checkUserTryingToModifyPostIsItsOwnerOrNot,updatePost)

router.param("postId", getPostInfoFromUrl) //to set req.post

module.exports = router;