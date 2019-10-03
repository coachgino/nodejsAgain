const mongoose = require('mongoose')

const {ObjectId} =  mongoose.Schema
const postSchema = mongoose.Schema({

    title:{
        type:String,
        required:true
        },
    body:{
        type:String,
        required:true
    },
    photo:{
        data:Buffer, 
        contentType:String,
        filename:String
    },
    postedBy:{
        type: ObjectId,
        ref:"User"
    },
    created:{
        type:Date,
        default:Date.now()
    },
    updated:{
        type:Date
    }


});

//create a model called Post (i.e. it will create a class called Post which is a subclass of class Model) from the schema
module.exports = mongoose.model("Post", postSchema);
//So the model class Post can be instantiated and used for writing to db
