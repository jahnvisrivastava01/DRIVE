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

    if(!file){
        return res.redirect("/dashboard")
    }

    file.isDeleted = true;
    await file.save();

  

    res.redirect('/dashboard');

});


router.get("/star/:id",authMiddleware,async(req,res)=>{

    //console.log("URL:", req.originalUrl);
    //console.log("ID:", req.params.id);
    const file = await File.findById(req.params.id);

    if(!file){
        return res.redirect("/dashboard");
    }

    file.starred = !file.starred;
    await file.save();

    res.redirect("/dashboard");
})

router.get("/deleteforever/:id", authMiddleware, async (req, res) => {

    const file = await File.findById(req.params.id);

    if (!file) {
        return res.redirect("/trash");
    }

    if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
    }

    await File.findByIdAndDelete(req.params.id);

    res.redirect("/trash");
});



router.get("/restore/:id",authMiddleware,async(req,res)=>{
     const file = await File.findById(req.params.id);

    if (!file) {
        return res.redirect("/trash");
    }

    file.isDeleted = false;

    await file.save();
    res.redirect("/trash")
})




module.exports = router;