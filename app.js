const fs = require('fs')
const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
// load env variables
const dotenv = require('dotenv');
dotenv.config()

mongoose
    .connect(process.env.MONGO_URI,{ useNewUrlParser: true })
    .then(()=>console.log("db connected"))

const db = mongoose.connection
db.on("error",(err)=>console.log(err.message))

const myFileStorage = multer.diskStorage({
  destination: (req, file, cb) => 
  {
    console.log("destination() func got invoked")

    cb(null,"./imageFolder")//to tell multer to store file in imageFolder
  } //end of multer's destination() method 
  
  ,
  
  filename: (req, file, cb)=> 
  {
    console.log("filename() func got invoked")
    cb(null, new Date().toISOString().replace(/:/g, '-')+"_"+file.originalname)
  } //end of multer's filename() method
}) //end of myFileStorage() method


const myFileFilter= (req, file, cb) => {

  if( file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png")
  {
      console.log("valid image uploaded successfully")
      cb(null, true)
  }
  else
    { 
      console.log("invalid image uploaded ! Not accepted")
      cb(null, false) 
    }
} //end of myFileFilter() method

//bring in routes
const postRouter = require('./routes/post')
const authRouter = require('./routes/auth')
const userRouter = require('./routes/user')

app.get("/", async (req, resp) => {
   await fs.readFile("docs/apiDocs.json", (err,apiFile)=> {

    if(err)
    {
      console.log("error when reading apiDocs.json.. Catch block")
      console.log(err)
      resp.status(400).json({err})  
    }
    const doc = JSON.parse(apiFile) //for retrieving data as JSON format
    //console.log(doc)
    resp.json({doc})

  }) //end of readFile & callback func which is 2nd para of readFile()
    
}) //reading apiDocs.json -  End

//middlewares
app.use(morgan("dev"))
app.use(bodyParser.json())

//app.use(multer({dest:'imagesFolder'}).single('image'))
// if using dest as shown above, no need to create the folder. 
//but if using storage option, as shown below, node will not create that folder for you. U must ensure it is there before running
app.use(multer({storage:myFileStorage , fileFilter:myFileFilter }).single('image'))
app.use(cookieParser())
app.use(cors())
app.use("/", postRouter )
app.use("/",authRouter)
app.use("/",userRouter)

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({err:"Unauthorized ! Pls login to access"});
    }
  });

app.listen(process.env.PORT, ()=> { console.log(`nodejs api is listening at port ${process.env.PORT}`)})