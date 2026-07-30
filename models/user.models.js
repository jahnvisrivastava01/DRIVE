const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required : true,
        trim:true,
        lowercase:true,
        unique:true,
        minlength: [3,'username must at least be 3 characters long.']
    },

    email :{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
       
    },

    password: {
    type: String,
    default: "",
    trim: true
    }



})

const user = mongoose.model('user', userSchema)
module.exports=user;

