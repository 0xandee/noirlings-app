import React, { useState, useEffect } from "react";
import { getOrderedExercises } from "../../utils/exerciseLoader";
import { formatExerciseName } from "../../utils/formatExerciseName";
import { useTheme } from "../../hooks/useTheme";

// New type for ordered exercises
interface OrderedExercise {
    name: string;
    path: string;
    mode: string;
    hint: string;
    description?: string;
    category: string;
    file: string;
}

type ExercisesSidebarProps = {
    selectExercise: (exercisePath: string, exerciseName: string, exerciseHint?: string, exerciseDescription?: string) => void;
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
        <div className="w-auto h-auto p-4 overflow-y-auto" style={{ color: 'var(--color-primary)' }}>
            {/* <h2 className="text-xl font-bold mt-0 mb-4 text-yellow-800">Exercises</h2> */}
            {exercises.length === 0 ? (
                <div style={{ color: 'var(--color-secondary)' }}>No exercises available</div>
            ) : (
                <div className="space-y-1">
                    {exercises.map((exercise) => {
                        const exerciseKey = `${exercise.category}/${exercise.file}`;
                        const isFinished = finishedExercises.includes(exerciseKey);
                        return (
                            <div
                                key={exercise.path}
                                className={`cursor-pointer select-none p-1 rounded transition-colors duration-150`}
                                style={{
                                    backgroundColor: currentExercise === exerciseKey
                                        ? 'var(--color-accent)'
                                        : 'transparent',
                                    color: currentExercise === exerciseKey
                                        ? theme === 'dark' ? '#000' : '#fff'
                                        : isFinished
                                            ? '#4CAF50' // Green color for finished exercises
                                            : 'var(--color-primary)',
                                    fontWeight: currentExercise === exerciseKey ? 'bold' : 'normal'
                                }}
                                onClick={() =>
                                    selectExercise(exerciseKey, exercise.name, exercise.hint, exercise.description)
                                }
                            >
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span>{formatExerciseName(exercise.name)}</span>
                                    {isFinished && <span title="Finished">✅</span>}
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