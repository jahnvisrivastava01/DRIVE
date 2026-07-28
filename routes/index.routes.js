const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const File = require("../models/file.models");
const User = require("../models/user.models");


async function getStats(userId) {
    try {
        const totalFiles = await File.countDocuments({
            owner: userId,
            isDeleted: false
        });

        const starredFiles = await File.countDocuments({
            owner: userId,
            starred: true,
            isDeleted: false
        });

        const trashFiles = await File.countDocuments({
            owner: userId,
            isDeleted: true
        });

        console.log("Stats:", {
            totalFiles,
            starredFiles,
            trashFiles
        });

        return {
            totalFiles,
            starredFiles,
            trashFiles
        };

    } catch (err) {
        console.error("getStats Error:", err);

        return {
            totalFiles: 0,
            starredFiles: 0,
            trashFiles: 0
        };
    }
}


router.get("/", (req, res) => {
    res.render("index");
});


router.get("/dashboard", authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);

        const files = await File.find({
            owner: req.user.userId,
            isDeleted: false
        });

        const stats = await getStats(req.user.userId);

        res.render("dashboard", {
            page: "Home",
            user,
            files,
            ...stats
        });

    } catch (err) {
        console.error("Dashboard Error:", err);
        res.status(500).send(err.message);
    }
});

router.get("/recent", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);

    const files = await File.find({
        owner: req.user.userId,
        isDeleted: false
    }).sort({ createdAt: -1 });

    const stats = await getStats(req.user.userId);

    res.render("dashboard", {
        page: "Recent",
        user,
        files,
        ...stats
    });

});


router.get("/starred", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);

    const files = await File.find({
        owner: req.user.userId,
        starred: true,
        isDeleted: false
    });

    const stats = await getStats(req.user.userId);

    res.render("dashboard", {
        page: "Starred",
        user,
        files,
        ...stats
    });

});


router.get("/trash", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);

    const files = await File.find({
        owner: req.user.userId,
        isDeleted: true
    });

    const stats = await getStats(req.user.userId);

    res.render("dashboard", {
        page: "Trash",
        user,
        files,
        ...stats
    });

});



router.get("/search", authMiddleware, async (req, res) => {

    const user = await User.findById(req.user.userId);

    const query = req.query.q || "";

    const files = await File.find({
        owner: req.user.userId,
        isDeleted: false,
        originalname: {
            $regex: query,
            $options: "i"
        }
    });

    const stats = await getStats(req.user.userId);

    res.render("dashboard", {
        page: "Search",
        user,
        files,
        query,
        ...stats
    });

});

module.exports = router;