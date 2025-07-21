const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Enhanced description templates for each exercise
const enhancedDescriptions = {
    // Introduction
    "intro/intro1": {
        whatYoullLearn: "The basics of Noir as a domain-specific language for zero-knowledge proofs",
        yourTask: "Understand the structure of a basic Noir program and recognize the main function requirement",
        keyConcept: "Every Noir program must have a `main` function - this is the entry point where your zero-knowledge circuit begins execution"
    },

    // Variables
    "variables/variables1": {
        whatYoullLearn: "How to properly declare variables in Noir using the `let` keyword",
        yourTask: "Fix the compilation error by adding the missing variable declaration",
        keyConcept: "Variables in Noir must be explicitly declared with `let` before they can be used - this helps prevent errors in your ZK circuits"
    },

    "variables/variables2": {
        whatYoullLearn: "Variable initialization requirements in Noir",
        yourTask: "Initialize the variable `x` with a value before using it in the conditional statement",
        keyConcept: "Variables must be initialized with a value before they can be used in comparisons or other operations"
    },

    "variables/variables3": {
        whatYoullLearn: "The difference between mutable and immutable variables in Noir",
        yourTask: "Make the variable mutable so it can be modified after declaration",
        keyConcept: "Variables are immutable by default - use `mut` keyword to make them mutable when you need to change their values"
    },

    "variables/variables4": {
        whatYoullLearn: "Variable scope rules in Noir functions and blocks",
        yourTask: "Fix the scope issue to make the variable accessible where it's needed",
        keyConcept: "Variables have block scope - they're only accessible within the block (between `{}`) where they're declared"
    },

    "variables/variables5": {
        whatYoullLearn: "Variable shadowing - when a new variable with the same name hides an older one",
        yourTask: "Understand how variable shadowing works by declaring a new variable with the same name",
        keyConcept: "Variable shadowing allows you to reuse variable names in the same scope, with the new declaration hiding the previous one"
    },

    "variables/variables6": {
        whatYoullLearn: "Constants vs variables - when to use compile-time constant values",
        yourTask: "Define and use constants for values that don't change during program execution",
        keyConcept: "Constants are evaluated at compile time and cannot be changed - they're useful for fixed parameters in your ZK circuits"
    },

    // Fields
    "fields/field1": {
        whatYoullLearn: "Finite field arithmetic - the mathematical foundation of zero-knowledge proofs",
        yourTask: "Understand how field operations work with the prime modulus and fix the field arithmetic expressions",
        keyConcept: "All arithmetic in Noir happens in a finite field modulo a large prime p. When you exceed p-1, values wrap around to 0"
    },

    // Integers
    "integers/integer1": {
        whatYoullLearn: "Integer wrapping methods to handle overflow safely in constrained environments",
        yourTask: "Use wrapping arithmetic methods to prevent overflow errors in your calculations",
        keyConcept: "ZK circuits need predictable behavior - wrapping methods provide safe arithmetic that won't cause constraint system failures"
    },

    "integers/integer2": {
        whatYoullLearn: "Signed vs unsigned integers and their use cases in zero-knowledge programs",
        yourTask: "Implement temperature conversion using appropriate signed integer types",
        keyConcept: "Choose signed integers (i8, i16, i32, i64) when you need negative values, unsigned (u8, u16, u32, u64) for non-negative values"
    },

    // Arrays
    "arrays/array_basics": {
        whatYoullLearn: "Array creation, indexing, and basic operations in Noir",
        yourTask: "Complete the array manipulation functions using proper syntax and methods",
        keyConcept: "Arrays in Noir have fixed sizes known at compile time, making them efficient for zero-knowledge circuit generation"
    },

    "arrays/array_advance": {
        whatYoullLearn: "Advanced array methods like map, fold, and filter for functional programming",
        yourTask: "Use array methods to transform and process data functionally",
        keyConcept: "Functional array methods create more readable code and often compile to more efficient circuits than manual loops"
    },

    // Control Flow
    "control-flow/if1": {
        whatYoullLearn: "Conditional logic using if expressions in Noir",
        yourTask: "Implement the voting age check logic using conditional expressions",
        keyConcept: "If expressions in Noir return values and must handle all code paths - they're expressions, not just statements"
    },

    "control-flow/grade_calculator": {
        whatYoullLearn: "Complex conditional logic with multiple if-else branches",
        yourTask: "Complete the grade calculator with proper conditional chains",
        keyConcept: "Chain if-else statements to handle multiple conditions efficiently in your zero-knowledge programs"
    },

    "control-flow/count_factors": {
        whatYoullLearn: "Loop constructs for iterative algorithms in zero-knowledge programs",
        yourTask: "Use for loops to count factors and find special numbers",
        keyConcept: "For loops in ZK circuits must have bounds known at compile time - this allows the prover to generate the correct number of constraints"
    },

    // Structs
    "structs/structs1": {
        whatYoullLearn: "Defining custom data structures to organize related data",
        yourTask: "Define a Point struct with x and y coordinates",
        keyConcept: "Structs group related data together, making your zero-knowledge programs more organized and easier to understand"
    },

    "structs/structs2": {
        whatYoullLearn: "Adding methods to structs using implementation blocks",
        yourTask: "Implement the area method for the Rectangle struct",
        keyConcept: "Implementation blocks (`impl`) allow you to attach functions to your custom types, creating object-like behavior"
    },

    "structs/structs3": {
        whatYoullLearn: "Creating nested struct structures for complex data relationships",
        yourTask: "Build a Person struct that contains an Address struct",
        keyConcept: "Nested structs help model complex real-world data while keeping your ZK circuit organized and efficient"
    },

    "structs/shopping_cart": {
        whatYoullLearn: "Complex struct operations with arrays and state management",
        yourTask: "Implement shopping cart methods for adding products and managing inventory",
        keyConcept: "Real-world ZK applications often need complex state management - structs with arrays help organize this efficiently"
    },

    // Traits
    "traits/traits1": {
        whatYoullLearn: "Defining and implementing traits to add behavior to types",
        yourTask: "Implement the Area trait for the Rectangle type",
        keyConcept: "Traits define shared behavior that multiple types can implement, enabling polymorphism in your ZK programs"
    },

    "traits/traits2": {
        whatYoullLearn: "Implementing multiple traits on a single type",
        yourTask: "Implement both Area and Perimeter traits for the Circle type",
        keyConcept: "Types can implement multiple traits, allowing them to have diverse capabilities while maintaining type safety"
    },

    "traits/traits3": {
        whatYoullLearn: "Generic traits that work with type parameters",
        yourTask: "Implement the Convert trait to transform between temperature types",
        keyConcept: "Generic traits enable type-safe conversions and operations that work across different but related types"
    },

    "traits/traits4": {
        whatYoullLearn: "Default trait methods that provide common implementations",
        yourTask: "Use default trait methods while implementing custom behavior",
        keyConcept: "Default methods reduce code duplication by providing common functionality that types can use or override"
    },

    "traits/traits5": {
        whatYoullLearn: "Trait bounds with generics to constrain type parameters",
        yourTask: "Write a generic function that works only with types implementing the Maximum trait",
        keyConcept: "Trait bounds ensure generic functions only work with types that have the required capabilities"
    },

    // Tuples
    "tuples/tuple1": {
        whatYoullLearn: "Creating and destructuring tuple types for grouped data",
        yourTask: "Create a tuple representing a person's information and return it",
        keyConcept: "Tuples group different types together temporarily - useful for functions that need to return multiple values"
    },

    "tuples/tuple2": {
        whatYoullLearn: "Advanced tuple operations and pattern matching",
        yourTask: "Extract and manipulate data from tuple structures",
        keyConcept: "Tuple destructuring lets you extract values cleanly, making your code more readable and maintainable"
    },

    // Slices
    "slices/slice1": {
        whatYoullLearn: "Creating and manipulating slices - dynamic arrays in Noir",
        yourTask: "Create a slice and use push_back and push_front methods to modify it",
        keyConcept: "Slices provide dynamic arrays that can grow and shrink, useful when array size isn't known at compile time"
    },

    "slices/slice2": {
        whatYoullLearn: "Advanced slice methods for insertion, removal, and manipulation",
        yourTask: "Use insert, pop_front, and other slice methods to transform data",
        keyConcept: "Slice methods return new slices rather than modifying existing ones, following functional programming principles"
    },

    "slices/slice3": {
        whatYoullLearn: "Functional programming with slices using map and filter",
        yourTask: "Chain slice operations to transform and filter data functionally",
        keyConcept: "Functional slice operations often compile to more efficient circuits than imperative approaches"
    },

    // Strings
    "strings/string1": {
        whatYoullLearn: "String literals, declarations, and basic string operations",
        yourTask: "Work with string literals and implement string comparison logic",
        keyConcept: "Strings in Noir have fixed sizes specified in their type, ensuring predictable memory usage in ZK circuits"
    },

    "strings/string2": {
        whatYoullLearn: "String methods and byte-level manipulation",
        yourTask: "Convert strings to bytes and perform arithmetic operations on character values",
        keyConcept: "String-to-bytes conversion allows you to work with character data at a low level, useful for cryptographic operations"
    },

    // References
    "references/reference1": {
        whatYoullLearn: "Creating and using references to avoid data copying",
        yourTask: "Use references to efficiently work with data without taking ownership",
        keyConcept: "References let you access data without moving it, important for performance in zero-knowledge circuits"
    },

    "references/reference2": {
        whatYoullLearn: "Mutable references for modifying data in place",
        yourTask: "Use mutable references to modify data without creating copies",
        keyConcept: "Mutable references enable efficient in-place modifications while maintaining Noir's safety guarantees"
    },

    // Quizzes
    "quizs/quiz1": {
        whatYoullLearn: "Combining arrays and conditional logic to solve practical problems",
        yourTask: "Implement array equality checking using conditional logic and boolean operations",
        keyConcept: "Combining basic concepts like arrays, loops, and conditionals is essential for building complex ZK applications"
    },

    // Advanced - Hashes
    "hashes/pedersen_hash": {
        whatYoullLearn: "Cryptographic hash functions and their role in zero-knowledge proofs",
        yourTask: "Implement Pedersen hash operations and understand their cryptographic properties",
        keyConcept: "Pedersen hashes are ZK-friendly cryptographic primitives that enable efficient commitment schemes and merkle trees in circuits"
    },

    // Advanced - Embedded Curves
    "embedded_curves/embedded_curve1": {
        whatYoullLearn: "Elliptic curve points and their representation in zero-knowledge systems",
        yourTask: "Define the EmbeddedCurvePoint structure with proper field types",
        keyConcept: "Embedded curves enable efficient elliptic curve operations within ZK circuits, crucial for advanced cryptographic protocols"
    },

    "embedded_curves/embedded_curve2": {
        whatYoullLearn: "Elliptic curve operations like point addition and scalar multiplication",
        yourTask: "Implement generator points, point at infinity, and negation operations",
        keyConcept: "Curve operations form the basis of many ZK protocols - understanding points, generators, and group operations is essential"
    }
};

// Template function to create structured descriptions
function createEnhancedDescription(whatYoullLearn, yourTask, keyConcept) {
    return `## What You'll Learn
${whatYoullLearn}

## Your Task
${yourTask}

## Key Concept
${keyConcept}`;
}

// Function to update descriptions in exercise files
function updateDescriptions() {
    const exercisesDir = path.join(__dirname, '../packages/playground/public/exercises');
    const basicDir = path.join(exercisesDir, 'basic');
    const advancedDir = path.join(exercisesDir, 'advanced');

    // Update basic exercises
    updateDescriptionsInDir(basicDir, 'basic');

    // Update advanced exercises  
    updateDescriptionsInDir(advancedDir, 'advanced');

    console.log('✅ Enhanced descriptions updated successfully!');
}

function updateDescriptionsInDir(dirPath, type) {
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

            if (enhancedDescriptions[exerciseKey]) {
                updateExerciseDescription(exercisePath, enhancedDescriptions[exerciseKey], exerciseKey);
            }
        });
    });
}

function updateExerciseDescription(filePath, descriptionData, exerciseKey) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownContent } = matter(content);

        // Create enhanced description
        const enhancedDesc = createEnhancedDescription(
            descriptionData.whatYoullLearn,
            descriptionData.yourTask,
            descriptionData.keyConcept
        );

        // Update the description in the frontmatter
        if (data.locales && data.locales.en) {
            data.locales.en.description = enhancedDesc;
        } else {
            // Create the structure if it doesn't exist
            data.locales = data.locales || {};
            data.locales.en = data.locales.en || {};
            data.locales.en.description = enhancedDesc;
        }

        // Reconstruct the file with updated frontmatter
        const updatedContent = matter.stringify(markdownContent, data);
        fs.writeFileSync(filePath, updatedContent);

        console.log(`✓ Updated ${exerciseKey} description`);
    } catch (error) {
        console.error(`✗ Error updating ${exerciseKey}:`, error.message);
    }
}

// Run the update
if (require.main === module) {
    updateDescriptions();
}

module.exports = {
    updateDescriptions,
    enhancedDescriptions,
    createEnhancedDescription
}; 