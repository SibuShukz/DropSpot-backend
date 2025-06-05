const bcrypt = require('bcryptjs');
       const { body, validationResult } = require('express-validator');
       const jwt = require('jsonwebtoken');
       const User = require('../models/User');

       // Register user
       const registerUser = [
         body('email').isEmail().withMessage('Valid email is required'),
         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
         body('role').isIn(['customer', 'host']).withMessage('Role must be customer or host'),

         async (req, res) => {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
           }

           const { email, password, role } = req.body;

           try {
             let user = await User.findOne({ email });
             if (user) {
               return res.status(400).json({ message: 'User already exists' });
             }

             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(password, salt);

             user = new User({
               email,
               password: hashedPassword,
               role,
             });

             await user.save();

             res.status(201).json({ message: 'User registered successfully' });
           } catch (error) {
             console.error(error.message);
             res.status(500).json({ message: 'Server error' });
           }
         },
       ];

       // Login user
       const loginUser = [
         body('email').isEmail().withMessage('Valid email is required'),
         body('password').notEmpty().withMessage('Password is required'),

         async (req, res) => {
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
           }

           const { email, password } = req.body;

           try {
             // Check if user exists
             const user = await User.findOne({ email });
             if (!user) {
               return res.status(400).json({ message: 'Invalid credentials' });
             }

             // Verify password
             const isMatch = await bcrypt.compare(password, user.password);
             if (!isMatch) {
               return res.status(400).json({ message: 'Invalid credentials' });
             }

             // Generate JWT
             const payload = {
               user: {
                 id: user._id,
                 role: user.role,
               },
             };

             const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

             res.json({ token });
           } catch (error) {
             console.error(error.message);
             res.status(500).json({ message: 'Server error' });
           }
         },
       ];

       module.exports = { registerUser, loginUser };