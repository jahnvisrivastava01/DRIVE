const express = require('express');

const router = express.Router();



const authMiddleware = require('../middleware/auth.middleware');
const File = require('../models/file.models');


router.get('/', (req, res) => {
    res.render('index');
});


router.get('/dashboard', authMiddleware, async (req, res) => {

    const files = await File.find({
        owner: req.user.userId
    });

    res.render('dashboard', {
        user: req.user,
         files
    });

});

module.exports = router;