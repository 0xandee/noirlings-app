/**
 * API utility functions for the Noir Playground (static file version)
 */

/**
 * Fetch exercise content from static file
 * @param category The exercise category (e.g., 'intro', 'fields')
 * @param exercise The exercise filename (e.g., 'exercise1.nr')
 * @returns Promise with the exercise content
 */
export const fetchExerciseContent = async (category: string, exercise: string): Promise<string> => {
    try {
        const response = await fetch(`/exercises/${category}/${exercise}`);

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
 * Fetch all available exercise categories from static file
 * @returns Promise with an array of category names
 */
export const fetchExerciseCategories = async (): Promise<string[]> => {
    try {
        const response = await fetch(`/exercises/categories.json`);

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
 * Fetch exercises for a specific category from static file
 * @param category The exercise category
 * @returns Promise with an array of exercise names
 */
export const fetchCategoryExercises = async (category: string): Promise<string[]> => {
    try {
        const response = await fetch(`/exercises/${category}/exercises.json`);

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
 * Fetch the ordered list of exercises as specified in ordered-list.json
 * @returns Promise with an array of ordered exercise objects
 */
export const fetchOrderedExercises = async (): Promise<any[]> => {
    try {
        const response = await fetch(`/exercises/ordered-list.json`);
        if (!response.ok) {
            throw new Error(`Failed to fetch ordered exercises: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching ordered exercises:', error);
        throw error;
    }
}; 