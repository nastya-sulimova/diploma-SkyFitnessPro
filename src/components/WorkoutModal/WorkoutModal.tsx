"use client";

import { useState } from "react";
import styles from "./workoutModal.module.css";

interface WorkoutModalProps {
  isOpen: boolean;
  workouts: Array<{ id: string; name: string; completed: boolean }>;
  onClose: () => void;
  onStart: (workoutId: string) => void;
}

export default function WorkoutModal({
  isOpen,
  workouts,
  onClose,
  onStart,
}: WorkoutModalProps) {
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  if (!isOpen) return null;

  const handleToggleWorkout = (workoutId: string) => {
    setSelectedWorkouts((prev) =>
      prev.includes(workoutId)
        ? prev.filter((id) => id !== workoutId)
        : [...prev, workoutId]
    );
  };

  const handleStart = () => {
    if (selectedWorkouts.length > 0) {
      onStart(selectedWorkouts[0]);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Выберите тренировку</h3>

        <div className={styles.workoutsList}>
          {workouts.map((workout) => (
            <label
              key={workout.id}
              className={`${styles.workoutItem} ${
                workout.completed ? styles.completed : ""
              }`}
            >
              <div
                className={styles.customCheckbox}
                onClick={() => handleToggleWorkout(workout.id)}
              >
                {selectedWorkouts.includes(workout.id) ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM11.9134 16.1459L17.4134 9.64594L15.8866 8.35406L11.1373 13.9669L8.40258 10.8415L6.89742 12.1585L10.3974 16.1585C10.5892 16.3777 10.867 16.5024 11.1583 16.5C11.4495 16.4976 11.7253 16.3683 11.9134 16.1459Z"
                      fill="#BCEC30"
                    />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="9.5" stroke="black" />
                  </svg>
                )}
              </div>
              <span
                className={`${styles.workoutName} ${
                  workout.completed ? styles.completedText : ""
                }`}
              >
                {workout.name}
                {workout.completed && (
                  <span className={styles.completedBadge}>✓</span>
                )}
              </span>
            </label>
          ))}
        </div>

        <button className={styles.startButton} onClick={handleStart}>
          Начать
        </button>
      </div>
    </div>
  );
}
