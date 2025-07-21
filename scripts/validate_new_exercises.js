const fs = require('fs');
const path = require('path');

// New exercises created from breaking down complex ones
const NEW_EXERCISES = {
    'privacy': [
        'date_arithmetic.md',
        'identity_commitments.md',
        'age_proofs_basic.md',
        'age_verification_system.md',
        'voter_commitments.md',
        'nullifier_system.md',
        'vote_encryption.md',
        'election_system.md',
        'amount_commitments.md',
        'range_proofs_basic.md',
        'private_transactions.md'
    ],
    'ethereum': [
        'trie_basics.md',
        'account_proofs.md',
        'storage_proofs.md',
        'trie_traversal.md',
        'rlp_basics.md',
        'rlp_advanced.md'
    ]
};

class ExerciseValidator {
    constructor() {
        this.results = {
            passed: [],
            failed: [],
            warnings: [],
            stats: {}
        };
    }

    async validateAllNewExercises() {
        console.log('🔍 Validating New Advanced Exercises...\n');

        let totalExercises = 0;
        let passedCount = 0;

        for (const [category, exercises] of Object.entries(NEW_EXERCISES)) {
            console.log(`📁 Validating ${category} exercises:`);

            for (const exercise of exercises) {
                totalExercises++;
                const result = await this.validateExercise(category, exercise);

                if (result.success) {
                    passedCount++;
                    this.results.passed.push(`${category}/${exercise}`);
                    console.log(`  ✅ ${exercise}`);
                } else {
                    this.results.failed.push({
                        exercise: `${category}/${exercise}`,
                        errors: result.errors
                    });
                    console.log(`  ❌ ${exercise}: ${result.errors.join(', ')}`);
                }

                if (result.warnings.length > 0) {
                    this.results.warnings.push({
                        exercise: `${category}/${exercise}`,
                        warnings: result.warnings
                    });
                    result.warnings.forEach(warning => {
                        console.log(`  ⚠️  ${exercise}: ${warning}`);
                    });
                }
            }
            console.log('');
        }

        this.results.stats = {
            total: totalExercises,
            passed: passedCount,
            failed: totalExercises - passedCount,
            successRate: Math.round((passedCount / totalExercises) * 100)
        };

        this.printSummary();
        return this.results;
    }

    async validateExercise(category, exerciseFile) {
        const exercisePath = path.join(__dirname, '../packages/playground/public/exercises/advanced', category, exerciseFile);
        const result = {
            success: true,
            errors: [],
            warnings: []
        };

        try {
            // Check if file exists
            if (!fs.existsSync(exercisePath)) {
                result.errors.push('File does not exist');
                result.success = false;
                return result;
            }

            const content = fs.readFileSync(exercisePath, 'utf8');

            // Validate YAML frontmatter
            const frontmatterResult = this.validateFrontmatter(content);
            if (!frontmatterResult.valid) {
                result.errors.push(...frontmatterResult.errors);
                result.success = false;
            }
            result.warnings.push(...frontmatterResult.warnings);

            // Validate Noir code syntax
            const codeResult = this.validateNoirCode(content);
            if (!codeResult.valid) {
                result.errors.push(...codeResult.errors);
                result.success = false;
            }
            result.warnings.push(...codeResult.warnings);

            // Validate exercise structure
            const structureResult = this.validateExerciseStructure(content);
            if (!structureResult.valid) {
                result.errors.push(...structureResult.errors);
                result.success = false;
            }
            result.warnings.push(...structureResult.warnings);

            // Validate prerequisite chains
            const prereqResult = this.validatePrerequisites(frontmatterResult.metadata);
            result.warnings.push(...prereqResult.warnings);

        } catch (error) {
            result.errors.push(`Exception: ${error.message}`);
            result.success = false;
        }

        return result;
    }

    validateFrontmatter(content) {
        const result = { valid: true, errors: [], warnings: [], metadata: {} };

        const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
        if (!frontmatterMatch) {
            result.errors.push('Missing YAML frontmatter');
            result.valid = false;
            return result;
        }

        const frontmatter = frontmatterMatch[1];
        const lines = frontmatter.split('\n');

        // Parse key metadata
        const metadata = {};
        for (const line of lines) {
            const match = line.match(/^(\w+):\s*(.+)$/);
            if (match) {
                const [, key, value] = match;
                if (key === 'prerequisites') {
                    // Parse prerequisites array
                    metadata[key] = value.includes('[') ?
                        value.replace(/[\[\]"]/g, '').split(',').map(s => s.trim()).filter(s => s) : [];
                } else {
                    metadata[key] = value.replace(/^["']|["']$/g, '');
                }
            }
        }

        result.metadata = metadata;

        // Check required fields
        const requiredFields = ['id', 'title', 'category', 'difficulty', 'mode', 'version'];
        for (const field of requiredFields) {
            if (!metadata[field]) {
                result.errors.push(`Missing required field: ${field}`);
                result.valid = false;
            }
        }

        // Validate difficulty levels
        const validDifficulties = ['easy', 'medium', 'hard'];
        if (metadata.difficulty && !validDifficulties.includes(metadata.difficulty)) {
            result.warnings.push(`Invalid difficulty: ${metadata.difficulty}`);
        }

        // Check for description and hint
        if (!frontmatter.includes('description:')) {
            result.warnings.push('Missing description');
        }
        if (!frontmatter.includes('hint:')) {
            result.warnings.push('Missing hint');
        }

        return result;
    }

    validateNoirCode(content) {
        const result = { valid: true, errors: [], warnings: [] };

        // Extract the main exercise Noir code block (after YAML frontmatter)
        // Split content to find the actual exercise code, not hint examples
        const yamlEnd = content.indexOf('---', 3); // Find the end of YAML frontmatter
        if (yamlEnd === -1) {
            result.errors.push('Cannot find end of YAML frontmatter');
            result.valid = false;
            return result;
        }

        const exerciseContent = content.substring(yamlEnd + 3);

        // Look for the main code block (should be the largest one with TODO placeholders)
        const codeBlocks = exerciseContent.match(/```noir\n([\s\S]*?)\n```/g);
        if (!codeBlocks || codeBlocks.length === 0) {
            result.errors.push('Missing Noir code block');
            result.valid = false;
            return result;
        }

        // Find the main exercise code block (usually the longest one with TODO items)
        let mainCode = '';
        let maxTodos = 0;

        for (const block of codeBlocks) {
            const codeContent = block.replace(/```noir\n/, '').replace(/\n```$/, '');
            const todoCount = (codeContent.match(/todo!\(\)/g) || []).length;

            if (todoCount > maxTodos || (todoCount > 0 && codeContent.length > mainCode.length)) {
                mainCode = codeContent;
                maxTodos = todoCount;
            }
        }

        // If no code block has TODOs, use the longest one
        if (!mainCode) {
            mainCode = codeBlocks.reduce((longest, current) => {
                const currentContent = current.replace(/```noir\n/, '').replace(/\n```$/, '');
                const longestContent = longest.replace(/```noir\n/, '').replace(/\n```$/, '');
                return currentContent.length > longestContent.length ? current : longest;
            }).replace(/```noir\n/, '').replace(/\n```$/, '');
        }

        const code = mainCode;

        // Basic syntax validation
        const syntaxChecks = [
            { pattern: /fn\s+\w+/, name: 'function definitions' },
            { pattern: /struct\s+\w+/, name: 'struct definitions', required: false },
            { pattern: /#\[test\]/, name: 'test functions' },
            { pattern: /todo!\(\)/, name: 'TODO placeholders' }
        ];

        for (const check of syntaxChecks) {
            if (check.required !== false && !check.pattern.test(code)) {
                result.warnings.push(`Missing ${check.name}`);
            }
        }

        // Check for main function
        if (!code.includes('fn main(')) {
            result.warnings.push('Missing main function');
        }

        // Check for balanced braces
        const openBraces = (code.match(/{/g) || []).length;
        const closeBraces = (code.match(/}/g) || []).length;
        if (openBraces !== closeBraces) {
            result.errors.push('Unbalanced braces in Noir code');
            result.valid = false;
        }

        // Check for proper use statement
        if (!code.includes('use std::')) {
            result.warnings.push('No standard library imports found');
        }

        // Count TODO items (should have multiple for students to complete)
        const todoCount = (code.match(/todo!\(\)/g) || []).length;
        if (todoCount < 3) {
            result.warnings.push('May have too few TODO items for students');
        }
        if (todoCount > 20) {
            result.warnings.push('May have too many TODO items');
        }

        // Count test functions
        const testCount = (code.match(/#\[test\]/g) || []).length;
        if (testCount < 3) {
            result.warnings.push('Should have more test functions');
        }

        return result;
    }

    validateExerciseStructure(content) {
        const result = { valid: true, errors: [], warnings: [] };

        // Check for learning objectives in description
        if (!content.includes('In this exercise, you will:')) {
            result.warnings.push('Missing clear learning objectives');
        }

        // Check for documentation link
        if (!content.includes('docLink:')) {
            result.warnings.push('Missing documentation link');
        }

        // Check hint quality
        const hintMatch = content.match(/hint:\s*>-\s*([\s\S]*?)description:/);
        if (hintMatch) {
            const hint = hintMatch[1];

            // Check if hint contains full solutions (bad)
            if (hint.includes('todo!()')) {
                result.errors.push('Hint contains TODO placeholders (should show examples)');
                result.valid = false;
            }

            // Check for code examples in hints
            if (!hint.includes('```noir')) {
                result.warnings.push('Hint should include code examples');
            }
        }

        return result;
    }

    validatePrerequisites(metadata) {
        const result = { warnings: [] };

        const prerequisites = metadata.prerequisites || [];
        const exerciseId = metadata.id;

        // Check for reasonable prerequisite chains
        const expectedPrereqs = {
            'identity_commitments': ['date_arithmetic'],
            'age_proofs_basic': ['identity_commitments'],
            'age_verification_system': ['age_proofs_basic'],
            'nullifier_system': ['voter_commitments'],
            'vote_encryption': ['nullifier_system'],
            'election_system': ['vote_encryption'],
            'range_proofs_basic': ['amount_commitments'],
            'private_transactions': ['range_proofs_basic'],
            'account_proofs': ['trie_basics'],
            'storage_proofs': ['account_proofs'],
            'trie_traversal': ['storage_proofs'],
            'rlp_advanced': ['rlp_basics']
        };

        if (expectedPrereqs[exerciseId]) {
            for (const expectedPrereq of expectedPrereqs[exerciseId]) {
                if (!prerequisites.includes(expectedPrereq)) {
                    result.warnings.push(`Missing expected prerequisite: ${expectedPrereq}`);
                }
            }
        }

        return result;
    }

    printSummary() {
        const { stats, failed, warnings } = this.results;

        console.log('📊 VALIDATION SUMMARY');
        console.log('====================');
        console.log(`Total exercises: ${stats.total}`);
        console.log(`✅ Passed: ${stats.passed}`);
        console.log(`❌ Failed: ${stats.failed}`);
        console.log(`📈 Success rate: ${stats.successRate}%\n`);

        if (failed.length > 0) {
            console.log('❌ FAILED EXERCISES:');
            failed.forEach(failure => {
                console.log(`  ${failure.exercise}:`);
                failure.errors.forEach(error => {
                    console.log(`    - ${error}`);
                });
            });
            console.log('');
        }

        if (warnings.length > 0) {
            console.log('⚠️  WARNINGS:');
            const warningCount = warnings.reduce((sum, w) => sum + w.warnings.length, 0);
            console.log(`  Total warnings: ${warningCount}`);

            // Group similar warnings
            const warningTypes = {};
            warnings.forEach(w => {
                w.warnings.forEach(warning => {
                    warningTypes[warning] = (warningTypes[warning] || 0) + 1;
                });
            });

            Object.entries(warningTypes).forEach(([warning, count]) => {
                console.log(`    ${warning}: ${count} exercises`);
            });
        }
    }
}

// Run validation
async function main() {
    const validator = new ExerciseValidator();
    const results = await validator.validateAllNewExercises();

    // Exit with appropriate code
    process.exit(results.stats.failed > 0 ? 1 : 0);
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ExerciseValidator }; 