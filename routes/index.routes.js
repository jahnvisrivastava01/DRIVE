const express = require('express');

const router = express.Router();



const authMiddleware = require('../middleware/auth.middleware');
const File = require('../models/file.models');
const User = require("../models/user.models");


router.get('/', (req, res) => {
    res.render('index');
});


router.get("/dashboard", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);

    const files = await File.find({
        owner: req.user.userId,
        isDeleted: false
    });

    const totalFiles = await File.countDocuments({
        owner: req.user.userId,
        isDeleted: false
    });

    const starredFiles = await File.countDocuments({
        owner: req.user.userId,
        starred: true,
        isDeleted: false
    });

    const trashFiles = await File.countDocuments({
        owner: req.user.userId,
        isDeleted: true
    });

    res.render("dashboard", {
        page: "Home",
        user,
        files,
        totalFiles,
        starredFiles,
        trashFiles
    });

});





router.get("/starred",authMiddleware,async(req,res)=>{
    const files = await File.find({
        owner : req.user.userId,
        starred:true,
        isDeleted : false
    });

    res.render("dashboard",{
        user:req.user,
        files,
        page:"Starred"
    });
});


router.get("/trash",authMiddleware,async(req,res)=>{
    const files = await File.find({
        owner : req.user.userId,
        isDeleted : true
    });

    res.render("dashboard",{
        user : req.user,
        files,
        page:"Trash"
    });
});


router.get("/search",authMiddleware,async(req,res)=>{
    const query = req.query.q || "";

    const files = await File.find({
        owner : req.user.userId,
        isDeleted:false,
        originalname: {
            $regex: query,
            $options:"i"
        }
    });


    res.render("dashboard",{
        user : req.user,
        files,
        page:"Search",
        query
    });
});


router.get("/recent", authMiddleware, async (req, res) => {

    const files = await File.find({
        owner: req.user.userId,
        isDeleted: false
    }).sort({ createdAt: -1 });

    res.render("dashboard", {
        user: req.user,
        files,
        page: "Recent"
    });

});

module.exports = router;