const bcrypt = require('bcryptjs');
       const { body, validationResult } = require('express-validator');
       const User = require('../models/User');

       // Register user (customer or host)
       const registerUser = [
         // Validation middleware
         body('email').isEmail().withMessage('Valid email is required'),
         body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
         body('role').isIn(['customer', 'host']).withMessage('Role must be customer or host'),

         async (req, res) => {
           // Check validation errors
           const errors = validationResult(req);
           if (!errors.isEmpty()) {
             return res.status(400).json({ errors: errors.array() });
           }

           const { email, password, role } = req.body;

           try {
             // Check if user exists
             let user = await User.findOne({ email });
             if (user) {
               return res.status(400).json({ message: 'User already exists' });
             }

             // Hash password
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(password, salt);

             // Create user
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

       module.exports = { registerUser };