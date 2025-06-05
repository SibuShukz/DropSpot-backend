const mongoose = require('mongoose');

       const userSchema = new mongoose.Schema({
         email: {
           type: String,
           required: [true, 'Email is required'],
           unique: true,
           lowercase: true,
           trim: true,
         },
         password: {
           type: String,
           required: [true, 'Password is required'],
           minlength: [6, 'Password must be at least 6 characters'],
         },
         role: {
           type: String,
           enum: ['customer', 'host'],
           required: [true, 'Role is required'],
         },
         createdAt: {
           type: Date,
           default: Date.now,
         },
       });

       module.exports = mongoose.model('User', userSchema);