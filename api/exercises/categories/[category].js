import fs from 'fs';
import path from 'path';

const EXERCISES_BASE_DIR = path.join(process.cwd(), 'packages/exercises');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { category } = req.query;
    const categoryPath = path.join(EXERCISES_BASE_DIR, category);
    try {
        if (!fs.existsSync(categoryPath)) {
            res.status(404).json({ error: `Category ${category} not found` });
            return;
        }
        const exercises = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name.endsWith('.nr'))
            .map(dirent => dirent.name)
            .filter(name => !name.startsWith('.'));
        res.status(200).json(exercises);
    } catch (error) {
        console.error(`Error reading exercises for category ${category}:`, error);
        res.status(500).json({ error: `Failed to read exercises for category ${category}` });
    }
} 