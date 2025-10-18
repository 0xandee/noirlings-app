import React, { useState, useEffect } from "react";
import { getAdvancedExercises } from "../../utils/exerciseLoader";
import { formatExerciseName } from "../../utils/formatExerciseName";
import { useTheme } from "../../hooks/useTheme";
import { ChevronDown } from "lucide-react";

// Update interface OrderedExercise
interface OrderedExercise {
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
            description?: string;
            docLink?: string;
        }
    };
    path?: string;
}

interface AdvancedExercisesSidebarProps {
    selectExercise: (exercisePath: string) => void;
    currentExercise: string | null;
    finishedExercises: string[];
}

const AdvancedExercisesSidebar: React.FC<AdvancedExercisesSidebarProps> = ({
    selectExercise,
    currentExercise,
    finishedExercises,
}) => {
    const { theme } = useTheme();
    const [exercises, setExercises] = useState<OrderedExercise[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Fetch the advanced exercises from the API
        const fetchAdvanced = async () => {
            try {
                setIsLoading(true);
                const advancedExercises: OrderedExercise[] = await getAdvancedExercises();
                setExercises(advancedExercises);

                // Initialize all categories as collapsed
                const categories = new Set(advancedExercises.map(ex => ex.category));
                setCollapsedCategories(categories);

                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load advanced exercises:", error);
                setError("Failed to load advanced exercises. Please try again later.");
                setIsLoading(false);
            }
        };
        fetchAdvanced();
    }, []);

    const toggleCategory = (category: string) => {
        setCollapsedCategories(prev => {
            const newSet = new Set(prev);
            if (newSet.has(category)) {
                newSet.delete(category);
            } else {
                newSet.add(category);
            }
            return newSet;
        });
    };

    const getCategoryDisplayName = (category: string): string => {
        const categoryNames: { [key: string]: string } = {
            'hashes': 'Hashes',
            'embedded_curves': 'Curves',
            'merkle_trees': 'Merkle Trees',
            'signatures': 'Signatures',
            'privacy': 'Privacy',
            'ethereum': 'Ethereum',
            'optimization': 'Optimization',
            'recursive_proofs': 'Recursive'
        };
        return categoryNames[category] || category;
    };

    const groupExercisesByCategory = (exercises: OrderedExercise[]) => {
        const grouped: { [key: string]: OrderedExercise[] } = {};
        exercises.forEach(exercise => {
            if (!grouped[exercise.category]) {
                grouped[exercise.category] = [];
            }
            grouped[exercise.category].push(exercise);
        });
        return grouped;
    };

    if (isLoading) {
        return <div className="p-4" style={{ color: 'var(--color-primary)' }}>Loading advanced exercises...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    const groupedExercises = groupExercisesByCategory(exercises);

    return (
        <div className="w-auto h-auto overflow-y-auto" style={{ color: 'var(--color-primary)' }}>
            {exercises.length === 0 ? (
                <div className="p-4" style={{ color: 'var(--sidebar-text-color, var(--color-secondary))' }}>No advanced exercises available</div>
            ) : (
                <div className="space-y-0">
                    {Object.entries(groupedExercises).map(([category, categoryExercises]) => {
                        const isCollapsed = collapsedCategories.has(category);
                        const categoryDisplayName = getCategoryDisplayName(category);

                        return (
                            <div key={category} className="border-b border-gray-200 dark:border-gray-700">
                                {/* Category Header */}
                                <div
                                    className={`cursor-pointer select-none p-4 pl-6 transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff08]' : 'hover:bg-[#00000008]'}`}
                                    onClick={() => toggleCategory(category)}
                                    style={{
                                        backgroundColor: theme === 'dark' ? '#ffffff05' : '#00000005',
                                        color: 'var(--sidebar-text-color, var(--color-secondary))',
                                        fontWeight: 'normal',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex' }}>
                                            <span>{categoryDisplayName}</span>
                                            {/* <span style={{ fontSize: '12px', opacity: 0.7 }}>
                                                ({categoryExercises.length})
                                            </span> */}
                                        </div>
                                        <span style={{
                                            transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                            fontSize: '14px'
                                        }}>
                                            <ChevronDown size={16} color="var(--sidebar-text-color, var(--color-secondary))" />
                                        </span>
                                    </div>
                                </div>

                                {/* Category Exercises */}
                                {!isCollapsed && (
                                    <div className="space-y-0">
                                        {categoryExercises.map((exercise) => {
                                            const exerciseKey = `${exercise.category}/${exercise.id}`;
                                            const isFinished = finishedExercises.includes(exerciseKey);
                                            return (
                                                <div
                                                    key={exercise.id}
                                                    className={`cursor-pointer select-none p-4 pl-6 transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff10]' : 'hover:bg-[#00000010]'}`}
                                                    style={{
                                                        backgroundColor: currentExercise === exerciseKey
                                                            ? (theme === 'dark' ? '#ffffff10' : '#00000010')
                                                            : 'transparent',
                                                        color: isFinished ? 'var(--finished-text)' : (currentExercise === exerciseKey ? 'var(--color-primary)' : 'var(--sidebar-text-color, var(--color-secondary))'),
                                                        fontWeight: 'normal'
                                                    }}
                                                    onClick={() => selectExercise(exerciseKey)}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <span>{formatExerciseName(exercise.title)}</span>
                                                        {isFinished && <span title="Completed" style={{ color: 'var(--finished-text)' }}></span>}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdvancedExercisesSidebar; 