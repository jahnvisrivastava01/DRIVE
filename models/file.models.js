const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({

    filename: String,
    originalname: String,
    path: String,
    mimetype: String,
    size: Number,

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    starred: {
        type: Boolean,
        default: false
    },

    isDeleted: {
        type: Boolean,
        default: false
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('File', fileSchema);