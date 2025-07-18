const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Enhanced hint templates for each exercise  
const enhancedHints = {
    // Introduction
    "intro/intro1": "This exercise is already complete! Study the structure of the main function and the test - this is the basic template for all Noir programs.",

    // Variables
    "variables/variables1": "Every variable in Noir needs to be declared before use. What keyword is used to declare variables in Noir?",

    "variables/variables2": "Variables need a value when they're declared (or before they're used). Try assigning a value to `x` before the conditional.",

    "variables/variables3": "Variables are immutable by default in Noir. If you want to change a variable's value, you need to make it mutable using a keyword.",

    "variables/variables4": "Think about where the variable is declared versus where it's being used. Variables have scope - they're only visible within their block.",

    "variables/variables5": "Variable shadowing lets you declare a new variable with the same name. The new declaration 'shadows' (hides) the previous one.",

    "variables/variables6": "Constants are declared differently than variables and are evaluated at compile time. Look up the `const` keyword syntax.",

    // Fields
    "fields/field1": "In finite field arithmetic, what happens when you add 1 to the largest possible value (p-1)? Think about modular arithmetic.",

    // Integers
    "integers/integer1": "Regular arithmetic can overflow. Look for 'wrapping' methods that handle overflow safely. Check the `use std::ops::` import section.",

    "integers/integer2": "Temperature can be negative, so you'll need signed integer types. Consider what happens when converting between Celsius and Fahrenheit.",

    // Arrays
    "arrays/array_basics": "Arrays can be created with literal syntax [1, 2, 3] or filled with the same value. For loops and methods like `fold()` are useful for operations.",

    "arrays/array_advance": "The `map()` method transforms each element. Think about how to apply a transformation function to filter even numbers.",

    // Control Flow
    "control-flow/if1": "If expressions in Noir return values. Make sure your conditional logic returns the correct boolean value for voting eligibility.",

    "control-flow/grade_calculator": "Use if-else chains to check grade boundaries. Start with the highest grade (A) and work down, or use else-if for each range.",

    "control-flow/count_factors": "A factor is a number that divides evenly (remainder is 0). Use the modulo operator `%` to check if `n % i == 0`.",

    // Structs
    "structs/structs1": "Struct definition uses the `struct` keyword followed by field names and types. Each field needs a type annotation.",

    "structs/structs2": "Implementation blocks use `impl StructName { }`. Methods that take `self` can access the struct's fields using `self.field_name`.",

    "structs/structs3": "Nested structs are defined separately, then used as field types in other structs. Create the inner struct first, then the outer one.",

    "structs/shopping_cart": "Methods can modify the struct if they take `&mut self`. Arrays in structs can be indexed and modified like regular arrays.",

    // Traits
    "traits/traits1": "Implement the trait using `impl TraitName for StructName { }`. The area of a rectangle is width × height.",

    "traits/traits2": "You can implement multiple traits for the same type with separate `impl` blocks. Circle area uses π × r², perimeter uses 2 × π × r.",

    "traits/traits3": "Generic traits use type parameters. The Convert trait should transform one temperature type into another using the conversion formula.",

    "traits/traits4": "Default methods can be overridden in your implementation. Focus on implementing the required methods first.",

    "traits/traits5": "Trait bounds limit which types can be used with generics. Use `where T: TraitName` to specify that T must implement the trait.",

    // Tuples
    "tuples/tuple1": "Tuples group values of different types using parentheses: `(value1, value2, value3)`. Order matters!",

    "tuples/tuple2": "Destructure tuples to extract values: `let (a, b, c) = tuple;` or access by index: `tuple.0`, `tuple.1`, etc.",

    // Slices
    "slices/slice1": "Create a slice with `&[1, 2, 3]`. Use `push_back()` and `push_front()` methods to add elements. Remember to reassign the result!",

    "slices/slice2": "Slice methods like `insert()` and `pop_front()` return new slices. Always assign the result back to your slice variable.",

    "slices/slice3": "Chain operations: first `map()` to double elements, then `filter()` to keep only elements ≤ 10. Each method returns a new slice.",

    // Strings
    "strings/string1": "String literals use double quotes. String comparison in Noir works with the `==` operator.",

    "strings/string2": "Convert strings to bytes with `.as_bytes()`. Then iterate over the byte array to sum the ASCII values.",

    // References
    "references/reference1": "References use the `&` operator. They let you access data without taking ownership of it.",

    "references/reference2": "Mutable references use `&mut`. They let you modify data through the reference without moving the original value.",

    // Quizzes
    "quizs/quiz1": "Check if all three array elements are equal. Use logical AND (`&`) to combine equality comparisons.",

    // Advanced - Hashes
    "hashes/pedersen_hash": "Import the Pedersen hash function from the standard library. Use it to hash your input data and observe the deterministic output.",

    // Advanced - Embedded Curves
    "embedded_curves/embedded_curve1": "Define a struct with three fields: `x: Field`, `y: Field`, and `is_infinite: bool`. This represents a point on an elliptic curve.",

    "embedded_curves/embedded_curve2": "Implement the required methods: generator returns a specific point, point_at_infinity has special coordinates, and negation flips the y-coordinate."
};

// Function to update hints in exercise files
function updateHints() {
    const exercisesDir = path.join(__dirname, '../packages/playground/public/exercises');
    const basicDir = path.join(exercisesDir, 'basic');
    const advancedDir = path.join(exercisesDir, 'advanced');

    // Update basic exercises
    updateHintsInDir(basicDir, 'basic');

    // Update advanced exercises  
    updateHintsInDir(advancedDir, 'advanced');

    console.log('✅ Enhanced hints updated successfully!');
}

function updateHintsInDir(dirPath, type) {
    const categories = fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    categories.forEach(category => {
        const categoryPath = path.join(dirPath, category);
        const exercises = fs.readdirSync(categoryPath)
            .filter(file => file.endsWith('.md'));

        exercises.forEach(exercise => {
            const exercisePath = path.join(categoryPath, exercise);
            const exerciseKey = `${category}/${exercise.replace('.md', '')}`;

            if (enhancedHints[exerciseKey]) {
                updateExerciseHint(exercisePath, enhancedHints[exerciseKey], exerciseKey);
            }
        });
    });
}

function updateExerciseHint(filePath, newHint, exerciseKey) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);

        // Update the hint in the frontmatter
        if (data.locales && data.locales.en) {
            data.locales.en.hint = newHint;
        } else {
            // Create the structure if it doesn't exist
            data.locales = data.locales || {};
            data.locales.en = data.locales.en || {};
            data.locales.en.hint = newHint;
        }

        // Reconstruct the file with updated frontmatter
        const updatedContent = matter.stringify(markdownContent, data);
        fs.writeFileSync(filePath, updatedContent);

        console.log(`✓ Updated ${exerciseKey} hint`);
    } catch (error) {
        console.error(`✗ Error updating ${exerciseKey}:`, error.message);
    }
}

// Run the update
if (require.main === module) {
    updateHints();
}

module.exports = { updateHints, enhancedHints }; 