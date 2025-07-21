const fs = require('fs');
const path = require('path');

// Comprehensive prerequisite mapping for logical ZK learning progression
const PREREQUISITE_MAPPING = {
    // === FOUNDATION LEVEL (no prerequisites) ===
    // Hashes - Basic cryptographic primitives
    'pedersen_hash': [],
    'blake2s_hash': [],
    'blake3_hash': [],
    'keccak_hash': [],

    // === CORE CONCEPTS ===
    // Embedded curves - basic elliptic curve operations
    'embedded_curve1': [],
    'embedded_curve2': ['embedded_curve1'],
    'scalar_multiplication': ['embedded_curve1', 'embedded_curve2'],
    'multi_scalar_multiplication': ['scalar_multiplication'],

    // Signatures - digital signatures (depends on curves)
    'ecdsa_basic': ['scalar_multiplication'],

    // Basic merkle trees (depends on hashes)
    'merkle_basic': ['pedersen_hash'],
    'merkle_proof': ['merkle_basic'],
    'sparse_merkle_tree': ['merkle_proof'],
    'indexed_merkle_tree': ['merkle_proof'],

    // === PRIVACY BUILDING BLOCKS ===
    // Date arithmetic - foundational for age proofs
    'date_arithmetic': ['pedersen_hash'],

    // Identity commitments (depends on hashes and date arithmetic)
    'identity_commitments': ['date_arithmetic', 'pedersen_hash'],

    // Amount commitments (foundation for range proofs)
    'amount_commitments': ['identity_commitments'],

    // Voter commitments (foundation for voting)
    'voter_commitments': ['identity_commitments'],

    // === INTERMEDIATE PRIVACY ===
    // Age proofs (builds on identity commitments)
    'age_proofs_basic': ['identity_commitments'],
    'age_verification_system': ['age_proofs_basic'],

    // Range proofs (builds on amount commitments)
    'range_proofs_basic': ['amount_commitments'],
    'private_transactions': ['range_proofs_basic'],

    // Voting system components
    'nullifier_system': ['voter_commitments'],
    'vote_encryption': ['nullifier_system'],
    'election_system': ['vote_encryption', 'merkle_proof'],

    // === BLOCKCHAIN INTEGRATION ===
    // RLP encoding/decoding (foundation for Ethereum)
    'rlp_encoding': ['keccak_hash'],
    'rlp_basics': ['keccak_hash'],
    'rlp_advanced': ['rlp_basics'],
    'rlp_decoding': ['rlp_encoding'], // Original large exercise

    // Ethereum trie structures (depends on RLP and hashes)
    'trie_basics': ['keccak_hash', 'rlp_encoding'],
    'account_proofs': ['trie_basics', 'rlp_basics'],
    'storage_proofs': ['account_proofs'],
    'trie_traversal': ['storage_proofs'],

    // Ethereum state proofs (original large exercise, superseded by broken down version)
    'state_proofs': ['rlp_decoding', 'merkle_basic'],

    // === ORIGINAL LARGE EXERCISES (for reference) ===
    'age_verification': ['pedersen_hash', 'merkle_basic'],
    'privacy_voting': ['pedersen_hash', 'merkle_basic', 'ecdsa_basic'],
    'range_proofs': ['pedersen_hash'],

    // === ADVANCED CONCEPTS ===
    // Optimization techniques
    'unconstrained_basic': ['pedersen_hash'],
    'black_box_functions': ['unconstrained_basic'],

    // Recursive proofs (most advanced)
    'recursive_basic': ['merkle_proof', 'ecdsa_basic']
};

// Cross-category prerequisite recommendations
const CROSS_CATEGORY_DEPS = {
    // Privacy exercises should understand hashes
    'privacy': ['pedersen_hash'],
    // Ethereum exercises need hashes and basic structures  
    'ethereum': ['keccak_hash'],
    // Merkle trees need hashes
    'merkle_trees': ['pedersen_hash'],
    // Advanced topics need foundations
    'recursive_proofs': ['merkle_basic', 'ecdsa_basic'],
    'optimization': ['pedersen_hash']
};

class PrerequisiteUpdater {
    constructor() {
        this.advancedDir = path.join(__dirname, '../packages/playground/public/exercises/advanced');
        this.indexPath = path.join(this.advancedDir, 'index.json');
        this.updatedCount = 0;
        this.newlyAddedCount = 0;
    }

    async updateAllPrerequisites() {
        console.log('🔗 Updating Exercise Prerequisites...\n');

        // Read current index
        let exercises = [];
        if (fs.existsSync(this.indexPath)) {
            const indexContent = fs.readFileSync(this.indexPath, 'utf8');
            exercises = JSON.parse(indexContent);
        }

        // Update existing exercises
        for (const exercise of exercises) {
            const oldPrereqs = [...(exercise.prerequisites || [])];
            const newPrereqs = this.getPrerequisites(exercise.id);

            if (JSON.stringify(oldPrereqs.sort()) !== JSON.stringify(newPrereqs.sort())) {
                exercise.prerequisites = newPrereqs;
                this.updatedCount++;
                console.log(`📝 Updated ${exercise.id}: ${oldPrereqs.join(', ')} → ${newPrereqs.join(', ')}`);
            }
        }

        // Add any missing exercises (our new ones)
        await this.addMissingExercises(exercises);

        // Write updated index
        const updatedIndex = JSON.stringify(exercises, null, 2);
        fs.writeFileSync(this.indexPath, updatedIndex);

        console.log(`\n✅ Prerequisites Update Complete!`);
        console.log(`📊 Updated ${this.updatedCount} existing exercises`);
        console.log(`🆕 Added ${this.newlyAddedCount} new exercises`);

        return exercises;
    }

    getPrerequisites(exerciseId) {
        const mapped = PREREQUISITE_MAPPING[exerciseId] || [];

        // Ensure prerequisites exist and are reasonable
        return mapped.filter(prereq => {
            return PREREQUISITE_MAPPING.hasOwnProperty(prereq) ||
                this.isExistingExercise(prereq);
        });
    }

    isExistingExercise(exerciseId) {
        // Check if exercise exists in any category
        const categories = ['hashes', 'embedded_curves', 'signatures', 'merkle_trees',
            'privacy', 'ethereum', 'optimization', 'recursive_proofs'];

        for (const category of categories) {
            const categoryPath = path.join(this.advancedDir, category);
            if (fs.existsSync(categoryPath)) {
                const files = fs.readdirSync(categoryPath);
                if (files.includes(`${exerciseId}.md`)) {
                    return true;
                }
            }
        }
        return false;
    }

    async addMissingExercises(exercises) {
        const existingIds = new Set(exercises.map(ex => ex.id));
        const categories = ['privacy', 'ethereum']; // Categories where we added new exercises

        for (const category of categories) {
            const categoryPath = path.join(this.advancedDir, category);
            if (!fs.existsSync(categoryPath)) continue;

            const files = fs.readdirSync(categoryPath)
                .filter(file => file.endsWith('.md'))
                .map(file => file.replace('.md', ''));

            for (const exerciseId of files) {
                if (!existingIds.has(exerciseId)) {
                    const exerciseData = await this.createExerciseIndexEntry(category, exerciseId);
                    if (exerciseData) {
                        exercises.push(exerciseData);
                        this.newlyAddedCount++;
                        console.log(`🆕 Added new exercise: ${exerciseId}`);
                    }
                }
            }
        }
    }

    async createExerciseIndexEntry(category, exerciseId) {
        const filePath = path.join(this.advancedDir, category, `${exerciseId}.md`);

        if (!fs.existsSync(filePath)) {
            return null;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

            if (!frontmatterMatch) {
                console.warn(`⚠️  No frontmatter found for ${exerciseId}`);
                return null;
            }

            // Parse frontmatter
            const frontmatter = frontmatterMatch[1];
            const metadata = this.parseFrontmatter(frontmatter);

            // Extract hint and description from content
            const hintMatch = content.match(/hint:\s*>-\s*([\s\S]*?)description:/);
            const descMatch = content.match(/description:\s*>-?\s*([\s\S]*?)(?:docLink:|---|\n\n)/);
            const docLinkMatch = content.match(/docLink:\s*"([^"]*?)"/);

            return {
                path: `${category}/${exerciseId}.md`,
                id: exerciseId,
                title: metadata.title || exerciseId,
                category: category,
                difficulty: metadata.difficulty || 'medium',
                tags: metadata.tags || [],
                mode: metadata.mode || 'test',
                prerequisites: this.getPrerequisites(exerciseId),
                version: metadata.version || '1.0.0',
                locales: {
                    en: {
                        hint: hintMatch ? hintMatch[1].trim() : 'Complete the TODO items to implement the functionality.',
                        description: descMatch ? descMatch[1].trim() : `Learn ${exerciseId} concepts and implementation.`,
                        docLink: docLinkMatch ? docLinkMatch[1] : ''
                    }
                }
            };
        } catch (error) {
            console.error(`❌ Error processing ${exerciseId}:`, error.message);
            return null;
        }
    }

    parseFrontmatter(frontmatter) {
        const metadata = {};
        const lines = frontmatter.split('\n');

        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                if (key === 'prerequisites') {
                    metadata[key] = value.includes('[') ?
                        value.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(s => s) : [];
                } else if (key === 'tags') {
                    metadata[key] = value.includes('[') ?
                        value.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(s => s) : [];
                } else {
                    metadata[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        }

        return metadata;
    }

    printPrerequisiteChains() {
        console.log('\n📚 LEARNING PROGRESSION CHAINS:');
        console.log('================================');

        const chains = {
            'Foundation → Privacy (Age Verification)': [
                'pedersen_hash', 'date_arithmetic', 'identity_commitments',
                'age_proofs_basic', 'age_verification_system'
            ],
            'Foundation → Privacy (Voting)': [
                'pedersen_hash', 'identity_commitments', 'voter_commitments',
                'nullifier_system', 'vote_encryption', 'election_system'
            ],
            'Foundation → Privacy (Range Proofs)': [
                'pedersen_hash', 'identity_commitments', 'amount_commitments',
                'range_proofs_basic', 'private_transactions'
            ],
            'Foundation → Ethereum': [
                'keccak_hash', 'rlp_encoding', 'rlp_basics', 'trie_basics',
                'account_proofs', 'storage_proofs', 'trie_traversal'
            ],
            'Foundation → Merkle Trees': [
                'pedersen_hash', 'merkle_basic', 'merkle_proof', 'sparse_merkle_tree'
            ]
        };

        for (const [chainName, exercises] of Object.entries(chains)) {
            console.log(`\n${chainName}:`);
            console.log(`  ${exercises.join(' → ')}`);
        }
    }
}

// Run the updater
async function main() {
    const updater = new PrerequisiteUpdater();
    await updater.updateAllPrerequisites();
    updater.printPrerequisiteChains();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { PrerequisiteUpdater }; 