import fs from 'fs';
import path from 'path';
import toml from 'toml';

const EXERCISES_BASE_DIR = path.join(process.cwd(), 'packages/exercises');

export default function handler(req, res) {
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    try {
        const infoTomlPath = path.join(EXERCISES_BASE_DIR, 'info.toml');
        if (!fs.existsSync(infoTomlPath)) {
            res.status(404).json({ error: 'info.toml not found' });
            return;
        }
        const tomlContent = fs.readFileSync(infoTomlPath, 'utf8');
        const parsed = toml.parse(tomlContent);
        const orderedExercises = (parsed.exercises || []).map(ex => {
            let category = '';
            let file = '';
            if (ex.path) {
                const match = ex.path.match(/^exercises\/(.+?)\/(.+)\.nr$/);
                if (match) {
                    category = match[1];
                    file = match[2] + '.nr';
                }
            }
            return {
                name: ex.name,
                path: ex.path,
                mode: ex.mode,
                hint: ex.hint,
                description: ex.description,
                category,
                file
            };
        });
        res.status(200).json(orderedExercises);
    } catch (error) {
        console.error('Error parsing info.toml for ordered exercises:', error);
        res.status(500).json({ error: 'Failed to parse info.toml' });
    }
} 