import fs from 'fs';
import path from 'path';

const EXERCISES_BASE_DIR = path.join(process.cwd(), 'packages/exercises');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const categories = fs.readdirSync(EXERCISES_BASE_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            .filter(name => !name.startsWith('.'));
        res.status(200).json(categories);
    } catch (error) {
        console.error('Error reading exercise categories:', error);
        res.status(500).json({ error: 'Failed to read exercise categories' });
    }
} 