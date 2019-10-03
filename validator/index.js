const {check,validationResult} = require('express-validator')

/* exports.createPostValidator = async (req,resp, next)=>{
   
   console.log("inside createPostValidator() for validation before creating post")
    //await check('title','title caaaaaant b mpty').not().isEmpty().run(req)
    //await check('title','title length should be between 4-150').isLength({min:4, max:150}).run(req)
await check('title')
    .not().isEmpty()
    .withMessage("title caaaaaant b mpty")
    
    .isLength({min:4, max:150})
    .withMessage("title should be between 4-150")    
    .run(req)
    //await check('title','title length should be between 4-150').isLength({min:4, max:150}).run(req)

await check('body')
    .not().isEmpty()
    .withMessage("body caaaaaant b mpty")
   
    .isLength({min:4, max:2000})
    .withMessage("body length should be between 4-2000")   
    .run(req)
    

    //START - fetch errors, if any,  caught by express-validator pkg by using validationResult() method
    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        console.log("gino error hai")
        return resp.status(400).json({err: errors.array()})
    }
    //END - fetch errors, if any,  caught by express-validator pkg
    console.log("end of createPostValidator()")
    next()
} // end of createPostValidator() */


exports.createPostValidator = async (req,resp, next)=>{
   
    console.log("inside createPostValidator() for validation before creating post")
     //await check('title','title caaaaaant b mpty').not().isEmpty().run(req)
     //await check('title','title length should be between 4-150').isLength({min:4, max:150}).run(req)
 await check('title')
     .not().isEmpty()
     .withMessage("title caaaaaant b mpty")
     
     .isLength({min:4, max:150})
     .withMessage("title should be between 4-150")    
     .run(req)
     //await check('title','title length should be between 4-150').isLength({min:4, max:150}).run(req)
 
 await check('body')
     .not().isEmpty()
     .withMessage("body caaaaaant b mpty")
    
     .isLength({min:4, max:2000})
     .withMessage("body length should be between 4-2000")   
     .run(req)
     
 
     //START - fetch errors, if any,  caught by express-validator pkg by using validationResult() method
     const errors = validationResult(req)
     if(!errors.isEmpty())
     {
         console.log("Form validation failed. Body/ Title do not match the set criteria ")
      
         console.log(errors.array())
         console.log("So... Ending createPostValidator() due to error")

         return resp.status(400).json({err: errors.array()})
     }
     //END - fetch errors, if any,  caught by express-validator pkg
     console.log("end of createPostValidator()")
     next()
 } // end of createPostValidator()

exports.userSignupValidator = async (req,resp,next) => {
    console.log("inside userSignupValidator() for validation before sign up")

await check("name")
    .not().isEmpty()
    .withMessage("name is required.. cant be empty !!! ")
   // .matches(/^[a-zA-Z0-9_]*$/)
    .isLength({min:3 , max:30})
    .withMessage("name should be between 3-30 chars only")
    .run(req)

await check("email")
    .not().isEmpty().withMessage("gino error: email cant be empty ")
    .isEmail().withMessage("email format is incorrect")
    .run(req)

await check("password")
    .not().isEmpty().withMessage("password cant b empty")
    .isAlphanumeric().withMessage("pwd can have only letters or numbers..")
    .isLength({min:5,max:20}).withMessage(" pwd min length is 5")
    .run(req)

    const errors = validationResult(req)
    if(!errors.isEmpty())
    {
        console.log(errors.array()[0])
        return resp.status(400).json({error: errors.array()[0].msg})
    }
    console.log("end of userSignupValidator()")
    next()
}


