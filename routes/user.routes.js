const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userModel = require('../models/user.models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');





   





    router.get('/register', (req, res) => {
        res.render('register', {
            error: null,
            errors: [],
            old: {}
        });

    });

    router.post('/register',

        
        body("username")
            .trim()
            .notEmpty().withMessage("Username is required")
            .isLength({ min: 4, max: 20 }).withMessage("Username must be between 4 & 20 characters")
            .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers & underscores"),

        body("email")
            .trim()
            .notEmpty().withMessage("Email is required")
            .isEmail().withMessage("Enter a valid email address")
            .normalizeEmail(),

        body("password")
            .trim()
            .notEmpty().withMessage("Password is required")
            .isLength({ min: 8 }).withMessage("Password must be at least 8 characters.")
            .matches(/[A-Z]/).withMessage("Password must contain one uppercase letter.")
            .matches(/[a-z]/).withMessage("Password must contain one lowercase letter.")
            .matches(/[0-9]/).withMessage("Password must contain one number.")
            .matches(/[!@#$%^&*]/).withMessage("Password must contain one special character."),

        async (req, res) => {
           
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("register", {
                    error: null,
                    errors: errors.array(),
                    old: req.body
                });
            }

            const { email, username, password } = req.body;

            const hashPassword = await bcrypt.hash(password, 10)
            const existingUsername = await userModel.findOne({ username });
            if (existingUsername) {
                return res.render("register", {
                    error: "username already exists",
                    errors: [],
                    old: req.body
                });
            }

            const existingEmail = await userModel.findOne({ email });
            if (existingEmail) {
                return res.render("register", {
                    error: "Email already registered",
                    errors: [],
                    old: req.body
                });
            }
            try {
    await userModel.create({
        email,
        username,
        password: hashPassword
    });

    res.redirect("/user/login");

} catch (err) {
    console.error(err);

    return res.render("register", {
        error: "Something went wrong. Please try again.",
        errors: [],
        old: req.body
    });
}


        })

    router.get('/login', (req, res) => {
        res.render('login', {
            error: null,
            errors: [],
            old: {}
        });
    });


    router.post('/login',
        body('username').trim().isLength({ min: 4 }),
        body('password').trim().isLength({ min: 6 }),
        async (req, res) => {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return res.render("login", {
                    error: null,
                    errors: errors.array(),
                    old: req.body
                });
            }
            const { username, password } = req.body;

            const user = await userModel.findOne({
                username: username
            })

            if (!user) {
                return res.render("login", {
                    error: "Username or password is invalid",
                    errors: [],
                    old: {
                        username
                    }
                });
            };

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.render("login", {
                    error: "Username or password is incorrect",
                    errors: [],
                    old: {
                        username
                    }
                });
            }

            console.log("JWT Secret exists:", !!process.env.JWT_SECRET);

            const token = jwt.sign(
                {
                    userId: user._id,
                    email: user.email,
                    username: user.username
                },
                process.env.JWT_SECRET
            );

            console.log("Token generated successfully");
            res.cookie('token', token)


            res.redirect('/dashboard');

        })


    router.get('/logout', (req, res) => {
        res.clearCookie('token');
        res.redirect('/user/login');
    })


    module.exports = router;