const fs = require('fs');
const path = require('path');

class DifficultyCalibrator {
    constructor() {
        this.indexPath = path.join(__dirname, '../packages/playground/public/exercises/advanced/index.json');
        this.exercises = [];
        this.difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };
        this.difficultyNames = ['easy', 'medium', 'hard'];
        this.issues = [];
        this.recommendations = [];
    }

    async calibrateDifficulties() {
        console.log('⚖️  Calibrating Exercise Difficulties...\n');

        this.loadExercises();
        this.analyzeDifficultyDistribution();
        this.analyzePrerequisiteProgression();
        this.analyzeCategoryProgression();
        this.identifyDifficultyGaps();
        this.suggestRecalibration();

        this.printAnalysis();

        if (this.recommendations.length > 0) {
            await this.applyRecommendations();
        }
    }

    loadExercises() {
        const indexContent = fs.readFileSync(this.indexPath, 'utf8');
        this.exercises = JSON.parse(indexContent);
        console.log(`📚 Loaded ${this.exercises.length} exercises for difficulty analysis`);
    }

    analyzeDifficultyDistribution() {
        console.log('\n📊 DIFFICULTY DISTRIBUTION ANALYSIS:');

        // Count exercises by difficulty
        const distribution = { easy: 0, medium: 0, hard: 0 };
        const categoryDistribution = {};

        for (const exercise of this.exercises) {
            const difficulty = exercise.difficulty || 'medium';
            distribution[difficulty]++;

            if (!categoryDistribution[exercise.category]) {
                categoryDistribution[exercise.category] = { easy: 0, medium: 0, hard: 0 };
            }
            categoryDistribution[exercise.category][difficulty]++;
        }

        // Overall distribution
        console.log('📈 Overall Distribution:');
        for (const [diff, count] of Object.entries(distribution)) {
            const percentage = Math.round((count / this.exercises.length) * 100);
            console.log(`  ${diff}: ${count} exercises (${percentage}%)`);
        }

        // Check if distribution is reasonable
        this.validateDistribution(distribution);

        // Per-category distribution
        console.log('\n📂 Distribution by Category:');
        for (const [category, dist] of Object.entries(categoryDistribution)) {
            const total = dist.easy + dist.medium + dist.hard;
            console.log(`  ${category} (${total}): Easy: ${dist.easy}, Medium: ${dist.medium}, Hard: ${dist.hard}`);

            // Validate category distribution
            this.validateCategoryDistribution(category, dist, total);
        }
    }

    validateDistribution(distribution) {
        const total = this.exercises.length;
        const easyPercent = (distribution.easy / total) * 100;
        const mediumPercent = (distribution.medium / total) * 100;
        const hardPercent = (distribution.hard / total) * 100;

        // Ideal distribution: 40% easy, 40% medium, 20% hard for learning
        if (easyPercent < 25) {
            this.issues.push({
                type: 'too_few_easy',
                message: `Only ${Math.round(easyPercent)}% easy exercises. Consider adding more beginner-friendly exercises.`,
                severity: 'medium'
            });
        }

        if (hardPercent > 40) {
            this.issues.push({
                type: 'too_many_hard',
                message: `${Math.round(hardPercent)}% hard exercises. Consider reclassifying some as medium difficulty.`,
                severity: 'medium'
            });
        }

        if (easyPercent > 60) {
            this.issues.push({
                type: 'too_many_easy',
                message: `${Math.round(easyPercent)}% easy exercises. Consider increasing difficulty of some exercises.`,
                severity: 'low'
            });
        }
    }

    validateCategoryDistribution(category, distribution, total) {
        // Categories should have progression from easy to hard
        if (total >= 3) {
            if (distribution.easy === 0) {
                this.issues.push({
                    type: 'no_easy_in_category',
                    category: category,
                    message: `Category ${category} has no easy exercises. Consider adding an introductory exercise.`,
                    severity: 'medium'
                });
            }

            if (distribution.hard === 0 && total >= 5) {
                this.issues.push({
                    type: 'no_hard_in_category',
                    category: category,
                    message: `Category ${category} has no hard exercises. Consider adding an advanced challenge.`,
                    severity: 'low'
                });
            }
        }
    }

    analyzePrerequisiteProgression() {
        console.log('\n🔗 PREREQUISITE DIFFICULTY PROGRESSION:');

        const progressionIssues = [];

        for (const exercise of this.exercises) {
            const exerciseDifficulty = this.difficultyOrder[exercise.difficulty] || 1;
            const prerequisites = exercise.prerequisites || [];

            for (const prereqId of prerequisites) {
                const prereq = this.exercises.find(ex => ex.id === prereqId);
                if (prereq) {
                    const prereqDifficulty = this.difficultyOrder[prereq.difficulty] || 1;

                    // Prerequisite should not be harder than the exercise
                    if (prereqDifficulty > exerciseDifficulty) {
                        progressionIssues.push({
                            exercise: exercise.id,
                            exerciseDifficulty: exercise.difficulty,
                            prerequisite: prereqId,
                            prerequisiteDifficulty: prereq.difficulty,
                            gap: prereqDifficulty - exerciseDifficulty
                        });
                    }

                    // Large jumps in difficulty should be flagged
                    if (prereqDifficulty < exerciseDifficulty - 1) {
                        this.issues.push({
                            type: 'large_difficulty_jump',
                            exercise: exercise.id,
                            prerequisite: prereqId,
                            message: `Large difficulty jump from ${prereq.difficulty} to ${exercise.difficulty}`,
                            severity: 'low'
                        });
                    }
                }
            }
        }

        if (progressionIssues.length === 0) {
            console.log('  ✅ All prerequisites follow proper difficulty progression');
        } else {
            console.log(`  ⚠️  Found ${progressionIssues.length} progression issues:`);
            progressionIssues.forEach(issue => {
                console.log(`    ${issue.exercise} (${issue.exerciseDifficulty}) ← ${issue.prerequisite} (${issue.prerequisiteDifficulty})`);

                this.recommendations.push({
                    type: 'difficulty_adjustment',
                    exercise: issue.exercise,
                    currentDifficulty: issue.exerciseDifficulty,
                    suggestedDifficulty: this.difficultyNames[Math.max(this.difficultyOrder[issue.prerequisiteDifficulty], this.difficultyOrder[issue.exerciseDifficulty])],
                    reason: `Prerequisite ${issue.prerequisite} is ${issue.prerequisiteDifficulty}`
                });
            });
        }
    }

    analyzeCategoryProgression() {
        console.log('\n📚 CATEGORY DIFFICULTY PROGRESSION:');

        // Group exercises by category and analyze progression
        const categories = {};
        for (const exercise of this.exercises) {
            if (!categories[exercise.category]) {
                categories[exercise.category] = [];
            }
            categories[exercise.category].push(exercise);
        }

        for (const [category, exercises] of Object.entries(categories)) {
            if (exercises.length < 2) continue;

            // Check if category has logical progression
            const difficulties = exercises.map(ex => this.difficultyOrder[ex.difficulty] || 1);
            const hasEasy = difficulties.some(d => d === 0);
            const hasMedium = difficulties.some(d => d === 1);
            const hasHard = difficulties.some(d => d === 2);

            console.log(`  ${category}:`);

            if (exercises.length >= 3) {
                if (!hasEasy) {
                    console.log(`    ⚠️  Missing easy introduction exercise`);
                    this.suggestIntroExercise(category);
                }
                if (!hasMedium && hasEasy && hasHard) {
                    console.log(`    ⚠️  Missing medium bridge exercise`);
                    this.suggestBridgeExercise(category);
                }
            }

            // Analyze difficulty distribution within category
            const easyCount = difficulties.filter(d => d === 0).length;
            const mediumCount = difficulties.filter(d => d === 1).length;
            const hardCount = difficulties.filter(d => d === 2).length;

            console.log(`    Distribution: ${easyCount} easy, ${mediumCount} medium, ${hardCount} hard`);

            if (exercises.length >= 4 && easyCount === 0) {
                this.recommendations.push({
                    type: 'add_intro_exercise',
                    category: category,
                    reason: 'Category lacks beginner-friendly introduction'
                });
            }
        }
    }

    suggestIntroExercise(category) {
        // Suggest specific intro exercises for each category
        const suggestions = {
            'privacy': 'Consider adding a basic commitment scheme exercise',
            'ethereum': 'Consider adding a simple RLP encoding exercise',
            'merkle_trees': 'Consider adding a hash-only merkle root calculation',
            'embedded_curves': 'Consider adding a point validation exercise',
            'optimization': 'Consider adding a basic constraint optimization',
            'recursive_proofs': 'Consider adding a simple proof verification'
        };

        if (suggestions[category]) {
            console.log(`    💡 Suggestion: ${suggestions[category]}`);
        }
    }

    suggestBridgeExercise(category) {
        const suggestions = {
            'privacy': 'Consider adding a medium-difficulty nullifier exercise',
            'ethereum': 'Consider adding a medium-difficulty state proof exercise',
            'merkle_trees': 'Consider adding a merkle proof verification exercise'
        };

        if (suggestions[category]) {
            console.log(`    💡 Bridge suggestion: ${suggestions[category]}`);
        }
    }

    identifyDifficultyGaps() {
        console.log('\n🕳️  DIFFICULTY GAP ANALYSIS:');

        // Find learning paths with difficulty gaps
        const chains = this.buildLearningChains();

        for (const chain of chains) {
            const difficulties = chain.map(exerciseId => {
                const exercise = this.exercises.find(ex => ex.id === exerciseId);
                return exercise ? this.difficultyOrder[exercise.difficulty] || 1 : 1;
            });

            // Look for jumps of more than 1 difficulty level
            for (let i = 1; i < difficulties.length; i++) {
                const jump = difficulties[i] - difficulties[i - 1];
                if (jump > 1) {
                    this.issues.push({
                        type: 'difficulty_gap',
                        chain: chain.slice(i - 1, i + 1),
                        jump: jump,
                        message: `Difficulty jump of ${jump} levels in learning chain`,
                        severity: 'medium'
                    });
                }
            }
        }
    }

    buildLearningChains() {
        // Build simple linear chains for analysis
        const chains = [];
        const visited = new Set();

        // Find root exercises
        const roots = this.exercises.filter(ex =>
            !ex.prerequisites || ex.prerequisites.length === 0
        );

        for (const root of roots) {
            const chain = this.buildChainFromExercise(root.id, visited);
            if (chain.length > 1) {
                chains.push(chain);
            }
        }

        return chains;
    }

    buildChainFromExercise(exerciseId, visited) {
        if (visited.has(exerciseId)) return [];

        visited.add(exerciseId);
        const exercise = this.exercises.find(ex => ex.id === exerciseId);
        if (!exercise) return [];

        // Find exercises that depend on this one
        const dependents = this.exercises.filter(ex =>
            (ex.prerequisites || []).includes(exerciseId)
        );

        if (dependents.length === 0) {
            return [exerciseId]; // End of chain
        }

        // Build longest chain
        let longestChain = [exerciseId];
        for (const dependent of dependents) {
            const subChain = this.buildChainFromExercise(dependent.id, new Set(visited));
            if (subChain.length > longestChain.length - 1) {
                longestChain = [exerciseId, ...subChain];
            }
        }

        return longestChain;
    }

    suggestRecalibration() {
        console.log('\n🎯 DIFFICULTY RECALIBRATION SUGGESTIONS:');

        // Analyze current assignments and suggest improvements
        const categoryAnalysis = this.analyzeCategoryDifficulties();

        // Suggest specific recalibrations
        for (const [category, analysis] of Object.entries(categoryAnalysis)) {
            if (analysis.suggestions.length > 0) {
                console.log(`\n  📂 ${category}:`);
                analysis.suggestions.forEach(suggestion => {
                    console.log(`    ${suggestion}`);
                });
            }
        }

        // Add recommendations based on content analysis
        this.addContentBasedRecommendations();
    }

    analyzeCategoryDifficulties() {
        const categories = {};

        for (const exercise of this.exercises) {
            if (!categories[exercise.category]) {
                categories[exercise.category] = {
                    exercises: [],
                    suggestions: []
                };
            }
            categories[exercise.category].exercises.push(exercise);
        }

        // Analyze each category
        for (const [category, data] of Object.entries(categories)) {
            const exercises = data.exercises;

            // Check for specific patterns that indicate difficulty issues
            if (category === 'privacy') {
                this.analyzePrivacyDifficulties(exercises, data.suggestions);
            } else if (category === 'ethereum') {
                this.analyzeEthereumDifficulties(exercises, data.suggestions);
            } else if (category === 'merkle_trees') {
                this.analyzeMerkleTreeDifficulties(exercises, data.suggestions);
            }
        }

        return categories;
    }

    analyzePrivacyDifficulties(exercises, suggestions) {
        // Privacy exercises should progress: commitments → proofs → systems
        const basicConcepts = ['date_arithmetic', 'identity_commitments', 'amount_commitments', 'voter_commitments'];
        const intermediateConcepts = ['age_proofs_basic', 'range_proofs_basic', 'nullifier_system', 'vote_encryption'];
        const advancedConcepts = ['age_verification_system', 'private_transactions', 'election_system'];

        for (const exercise of exercises) {
            if (basicConcepts.includes(exercise.id) && exercise.difficulty !== 'easy') {
                suggestions.push(`${exercise.id}: Should be 'easy' (foundational concept)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'easy',
                    reason: 'Foundational privacy concept'
                });
            }

            if (intermediateConcepts.includes(exercise.id) && exercise.difficulty !== 'medium') {
                suggestions.push(`${exercise.id}: Should be 'medium' (intermediate concept)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'medium',
                    reason: 'Intermediate privacy concept'
                });
            }

            if (advancedConcepts.includes(exercise.id) && exercise.difficulty !== 'hard') {
                suggestions.push(`${exercise.id}: Should be 'hard' (advanced system)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'hard',
                    reason: 'Advanced privacy system'
                });
            }
        }
    }

    analyzeEthereumDifficulties(exercises, suggestions) {
        // Ethereum exercises should progress: encoding → structures → proofs
        const basicConcepts = ['rlp_encoding', 'rlp_basics'];
        const intermediateConcepts = ['rlp_advanced', 'trie_basics', 'account_proofs', 'storage_proofs'];
        const advancedConcepts = ['trie_traversal', 'state_proofs'];

        for (const exercise of exercises) {
            if (basicConcepts.includes(exercise.id) && exercise.difficulty !== 'easy') {
                suggestions.push(`${exercise.id}: Should be 'easy' (basic encoding)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'easy',
                    reason: 'Basic Ethereum encoding concept'
                });
            }

            if (intermediateConcepts.includes(exercise.id) && exercise.difficulty !== 'medium') {
                suggestions.push(`${exercise.id}: Should be 'medium' (data structure)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'medium',
                    reason: 'Ethereum data structure'
                });
            }

            if (advancedConcepts.includes(exercise.id) && exercise.difficulty !== 'hard') {
                suggestions.push(`${exercise.id}: Should be 'hard' (complex verification)`);
                this.recommendations.push({
                    type: 'recalibrate',
                    exercise: exercise.id,
                    from: exercise.difficulty,
                    to: 'hard',
                    reason: 'Complex Ethereum verification'
                });
            }
        }
    }

    analyzeMerkleTreeDifficulties(exercises, suggestions) {
        // Merkle trees should progress: basic → proofs → advanced variants
        for (const exercise of exercises) {
            if (exercise.id === 'merkle_basic' && exercise.difficulty !== 'easy') {
                suggestions.push(`${exercise.id}: Should be 'easy' (foundational concept)`);
            }
            if (exercise.id === 'merkle_proof' && exercise.difficulty !== 'medium') {
                suggestions.push(`${exercise.id}: Should be 'medium' (proof verification)`);
            }
            if (['sparse_merkle_tree', 'indexed_merkle_tree'].includes(exercise.id) && exercise.difficulty !== 'hard') {
                suggestions.push(`${exercise.id}: Should be 'hard' (advanced variant)`);
            }
        }
    }

    addContentBasedRecommendations() {
        // Add recommendations based on content complexity analysis
        console.log('\n💭 Content-Based Recommendations:');

        // Exercises with many TODO items might be too complex for their difficulty
        for (const exercise of this.exercises) {
            const filePath = path.join(path.dirname(this.indexPath), exercise.path);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                const todoCount = (content.match(/todo!\(\)/g) || []).length;
                const testCount = (content.match(/#\[test\]/g) || []).length;
                const lineCount = content.split('\n').length;

                // Complexity heuristics
                let suggestedDifficulty = exercise.difficulty;
                let complexity = 0;

                if (todoCount > 15) complexity++;
                if (testCount > 8) complexity++;
                if (lineCount > 500) complexity++;

                if (complexity >= 2 && exercise.difficulty === 'easy') {
                    suggestedDifficulty = 'medium';
                    console.log(`  📈 ${exercise.id}: Consider upgrading to 'medium' (high complexity)`);
                } else if (complexity >= 3 && exercise.difficulty === 'medium') {
                    suggestedDifficulty = 'hard';
                    console.log(`  📈 ${exercise.id}: Consider upgrading to 'hard' (very high complexity)`);
                }

                if (suggestedDifficulty !== exercise.difficulty) {
                    this.recommendations.push({
                        type: 'complexity_recalibrate',
                        exercise: exercise.id,
                        from: exercise.difficulty,
                        to: suggestedDifficulty,
                        reason: `High content complexity: ${todoCount} TODOs, ${testCount} tests, ${lineCount} lines`
                    });
                }
            }
        }
    }

    async applyRecommendations() {
        console.log('\n🔧 APPLYING DIFFICULTY RECALIBRATIONS:');

        let appliedCount = 0;

        for (const rec of this.recommendations) {
            if (rec.type === 'recalibrate' || rec.type === 'complexity_recalibrate') {
                const exercise = this.exercises.find(ex => ex.id === rec.exercise);
                if (exercise && exercise.difficulty !== rec.to) {
                    console.log(`  📝 ${rec.exercise}: ${rec.from} → ${rec.to} (${rec.reason})`);
                    exercise.difficulty = rec.to;
                    appliedCount++;
                }
            }
        }

        if (appliedCount > 0) {
            // Write updated index
            const updatedIndex = JSON.stringify(this.exercises, null, 2);
            fs.writeFileSync(this.indexPath, updatedIndex);
            console.log(`\n✅ Applied ${appliedCount} difficulty recalibrations!`);
        } else {
            console.log('  ✨ No recalibrations needed - difficulties are well-calibrated!');
        }
    }

    printAnalysis() {
        console.log('\n📋 DIFFICULTY CALIBRATION SUMMARY:');
        console.log('===================================');

        const totalIssues = this.issues.length;
        const totalRecommendations = this.recommendations.length;

        console.log(`⚠️  Issues Identified: ${totalIssues}`);
        if (totalIssues > 0) {
            const bySeverity = {
                critical: this.issues.filter(i => i.severity === 'critical').length,
                high: this.issues.filter(i => i.severity === 'high').length,
                medium: this.issues.filter(i => i.severity === 'medium').length,
                low: this.issues.filter(i => i.severity === 'low').length
            };

            Object.entries(bySeverity).forEach(([severity, count]) => {
                if (count > 0) console.log(`  ${severity}: ${count}`);
            });
        }

        console.log(`💡 Recommendations: ${totalRecommendations}`);

        // Final assessment
        console.log('\n🎯 CALIBRATION ASSESSMENT:');
        if (totalIssues === 0 && totalRecommendations === 0) {
            console.log('  ✅ Difficulty calibration is excellent!');
            console.log('  ✅ All exercises have appropriate difficulty levels');
            console.log('  ✅ Smooth learning progressions established');
        } else if (this.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0) {
            console.log('  ✅ Difficulty calibration is good with minor improvements');
            console.log('  📝 Applied recommended adjustments');
        } else {
            console.log('  ⚠️  Some difficulty calibration issues need attention');
        }
    }
}

// Run the calibrator
async function main() {
    const calibrator = new DifficultyCalibrator();
    await calibrator.calibrateDifficulties();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DifficultyCalibrator }; 