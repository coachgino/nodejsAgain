const mongoose = require('mongoose')
const uuidv1 = require('uuid/v1')
const crypto = require('crypto')

const userSchema = new mongoose.Schema({

    name:{
        type:String, 
        trim:true,
        required:true
    },
    email:{
        type:String, 
        trim:true,
        required:true
    },
    hashed_password:{
        type:String, 
        required:true
    },
    salt:{ 
        type:String
     },
    created:{
        type:Date, 
        default:Date.now
    },
    updated:{
        type:Date
    },
    photo:{
        data:Buffer, 
        contentType:String,
        filename:String
    }

})


//add virtual field password which user entered client side
// we will hash this password & store the hash in db
// virtual fields dont get persisted in db

userSchema.virtual("password")
//below setter with virtual field is to set real fields of schema, using virtual field's value. The setter func's arg is a callback which takes this virtual field as parameter i.e.plain password in our case.
//so using the virtual field(plain password), we are setting value of real field hashed_password
.set(function(pwd) 
    {
    //create an additional property (using this keyword) for our model which will hold the password
     this._password = pwd;

     //populate value of salt property of our model
     this.salt = uuidv1()

     //encrypt password
     this.hashed_password = this.encryptPassword(pwd)
    })
//getter with virtual field is to return the virtual field
.get(function() {return this._password})

//now we'll add a method to our model to encrypt passwords
userSchema.methods.encryptPassword = function(pwd){
    
        if(!pwd) return "";
        //console.log("setter3 called " +pwd )

        try{
           const hash = crypto.createHmac('sha1', this.salt).update(pwd).digest('hex');
           // console.log("hello gino "+this.salt)
            //const hash = crypto.createHmac('sha1', this.salt)
            //console.log("hello gino2 " +hash)
            //return;
            return hash
        }catch(err)
        {
            console.log("in catch block");
            return ""

        }
    } //end of encryptPassword()

userSchema.methods.authenticate = function(plainPassword)
{
    return this.encryptPassword(plainPassword) === this.hashed_password;

}//end of method authenticate()

module.exports = mongoose.model("User",userSchema);