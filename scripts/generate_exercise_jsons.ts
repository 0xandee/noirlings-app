import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Use __dirname directly instead of import.meta.url
const EXERCISES_DIR = path.join(__dirname, '../packages/playground/public/exercises');

// Define the order of exercise categories
const BASIC_CATEGORIES = [
    "intro",
    "variables",
    "fields",
    "integers",
    "arrays",
    "control-flow",
    "structs",
    "traits",
    "tuples",
    "slices",
    "strings",
    "references",
    "quizs"
];

const ADVANCED_CATEGORIES = [
    "hashes",
    "embedded_curves",
    "merkle_trees",
    "signatures",
    "optimization",
    "ethereum",
    "privacy",
    "recursive_proofs"
];

// Define interface for exercises metadata
interface ExerciseMetadata {
    path: string;
    id: string;
    title: string;
    category: string;
    difficulty: string;
    tags: string[];
    mode: string;
    prerequisites: string[];
    version: string;
    locales: {
        en: {
            hint: string;
            description: string;
            docLink?: string;
        }
    }
}

// Define exercise order within categories
const exerciseOrder: Record<string, string[]> = {
    "intro": ["intro1"],
    "variables": ["variables1", "variables2", "variables3", "variables4", "variables5", "variables6"],
    "fields": ["field1"],
    "integers": ["integer1", "integer2"],
    "arrays": ["array_basics", "array_advance"],
    "control-flow": ["if1", "grade_calculator", "count_factors"],
    "structs": ["structs1", "structs2", "structs3", "shopping_cart"],
    "traits": ["traits1", "traits2", "traits3", "traits4", "traits5"],
    "tuples": ["tuple1", "tuple2"],
    "slices": ["slice1", "slice2", "slice3", "slice4", "slice5"],
    "strings": ["string1", "string2"],
    "references": ["reference1", "reference2"],
    "quizs": ["quiz1"],
    "hashes": ["pedersen_hash", "blake2s_hash", "blake3_hash", "keccak_hash"],
    "embedded_curves": ["embedded_curve1", "embedded_curve2", "scalar_multiplication", "multi_scalar_multiplication"],
    "merkle_trees": ["merkle_basic", "merkle_proof", "indexed_merkle_tree", "sparse_merkle_tree"],
    "signatures": ["ecdsa_basic"],
    "optimization": ["unconstrained_basic", "black_box_functions"],
    "ethereum": ["rlp_encoding", "rlp_decoding", "state_proofs"],
    "privacy": ["privacy_voting", "age_verification", "range_proofs"],
    "recursive_proofs": ["recursive_basic"]
};

// Function to determine difficulty based on category and file name
function getDifficultyFromName(category: string, fileName: string): string {
    const hardKeywords = ['multi_scalar_multiplication', 'indexed_merkle_tree', 'sparse_merkle_tree', 'rlp_decoding', 'state_proofs', 'privacy_voting', 'range_proofs'];
    const mediumKeywords = ['keccak_hash', 'scalar_multiplication', 'merkle_proof', 'unconstrained_basic', 'black_box_functions', 'rlp_encoding', 'recursive_basic', 'age_verification'];

    if (hardKeywords.some(keyword => fileName.includes(keyword))) {
        return 'hard';
    } else if (mediumKeywords.some(keyword => fileName.includes(keyword))) {
        return 'medium';
    } else {
        return 'easy';
    }
}

// Function to get prerequisites based on exercise
function getPrerequisites(category: string, fileName: string): string[] {
    const prereqMap: Record<string, string[]> = {
        'scalar_multiplication': ['embedded_curve1', 'embedded_curve2'],
        'multi_scalar_multiplication': ['scalar_multiplication'],
        'merkle_proof': ['merkle_basic'],
        'indexed_merkle_tree': ['merkle_basic', 'merkle_proof'],
        'sparse_merkle_tree': ['merkle_basic', 'merkle_proof'],
        'rlp_decoding': ['rlp_encoding'],
        'state_proofs': ['rlp_encoding', 'merkle_basic'],
        'privacy_voting': ['merkle_basic']
    };

    return prereqMap[fileName] || [];
}

// Function to generate hint based on category and file name
function getHintForExercise(category: string, fileName: string): string {
    const hints: Record<string, string> = {
        'pedersen_hash': 'Import the Pedersen hash function from the standard library. Use it to hash your input data and observe the deterministic output.',
        'blake2s_hash': 'Blake2s is a fast cryptographic hash function. Import it from the standard library and use it to hash byte arrays. Compare its properties with other hash functions like Pedersen.',
        'blake3_hash': 'Blake3 is the newest member of the Blake family, designed for maximum performance and security. Use std::hash::blake3 to hash byte arrays and explore its unique properties.',
        'keccak_hash': 'Keccak is the hash function used by Ethereum (different from NIST SHA-3). Use the keccakf1600 black box function to implement Keccak256 hashing for Ethereum compatibility.',
        'embedded_curve1': 'Define a struct with three fields: `x: Field`, `y: Field`, and `is_infinite: bool`. This represents a point on an elliptic curve.',
        'embedded_curve2': 'Implement the required methods: generator returns a specific point, point_at_infinity has special coordinates, and negation flips the y-coordinate.',
        'scalar_multiplication': 'Scalar multiplication is repeated point addition on elliptic curves. Use the embedded curve operations for point addition and doubling. Implement the double-and-add algorithm for efficiency.',
        'multi_scalar_multiplication': 'Multi-scalar multiplication (MSM) computes k₁*P₁ + k₂*P₂ + ... + kₙ*Pₙ efficiently. Use the built-in multi_scalar_mul function and compare with naive approaches to understand the performance benefits.',
        'merkle_basic': 'A Merkle tree is a binary tree where each leaf is a hash of data and each internal node is a hash of its children. Start with the leaves, then hash pairs to build up to the root.',
        'merkle_proof': 'A Merkle proof consists of a leaf value, its position, and the sibling hashes needed to reconstruct the path to the root. Use the sibling hashes to verify inclusion without knowing the entire tree.',
        'indexed_merkle_tree': 'Indexed Merkle trees maintain both the tree structure and an index mapping values to leaf positions. Use the index for fast lookups and generate proofs efficiently.',
        'sparse_merkle_tree': 'Sparse Merkle trees use default hashes for empty subtrees and only store non-empty nodes. Precompute default hashes for each level and use them for missing siblings in proofs.',
        'ecdsa_basic': 'ECDSA verification requires a message hash, signature (r,s), and public key. Use the std::ecdsa_secp256k1 module to verify the signature against the message and public key.',
        'unconstrained_basic': 'Unconstrained functions run outside the circuit and don\'t add constraints. Use the \'unconstrained\' keyword for computations that can be verified separately. Always validate unconstrained results in constrained code.',
        'black_box_functions': 'Black box functions are optimized operations that run outside the circuit. Use functions like blake2s, sha256, aes128, and ecdsa_secp256k1 for efficient cryptographic operations.',
        'rlp_encoding': 'RLP encoding has specific rules for different data types. Single bytes ≤ 0x7f encode as themselves, short strings use 0x80 + length, and lists use 0xc0 + length. Handle long strings and lists with length prefixes.',
        'rlp_decoding': 'RLP decoding reverses the encoding process. Parse the first byte to determine data type, then extract length information and recursively decode nested structures. Handle all RLP encoding rules in reverse.',
        'state_proofs': 'Ethereum state proofs use Merkle-Patricia tries with RLP encoding. Convert addresses to trie paths, traverse proof nodes, and verify account data using Keccak256 hashing. Handle branch, extension, and leaf nodes appropriately.',
        'privacy_voting': 'Privacy-preserving voting uses nullifiers to prevent double voting and Merkle trees for voter eligibility. Encrypt votes using homomorphic encryption and use zero-knowledge proofs to verify eligibility without revealing identity.',
        'age_verification': 'Age verification uses range proofs and commitment schemes. Commit to birth date with a trusted authority, then generate range proofs to prove age meets requirements without revealing exact age.',
        'range_proofs': 'Range proofs use bit decomposition and commitment schemes. Decompose amounts into bits, create commitments to each bit, prove each bit is 0 or 1, then prove the bits reconstruct to a value in the valid range.',
        'recursive_basic': 'Recursive proofs allow one Noir program to verify another Noir program\'s proof. Use the #[recursive] attribute and std::verify_proof to implement recursive verification.'
    };

    return hints[fileName] || `Complete the ${fileName} exercise in the ${category} category.`;
}

function generateIndexForMode(categories: string[], base: 'basic' | 'advanced') {
    let allExercises: ExerciseMetadata[] = [];

    // Process each category in the defined order
    categories.forEach(category => {
        const categoryDir = path.join(EXERCISES_DIR, base, category);
        if (!fs.existsSync(categoryDir)) return;

        const files = fs.readdirSync(categoryDir).filter(f => f.endsWith('.md'));
        const categoryExercises: ExerciseMetadata[] = [];

        // Process each file
        files.forEach(file => {
            const mdPath = path.join(categoryDir, file);
            const content = fs.readFileSync(mdPath, 'utf8');
            const { data } = matter(content);
            const fileBase = file.replace('.md', '');
            const relativePath = `${category}/${file}`;

            // Generate metadata with better defaults
            const metadata: ExerciseMetadata = {
                path: relativePath,
                id: data.id || fileBase,
                title: data.title || fileBase,
                category: data.category || category,
                difficulty: data.difficulty || getDifficultyFromName(category, fileBase),
                tags: data.tags || [],
                mode: data.mode || 'test',
                prerequisites: data.prerequisites || getPrerequisites(category, fileBase),
                version: data.version || '1.0.0',
                locales: {
                    en: {
                        hint: data.locales?.en?.hint || getHintForExercise(category, fileBase),
                        description: data.locales?.en?.description || '',
                        docLink: data.locales?.en?.docLink || ''
                    }
                }
            };
            categoryExercises.push(metadata);
        });

        // Sort files within each category according to defined order
        if (exerciseOrder[category]) {
            categoryExercises.sort((a, b) => {
                const aIndex = exerciseOrder[category].indexOf(a.id);
                const bIndex = exerciseOrder[category].indexOf(b.id);

                // If both exist in the order array, sort by defined order
                if (aIndex >= 0 && bIndex >= 0) {
                    return aIndex - bIndex;
                }
                // If only one exists, prioritize the defined one
                else if (aIndex >= 0) {
                    return -1;
                }
                else if (bIndex >= 0) {
                    return 1;
                }
                // If neither exists in order array, sort alphabetically
                return a.id.localeCompare(b.id);
            });
        }

        // Add sorted category exercises to the overall exercises array
        allExercises = [...allExercises, ...categoryExercises];
    });

    const outputPath = path.join(EXERCISES_DIR, base, 'index.json');
    fs.writeFileSync(outputPath, JSON.stringify(allExercises, null, 2));
    console.log(`Generated ${outputPath}`);
}

generateIndexForMode(BASIC_CATEGORIES, 'basic');
generateIndexForMode(ADVANCED_CATEGORIES, 'advanced');

console.log('Index files generated successfully.'); 