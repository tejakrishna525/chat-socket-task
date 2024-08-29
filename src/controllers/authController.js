// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log("body",req.body)
        // check if the email is already available 
        const existingUserByEmail = await User.findOne({email})
        if(existingUserByEmail){
            return res.status(400).json({ message: 'Email is already registered' });
        }
        const existingUserByUsername = await User.findOne({ username });
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username is already taken' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.render('register', { message: 'User registered successfully' });
       // res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error during user registration:", error); // Log the error
        res.status(500).json({ message: 'Error registering user' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user._id }, 'secretkey', { expiresIn: '1h' });

        // Set token in a cookie
        res.cookie('token', token, {
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000 // 1 hour
        });

        // Redirect to dashboard page
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: 'Error logging in' });
    }
};

exports.logout = (req, res) => {
    try {
        res.clearCookie('token');
        res.redirect('/dashboard');
        // res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error logging out' });
    }
};
