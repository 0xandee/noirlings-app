const fs = require('fs');
const path = require('path');

class DependencyAnalyzer {
    constructor() {
        this.indexPath = path.join(__dirname, '../packages/playground/public/exercises/advanced/index.json');
        this.exercises = [];
        this.dependencyGraph = new Map();
        this.issues = [];
        this.chains = new Map();
    }

    async analyzeDependencies() {
        console.log('🔍 Analyzing Exercise Dependencies & Learning Paths...\n');

        // Load exercises
        this.loadExercises();

        // Build dependency graph
        this.buildDependencyGraph();

        // Analyze learning paths
        this.analyzeLearningPaths();

        // Check for issues
        this.validateDependencies();

        // Identify orphaned exercises
        this.findOrphanedExercises();

        // Suggest improvements
        this.suggestImprovements();

        this.printAnalysis();
    }

    loadExercises() {
        if (!fs.existsSync(this.indexPath)) {
            console.error('❌ Index file not found!');
            return;
        }

        const indexContent = fs.readFileSync(this.indexPath, 'utf8');
        this.exercises = JSON.parse(indexContent);
        console.log(`📚 Loaded ${this.exercises.length} exercises`);
    }

    buildDependencyGraph() {
        // Create nodes for all exercises
        for (const exercise of this.exercises) {
            this.dependencyGraph.set(exercise.id, {
                ...exercise,
                dependents: [], // Exercises that depend on this one
                dependencies: exercise.prerequisites || []
            });
        }

        // Build dependent relationships
        for (const exercise of this.exercises) {
            const prereqs = exercise.prerequisites || [];
            for (const prereq of prereqs) {
                const prereqNode = this.dependencyGraph.get(prereq);
                if (prereqNode) {
                    prereqNode.dependents.push(exercise.id);
                } else {
                    this.issues.push({
                        type: 'missing_prerequisite',
                        exercise: exercise.id,
                        missing: prereq,
                        severity: 'high'
                    });
                }
            }
        }
    }

    analyzeLearningPaths() {
        // Group exercises by category
        const categories = new Map();
        for (const exercise of this.exercises) {
            if (!categories.has(exercise.category)) {
                categories.set(exercise.category, []);
            }
            categories.get(exercise.category).push(exercise);
        }

        console.log('\n📊 EXERCISES BY CATEGORY:');
        for (const [category, exercises] of categories) {
            console.log(`  ${category}: ${exercises.length} exercises`);
        }

        // Build learning chains
        this.buildLearningChains();
    }

    buildLearningChains() {
        const visited = new Set();
        const chains = [];

        // Find root exercises (no prerequisites)
        const roots = this.exercises.filter(ex =>
            !ex.prerequisites || ex.prerequisites.length === 0
        );

        console.log(`\n🌱 FOUNDATION EXERCISES (${roots.length}):`);
        roots.forEach(root => {
            console.log(`  ${root.id} (${root.category})`);
        });

        // Build chains from each root
        for (const root of roots) {
            this.buildChainFromRoot(root.id, [], chains, visited);
        }

        this.chains = chains;
    }

    buildChainFromRoot(exerciseId, currentChain, allChains, visited) {
        if (visited.has(exerciseId)) {
            return; // Avoid cycles
        }

        const exercise = this.dependencyGraph.get(exerciseId);
        if (!exercise) return;

        const newChain = [...currentChain, exerciseId];
        visited.add(exerciseId);

        if (exercise.dependents.length === 0) {
            // End of chain - leaf exercise
            allChains.push({
                chain: newChain,
                category: exercise.category,
                difficulty: exercise.difficulty,
                length: newChain.length
            });
        } else {
            // Continue building chains
            for (const dependent of exercise.dependents) {
                this.buildChainFromRoot(dependent, newChain, allChains, new Set(visited));
            }
        }
    }

    validateDependencies() {
        console.log('\n🔧 DEPENDENCY VALIDATION:');

        // Check for circular dependencies
        this.checkCircularDependencies();

        // Check for missing cross-category dependencies
        this.checkCrossCategoryDependencies();

        // Check difficulty progression
        this.checkDifficultyProgression();

        // Check for overly long chains
        this.checkChainLengths();
    }

    checkCircularDependencies() {
        const visiting = new Set();
        const visited = new Set();

        const hasCircle = (exerciseId) => {
            if (visiting.has(exerciseId)) {
                this.issues.push({
                    type: 'circular_dependency',
                    exercise: exerciseId,
                    severity: 'critical'
                });
                return true;
            }

            if (visited.has(exerciseId)) return false;

            visiting.add(exerciseId);
            const exercise = this.dependencyGraph.get(exerciseId);

            if (exercise) {
                for (const dep of exercise.dependencies) {
                    if (hasCircle(dep)) return true;
                }
            }

            visiting.delete(exerciseId);
            visited.add(exerciseId);
            return false;
        };

        for (const exercise of this.exercises) {
            hasCircle(exercise.id);
        }
    }

    checkCrossCategoryDependencies() {
        const missingCrossDeps = [];

        // Privacy exercises should have hash foundations
        const privacyExercises = this.exercises.filter(ex => ex.category === 'privacy');
        for (const exercise of privacyExercises) {
            const hasHashPrereq = this.hasTransitiveDependency(exercise.id, ['pedersen_hash', 'keccak_hash']);
            if (!hasHashPrereq && exercise.id !== 'date_arithmetic') {
                missingCrossDeps.push({
                    exercise: exercise.id,
                    missing: 'hash foundation',
                    suggestion: 'Should depend on pedersen_hash or keccak_hash'
                });
            }
        }

        // Ethereum exercises should have keccak foundation
        const ethereumExercises = this.exercises.filter(ex => ex.category === 'ethereum');
        for (const exercise of ethereumExercises) {
            const hasKeccakPrereq = this.hasTransitiveDependency(exercise.id, ['keccak_hash']);
            if (!hasKeccakPrereq && exercise.id !== 'rlp_encoding') {
                missingCrossDeps.push({
                    exercise: exercise.id,
                    missing: 'keccak foundation',
                    suggestion: 'Should depend on keccak_hash'
                });
            }
        }

        if (missingCrossDeps.length > 0) {
            this.issues.push({
                type: 'missing_cross_category_deps',
                items: missingCrossDeps,
                severity: 'medium'
            });
        }
    }

    hasTransitiveDependency(exerciseId, targetDeps) {
        const visited = new Set();

        const search = (id) => {
            if (visited.has(id)) return false;
            visited.add(id);

            if (targetDeps.includes(id)) return true;

            const exercise = this.dependencyGraph.get(id);
            if (!exercise) return false;

            for (const dep of exercise.dependencies) {
                if (search(dep)) return true;
            }

            return false;
        };

        return search(exerciseId);
    }

    checkDifficultyProgression() {
        const difficultyOrder = { 'easy': 0, 'medium': 1, 'hard': 2 };

        for (const exercise of this.exercises) {
            const exerciseLevel = difficultyOrder[exercise.difficulty] || 1;

            for (const prereqId of exercise.prerequisites || []) {
                const prereq = this.dependencyGraph.get(prereqId);
                if (prereq) {
                    const prereqLevel = difficultyOrder[prereq.difficulty] || 1;

                    if (prereqLevel > exerciseLevel) {
                        this.issues.push({
                            type: 'difficulty_regression',
                            exercise: exercise.id,
                            exerciseDifficulty: exercise.difficulty,
                            prerequisite: prereqId,
                            prerequisiteDifficulty: prereq.difficulty,
                            severity: 'medium'
                        });
                    }
                }
            }
        }
    }

    checkChainLengths() {
        const longChains = this.chains.filter(chain => chain.length > 6);

        if (longChains.length > 0) {
            this.issues.push({
                type: 'overly_long_chains',
                chains: longChains.map(c => ({
                    chain: c.chain,
                    length: c.length
                })),
                severity: 'low'
            });
        }
    }

    findOrphanedExercises() {
        console.log('\n🏝️  ORPHANED EXERCISES:');

        const orphans = this.exercises.filter(exercise => {
            const node = this.dependencyGraph.get(exercise.id);
            return node && node.dependents.length === 0 &&
                (exercise.prerequisites || []).length > 0;
        });

        if (orphans.length === 0) {
            console.log('  ✅ No orphaned exercises found');
        } else {
            orphans.forEach(orphan => {
                console.log(`  ⚠️  ${orphan.id}: Has prerequisites but nothing depends on it`);
            });
        }
    }

    suggestImprovements() {
        console.log('\n💡 SUGGESTED IMPROVEMENTS:');

        // Suggest bridging exercises
        const gaps = this.findLearningGaps();
        if (gaps.length > 0) {
            console.log('  📚 Learning Gaps to Address:');
            gaps.forEach(gap => {
                console.log(`    ${gap.from} → ${gap.to}: Consider adding ${gap.suggestion}`);
            });
        }

        // Suggest alternative learning paths
        this.suggestAlternativePaths();
    }

    findLearningGaps() {
        const gaps = [];

        // Look for big jumps in difficulty without intermediate steps
        for (const exercise of this.exercises) {
            if (exercise.difficulty === 'hard') {
                const prereqs = exercise.prerequisites || [];
                const easyPrereqs = prereqs.filter(prereqId => {
                    const prereq = this.dependencyGraph.get(prereqId);
                    return prereq && prereq.difficulty === 'easy';
                });

                if (easyPrereqs.length > 0) {
                    gaps.push({
                        from: easyPrereqs.join(', '),
                        to: exercise.id,
                        suggestion: 'medium difficulty bridging exercise'
                    });
                }
            }
        }

        return gaps;
    }

    suggestAlternativePaths() {
        console.log('  🛤️  Alternative Learning Paths:');

        // Find exercises that could have multiple paths to reach them
        const alternatives = [];

        for (const exercise of this.exercises) {
            if ((exercise.prerequisites || []).length > 1) {
                alternatives.push({
                    exercise: exercise.id,
                    paths: exercise.prerequisites
                });
            }
        }

        if (alternatives.length === 0) {
            console.log('    ✨ Most exercises have single clear paths');
        } else {
            alternatives.slice(0, 3).forEach(alt => {
                console.log(`    ${alt.exercise}: Multiple entry points via ${alt.paths.join(' OR ')}`);
            });
        }
    }

    printAnalysis() {
        console.log('\n📋 DEPENDENCY ANALYSIS SUMMARY:');
        console.log('================================');

        // Overall stats
        const totalExercises = this.exercises.length;
        const rootExercises = this.exercises.filter(ex =>
            !ex.prerequisites || ex.prerequisites.length === 0).length;
        const leafExercises = this.exercises.filter(ex => {
            const node = this.dependencyGraph.get(ex.id);
            return node && node.dependents.length === 0;
        }).length;

        console.log(`📊 Exercise Statistics:`);
        console.log(`  Total Exercises: ${totalExercises}`);
        console.log(`  Foundation Exercises: ${rootExercises}`);
        console.log(`  Terminal Exercises: ${leafExercises}`);
        console.log(`  Learning Chains: ${this.chains.length}`);

        // Chain statistics
        if (this.chains.length > 0) {
            const avgChainLength = this.chains.reduce((sum, chain) => sum + chain.length, 0) / this.chains.length;
            const maxChainLength = Math.max(...this.chains.map(c => c.length));

            console.log(`\n🔗 Chain Statistics:`);
            console.log(`  Average Chain Length: ${avgChainLength.toFixed(1)}`);
            console.log(`  Longest Chain: ${maxChainLength} exercises`);

            // Show top 3 longest chains
            const longestChains = this.chains
                .sort((a, b) => b.length - a.length)
                .slice(0, 3);

            console.log(`\n🏆 Longest Learning Paths:`);
            longestChains.forEach((chain, index) => {
                console.log(`  ${index + 1}. ${chain.chain.join(' → ')} (${chain.length} exercises)`);
            });
        }

        // Issues summary
        console.log(`\n⚠️  Issues Found: ${this.issues.length}`);
        if (this.issues.length > 0) {
            const bySevertiy = {
                critical: this.issues.filter(i => i.severity === 'critical').length,
                high: this.issues.filter(i => i.severity === 'high').length,
                medium: this.issues.filter(i => i.severity === 'medium').length,
                low: this.issues.filter(i => i.severity === 'low').length
            };

            Object.entries(bySevertiy).forEach(([severity, count]) => {
                if (count > 0) {
                    console.log(`  ${severity}: ${count}`);
                }
            });
        } else {
            console.log('  ✅ No critical issues found!');
        }

        // Overall assessment
        console.log(`\n🎯 OVERALL ASSESSMENT:`);
        if (this.issues.filter(i => i.severity === 'critical' || i.severity === 'high').length === 0) {
            console.log('  ✅ Dependency structure looks excellent!');
            console.log('  ✅ Clear learning progressions established');
            console.log('  ✅ No critical issues detected');
        } else {
            console.log('  ⚠️  Some issues need attention');
            console.log('  📝 Check the detailed issues above');
        }
    }
}

// Run the analyzer
async function main() {
    const analyzer = new DependencyAnalyzer();
    await analyzer.analyzeDependencies();
}

if (require.main === module) {
    main().catch(console.error);
}

module.exports = { DependencyAnalyzer }; 