import React, { useState, useEffect } from "react";
import { getOrderedExercises } from "../../utils/exerciseLoader";
import { formatExerciseName } from "../../utils/formatExerciseName";
import { useTheme } from "../../hooks/useTheme";

// New type for ordered exercises
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

type ExercisesSidebarProps = {
    selectExercise: (exercisePath: string) => void;
    currentExercise: string | null;
    finishedExercises: string[];
};

const ExercisesSidebar: React.FC<ExercisesSidebarProps> = ({
    selectExercise,
    currentExercise,
    finishedExercises,
}) => {
    const { theme } = useTheme();
    const [exercises, setExercises] = useState<OrderedExercise[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the ordered exercises from the API
        const fetchOrdered = async () => {
            try {
                setIsLoading(true);
                const orderedExercises: OrderedExercise[] = await getOrderedExercises();
                setExercises(orderedExercises);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to load ordered exercises:", error);
                setError("Failed to load exercises. Please try again later.");
                setIsLoading(false);
            }
        };
        fetchOrdered();
    }, []);

    if (isLoading) {
        return <div className="p-4" style={{ color: 'var(--color-primary)' }}>Loading exercises...</div>;
    }

    if (error) {
        return <div className="p-4 text-red-500">{error}</div>;
    }

    return (
        <div className="w-auto h-auto overflow-y-auto" style={{ color: 'var(--color-primary)' }}>
            {exercises.length === 0 ? (
                <div style={{ color: 'var(--color-secondary)' }}>No exercises available</div>
            ) : (
                <div className="space-y-0">
                    {exercises.map((exercise) => {
                        const exerciseKey = `${exercise.category}/${exercise.id}`;
                        const isFinished = finishedExercises.includes(`${exercise.category}/${exercise.id}`);
                        return (
                            <div
                                key={exercise.id}
                                className={`cursor-pointer select-none p-4 pl-6 transition-colors ${theme === 'dark' ? 'hover:bg-[#ffffff10]' : 'hover:bg-[#00000010]'}`}
                                style={{
                                    backgroundColor: currentExercise === exerciseKey
                                        ? (theme === 'dark' ? '#ffffff10' : '#00000010')
                                        : 'transparent',
                                    color: isFinished ? 'var(--finished-text)' : (currentExercise === exerciseKey ? 'var(--color-primary)' : 'var(--color-secondary)'),
                                    fontWeight: 'normal'
                                }}
                                onClick={() => selectExercise(`${exercise.category}/${exercise.id}`)}
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
};

export type { OrderedExercise };
export default ExercisesSidebar; 