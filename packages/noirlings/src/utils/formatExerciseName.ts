// Utility function to format exercise name
export function formatExerciseName(name: string): string {
    // Replace underscores with spaces
    let formatted = name.replace(/_/g, ' ');
    // Capitalize each word
    formatted = formatted.replace(/\b\w/g, c => c.toUpperCase());
    // Add space before trailing number if present
    formatted = formatted.replace(/(\D)(\d)$/g, '$1 $2');
    return formatted;
} 