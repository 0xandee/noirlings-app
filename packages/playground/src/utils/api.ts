/**
 * API utility functions for the Noir Playground
 */

const API_BASE_URL = window.location.origin;

/**
 * Fetch exercise content from the server
 * @param category The exercise category (e.g., 'intro', 'fields')
 * @param exercise The exercise filename (e.g., 'exercise1.nr')
 * @returns Promise with the exercise content
 */
export const fetchExerciseContent = async (category: string, exercise: string): Promise<string> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/exercises/${category}/${exercise}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exercise: ${response.statusText}`);
        }

        return await response.text();
    } catch (error) {
        console.error('Error fetching exercise content:', error);
        throw error;
    }
};

/**
 * Fetch all available exercise categories
 * @returns Promise with an array of category names
 */
export const fetchExerciseCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/exercises/categories`);

        if (!response.ok) {
            throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching exercise categories:', error);
        throw error;
    }
};

/**
 * Fetch exercises for a specific category
 * @param category The exercise category
 * @returns Promise with an array of exercise names
 */
export const fetchCategoryExercises = async (category: string): Promise<string[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/exercises/categories/${category}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch exercises for category: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching exercises for category ${category}:`, error);
        throw error;
    }
};

/**
 * Fetch the ordered list of exercises as specified in info.toml
 * @returns Promise with an array of ordered exercise objects
 */
export const fetchOrderedExercises = async (): Promise<any[]> => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/exercises/ordered-list`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ordered exercises: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching ordered exercises:', error);
        throw error;
    }
}; 