import express from 'express';
import fs from 'fs';
import path from 'path';
import { joinPath } from '../utils/moduleHelper.js';
import toml from 'toml';

const router = express.Router();

// Base directory for exercises
const EXERCISES_BASE_DIR = path.join(path.dirname(new URL(import.meta.url).pathname), '../../../exercises');

// API endpoint to get all exercise categories
router.get('/exercises/categories', (req, res) => {
    try {
        // Read all directories in the exercises folder
        const categories = fs.readdirSync(EXERCISES_BASE_DIR, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name)
            // Filter out hidden directories (starting with .)
            .filter(name => !name.startsWith('.'));

        res.json(categories);
    } catch (error) {
        console.error('Error reading exercise categories:', error);
        res.status(500).json({ error: 'Failed to read exercise categories' });
    }
});

// API endpoint to get exercises for a specific category
router.get('/exercises/categories/:category', (req, res) => {
    const { category } = req.params;
    const categoryPath = path.join(EXERCISES_BASE_DIR, category);

    try {
        // Check if the category directory exists
        if (!fs.existsSync(categoryPath)) {
            return res.status(404).json({ error: `Category ${category} not found` });
        }

        // Read all files in the category directory
        const exercises = fs.readdirSync(categoryPath, { withFileTypes: true })
            .filter(dirent => dirent.isFile() && dirent.name.endsWith('.nr'))
            .map(dirent => dirent.name)
            // Filter out hidden files
            .filter(name => !name.startsWith('.'));

        res.json(exercises);
    } catch (error) {
        console.error(`Error reading exercises for category ${category}:`, error);
        res.status(500).json({ error: `Failed to read exercises for category ${category}` });
    }
});

// API endpoint to get the content of a specific exercise
router.get('/exercises/:category/:exercise', (req, res) => {
    const { category, exercise } = req.params;
    const exercisePath = path.join(EXERCISES_BASE_DIR, category, exercise);

    try {
        // Check if the exercise file exists
        if (!fs.existsSync(exercisePath)) {
            return res.status(404).json({ error: `Exercise ${exercise} in category ${category} not found` });
        }

        // Read the exercise file content
        const content = fs.readFileSync(exercisePath, 'utf8');

        // Send the content as plain text
        res.setHeader('Content-Type', 'text/plain');
        res.send(content);
    } catch (error) {
        console.error(`Error reading exercise ${exercise} in category ${category}:`, error);
        res.status(500).json({ error: `Failed to read exercise ${exercise} in category ${category}` });
    }
});

// API endpoint to get the ordered list of exercises from info.toml
router.get('/exercises/ordered-list', (req, res) => {
    try {
        // Path to info.toml
        const infoTomlPath = path.join(EXERCISES_BASE_DIR, 'info.toml');
        if (!fs.existsSync(infoTomlPath)) {
            return res.status(404).json({ error: 'info.toml not found' });
        }
        const tomlContent = fs.readFileSync(infoTomlPath, 'utf8');
        const parsed = toml.parse(tomlContent);
        // parsed.exercises is an array of exercise objects
        // Each has: name, path, mode, hint
        // Add category and file name for easier frontend grouping
        const orderedExercises = (parsed.exercises || []).map(ex => {
            // Extract category from path, e.g. exercises/arrays/array_basics.nr => arrays
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
        res.json(orderedExercises);
    } catch (error) {
        console.error('Error parsing info.toml for ordered exercises:', error);
        res.status(500).json({ error: 'Failed to parse info.toml' });
    }
});

export default router; 