import express from 'express';
import path from 'path';
import cors from 'cors';
import { joinPath } from '../utils/moduleHelper.js';
import apiRoutes from './api.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(path.dirname(new URL(import.meta.url).pathname), '../../dist')));

// API routes
app.use('/api', apiRoutes);

// Handle all other routes by serving the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(path.dirname(new URL(import.meta.url).pathname), '../../dist/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app; 