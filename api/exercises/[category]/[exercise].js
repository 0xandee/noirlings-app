import fs from 'fs';
import path from 'path';

const EXERCISES_BASE_DIR = path.join(process.cwd(), 'packages/exercises');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    const { category, exercise } = req.query;
    const exercisePath = path.join(EXERCISES_BASE_DIR, category, exercise);
    try {
        if (!fs.existsSync(exercisePath)) {
            res.status(404).json({ error: `Exercise ${exercise} in category ${category} not found` });
            return;
        }
        const content = fs.readFileSync(exercisePath, 'utf8');
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(content);
    } catch (error) {
        console.error(`Error reading exercise ${exercise} in category ${category}:`, error);
        res.status(500).json({ error: `Failed to read exercise ${exercise} in category ${category}` });
    }
} 