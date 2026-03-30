"use client";

import { useState, useEffect, useRef } from "react";
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
  const [localProgress, setLocalProgress] = useState<number[]>([]);
  const [inputValues, setInputValues] = useState<string[]>([]);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen && exercises.length > 0) {
      const initialProgress =
        progress && Array.isArray(progress)
          ? progress.map((v) => (typeof v === "number" ? v : 0))
          : new Array(exercises.length).fill(0);
      setLocalProgress(initialProgress);
      setInputValues(initialProgress.map((v) => (v === 0 ? "" : v.toString())));
    }
  }, [isOpen, exercises.length, progress]);

  if (!isOpen) return null;

  const handleQuantityChange = (index: number, value: string) => {
    setInputValues((prev) => {
      const newValues = [...(prev || [])];
      while (newValues.length <= index) {
        newValues.push("");
      }
      newValues[index] = value;
      return newValues;
    });

    if (value === "") {
      setLocalProgress((prev) => {
        const newProgress = [...(prev || [])];
        while (newProgress.length <= index) {
          newProgress.push(0);
        }
        newProgress[index] = 0;
        return newProgress;
      });
      return;
    }

    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    setLocalProgress((prev) => {
      const newProgress = [...(prev || [])];
      while (newProgress.length <= index) {
        newProgress.push(0);
      }
      newProgress[index] = Math.min(numValue, exercises[index]?.quantity || 0);
      return newProgress;
    });
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
    const currentProgress = localProgress[index] ?? 0;
    if (currentProgress === 0) {
      setInputValues((prev) => {
        const newValues = [...(prev || [])];
        while (newValues.length <= index) {
          newValues.push("");
        }
        newValues[index] = "";
        return newValues;
      });
    }
    inputRefs.current[index]?.select();
  };

  const handleBlur = (index: number, value: string) => {
    setFocusedIndex(null);
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || value === "") {
      setLocalProgress((prev) => {
        const newProgress = [...(prev || [])];
        while (newProgress.length <= index) {
          newProgress.push(0);
        }
        newProgress[index] = 0;
        return newProgress;
      });
      setInputValues((prev) => {
        const newValues = [...(prev || [])];
        while (newValues.length <= index) {
          newValues.push("");
        }
        newValues[index] = "";
        return newValues;
      });
    } else {
      setInputValues((prev) => {
        const newValues = [...(prev || [])];
        while (newValues.length <= index) {
          newValues.push("");
        }
        newValues[index] = numValue.toString();
        return newValues;
      });
    }
  };

  const getDisplayValue = (index: number): string => {
    const currentInputValue = inputValues?.[index];
    const currentProgressValue = localProgress?.[index];

    if (focusedIndex === index) {
      return currentInputValue !== undefined ? currentInputValue : "";
    }
    if (!currentProgressValue || currentProgressValue === 0) {
      return "";
    }
    return currentProgressValue.toString();
  };

  const handleSave = () => {
    onSave(localProgress);
    onClose();
  };

  const hasChanges = JSON.stringify(progress) !== JSON.stringify(localProgress);

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
          className={`${styles.saveButton} ${
            !hasChanges ? styles.saveButtonDisabled : ""
          }`}
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
