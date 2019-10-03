const _ = require('lodash')
const fs = require('fs')
const Post = require('../models/post')
const {check, validationResult} = require('express-validator')
const {createPostValidator} = require('../validator/index')
//const formidable = require('formidable')
//----------------------------------------------------------------------
exports.getPosts = async (req,resp)=> {
    console.log("inside getPosts()")
    let allPosts=""
try {
     allPosts = await Post.find()
    .populate("postedBy", "_id name") //postedBy property of posts model has only id of user model. If we want to show the name from user model assosciated with that id, we cant do it by just specifying postedBy property in select clause bcoz it will only print user's id.
    // to show more user info from user model, corresponding to id in post model's postedBy property, v need to use populate()
    //specify the property as first argument u want to modify to show not just what is available but to get info from other collection... That would be populate("postedBy") in our case
    //then pass 2nd arg all the properties of user model that u want to show when displaying postedBy... so that would be: populate("postedBy", "_id name")
    .select("_id title body photo")
        
    }
catch (error) {
    console.log(`error when getting posts from db: ${error} `)
    resp.status(200).json({msg:"Unable to retrieve posts"})
    }    

    console.log("End of getPosts()")
    return resp.json({allPosts})
} //end of getPosts()

//----------------------------------------------------------------------
/* exports.createPost = async (req, resp) => {  
    console.log("start of createPost of post.js controller")
    let post=""
try {   
    post = await new Post(req.body);
    post.postedBy = req.authUser //the post will be created by name of the logged in user
    post.postedBy.hashed_password = undefined
    post.postedBy.salt = undefined
   // post.save()
}
catch (error) {
    console.log("error in createPost().. Exiting method");
    console.log(error)
    return resp.status(200).json({msg: "Unexpected error when creating post"})
    }
console.log("data sent in post is "+post)
console.log("start of createPost of post.js controller")

resp.status(200).json(post)
} //end of createPost()
 */


exports.createPost = async (req, resp) => {  
// gino.. ensure Content-type in header is set to multipart/form-data and not json or application/json
// also in postman, be sure to test this in body tab's form-data part.. and not in raw or x-www-form-urlencoded.. bcoz both these can handle only text and not images

    console.log("start of createPost of post.js controller")
    let post=""

try {   

    if(!req.file)
    {
        console.log("Invalid image upload.. Error in createPost().. Exiting method");
        return resp.status(200).json({msg: "Pls upload a valid image"})
    }
    //console.log(req.file)
    //console.log(req.file.path)
   // console.log(req.file.mimetype)
    
    post = await new Post(req.body);
 

    post.photo.data =fs.readFileSync(req.file.path);
    post.photo.contentType = req.file.mimetype
    post.photo.filename = req.file.originalname
    post.postedBy = req.authUser //the post will be created by name of the logged in user
    post.postedBy.hashed_password = undefined
    post.postedBy.salt = undefined
    post.save()
}
catch (error) {
    console.log("Error: in catch of createPost().. Exiting method");
    console.log(error)
    return resp.status(200).json({msg: "Unexpected error when creating post"})
    }
console.log("data sent in post is "+post)
console.log("end of createPost of post.js controller")

resp.status(200).json(post)
} //end of createPost()

//----------------------------------------------------------------------

//this method iss like visiting someone's profile in fb. u can see all posts by them when u go to their profile. Same v will do in this method
exports.postsByUser =async (req, resp) => {
    console.log("start of postsByUser() of user.js controller")
let posts;
    
try{
    posts =await Post.find({postedBy:req.profile._id})
    .populate("postedBy", "_id name")
    .sort("created")
}
catch(err){
    console.log("Error... in catch of postsByUser()")
    console.log(err)
    return resp.status(400).json({msg:" Unexpected rror when retrieving posts.. "})
}

    if(!posts || posts.length < 1)
    {
        console.log("no post available from this user")
        return resp.json({msg:"no post available from this user"})

    }

    console.log("end of postsByUser() of user.js controller")
    //console.log(posts)
    return resp.json({data: "THere are total "+posts.length+" posts.. They are "+ posts})
}//end of postByUser()

//----------------------------------------------------------------------

exports.getPostInfoFromUrl = async (req, resp, next, id)=> {
    console.log("start of getPostInfoFromUrl() in post.js controller")
    let post
try{
    post = await Post.findById(id)
    .populate("postedBy", "_id name")
}
catch(err){
    console.log("err in catch of getPostInfoFromUrl().. ")
    console.log(err)
    return resp.status(400).json({msg:"Error when retrieving this post"})
}

if(!post)
{
    console.log("no such post available.. ")
    return resp.json({msg:"No such post exists"})
}

//control reached here means valid post exists.. store its info in req.post
    req.post = post

    console.log("end of getPostInfoFromUrl() in post.js controller")
    next()
} //end of getPostInfoFromUrl()

//----------------------------------------------------------------------

exports.checkUserTryingToModifyPostIsItsOwnerOrNot = (req, resp, next) => {
    console.log("start of checkUserTryingToModifyPostIsItsOwnerOrNot() in post.js controller")
    const isAuthorized = req.post && req.authUser && req.post.postedBy._id.toString() === req.authUser._id.toString()
    
    if(!isAuthorized)
    {
        console.log("Unauthorized post modification attempt ! ")
        return resp.status(403).json({msg:"U are not authorized to perform this action"})
    }
    console.log("successful end of checkUserTryingToModifyPostIsItsOwnerOrNot() in post.js controller")
    next()
}
//----------------------------------------------------------------------

exports.deletePost = (req, resp) => {
    console.log("start of deletePost() in post.js controller")

    const post = req.post
try {
    post.remove()
} catch (error) {
    console.log("error.. in catch of deletePost()")
    console.log(error)
    return resp.status(400).json({msg:" Error when trying to delete the post"})
}

    console.log("end of deletePost() in post.js controller")
    return resp.json({msg:"post deleted successfully"})
}
//----------------------------------------------------------------------
exports.updatePost = async (req, resp) => {
    console.log("start of updatePost() in post.js controller")

    let post
    try{
         post = req.post
         post = await _.extend(post,req.body)
         post.updated = Date.now()

         if(req.file)
         {
             post.photo.data= fs.readFileSync(req.file.path)
             post.photo.contentType = req.file.mimetype
             post.photo.filename = req.file.originalname
         }

         post = await post.save()
    }
    catch(err)
    {   
        console.log("error in catch of updatePost()")
        console.log(err)
        return resp.status(400).json({msg:" Error when trying to update post"})
    }

    console.log("end of updatePost() in post.js controller")
    return resp.json({data:post})
}
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
//----------------------------------------------------------------------
