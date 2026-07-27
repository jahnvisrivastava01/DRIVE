const express = require('express');

const router = express.Router();

const upload = require('../middleware/upload.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const File = require('../models/file.models');
const fs = require('fs')


router.post(
    '/upload',
    authMiddleware,
    upload.single('file'),
    async(req,res) => {
        if(!req.file){
            return res.send("No file selected");
        }
        await File.create({
            filename : req.file.filename,
            originalname : req.file.originalname,
            path : req.file.path,
            mimetype : req.file.mimetype,
            size : req.file.size,
            owner : req.user.userId

        });

        res.redirect('/dashboard');
    }
)


router.get('/download/:id',authMiddleware,async(req,res)=>{
    const file = await File.findById(req.params.id);
    res.download(file.path,file.originalname);
});



router.get('/delete/:id', authMiddleware, async (req, res) => {

    const file = await File.findById(req.params.id);

    if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
}

    await File.findByIdAndDelete(req.params.id);

    res.redirect('/dashboard');

});


module.exports = router;