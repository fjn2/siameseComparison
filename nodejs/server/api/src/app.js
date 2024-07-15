const express = require('express');
const path = require('path');
const imageRoutes = require('./routes/imageRoutes');
const { pendingImageQueue } = require('./data/imageQueue');

const app = express();
const port = 4000;

// Middleware to parse JSON bodies
app.use(express.json());

// Use image routes
app.use('/', imageRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
