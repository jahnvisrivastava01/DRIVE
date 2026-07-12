const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username :{
        type: String,
        required : true,
        trim:true,
        lowercase:true,
        unique:true,
        minLength: [3,'username must at least be 3 characters long.']
    },

    email :{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true,
        minLength:[13,'email must at least be 13 characters long']
    },

    password :{
        type:String,
        required : true,
        trim:true,
        minLength:[6,'Password must be at least 6 characters long.']

    }



})

const user = mongoose.model('user', userSchema)
module.exports=user;

