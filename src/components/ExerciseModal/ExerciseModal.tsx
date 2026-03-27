"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./exerciseModal.module.css";

interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

interface ExerciseModalProps {
  isOpen: boolean;
  exercises: Exercise[];
  progress: number[];
  onClose: () => void;
  onSave: (newProgress: number[]) => void;
}

export default function ExerciseModal({
  isOpen,
  exercises,
  progress,
  onClose,
  onSave,
}: ExerciseModalProps) {
  const [localProgress, setLocalProgress] = useState<number[]>([...progress]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setLocalProgress([...progress]);
    }
  }, [isOpen, progress]);

  if (!isOpen) return null;

  const handleQuantityChange = (index: number, value: string) => {
    const numValue = value === "" ? 0 : parseInt(value, 10);
    if (isNaN(numValue)) return;

    const newProgress = [...localProgress];
    newProgress[index] = Math.min(numValue, exercises[index].quantity);
    setLocalProgress(newProgress);
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    if (inputRefs.current[index]) {
      inputRefs.current[index]?.select();
    }
  };

  const handleBlur = (index: number, value: string) => {
    setFocusedIndex(null);
    if (value === "") {
      const newProgress = [...localProgress];
      newProgress[index] = 0;
      setLocalProgress(newProgress);
    }
  };

  const handleSave = () => {
    onSave(localProgress);
    onClose();
  };

  const hasChanges = JSON.stringify(progress) !== JSON.stringify(localProgress);

  const getDisplayValue = (index: number) => {
    const value = localProgress[index];
    if (focusedIndex === index && value === 0) {
      return "";
    }
    return value;
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>Мой прогресс</h3>

        <div className={styles.exercisesList}>
          {exercises.map((exercise, index) => (
            <div key={exercise._id} className={styles.exerciseItem}>
              <label className={styles.exerciseLabel}>
                Сколько раз вы сделали {exercise.name.toLowerCase()}?
              </label>
              <input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="number"
                min="0"
                max={exercise.quantity}
                value={getDisplayValue(index)}
                onChange={(e) => handleQuantityChange(index, e.target.value)}
                onFocus={() => handleFocus(index)}
                onBlur={(e) => handleBlur(index, e.target.value)}
                placeholder="0"
                className={styles.input}
              />
            </div>
          ))}
        </div>

        <button
          className={styles.saveButton}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
