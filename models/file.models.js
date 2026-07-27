const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename : String,
    originalname : String,
    path : String,
    mimetype : String,
    size:Number,
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref :'user'
    },

    createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model('File',fileSchema);