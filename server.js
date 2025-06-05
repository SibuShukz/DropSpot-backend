const express = require('express');
       const cors = require('cors');
       const dotenv = require('dotenv');
       const connectDB = require('./config/db');

       // Load environment variables
       dotenv.config();

       // Initialize Express app
       const app = express();

       // Middleware
       app.use(cors());
       app.use(express.json());

       // Connect to MongoDB
       connectDB();

       // Routes
       app.use('/api/users', require('./routes/userRoutes'));

       // Test route
       app.get('/api', (req, res) => {
         res.json({ message: 'Welcome to DropSpot API!' });
       });

       // Start server
       const PORT = process.env.PORT || 5000;
       app.listen(PORT, () => {
         console.log(`Server running on port ${PORT}`);
       });