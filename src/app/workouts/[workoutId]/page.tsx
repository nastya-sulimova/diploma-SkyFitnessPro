"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getWorkout,
  getWorkoutProgress,
  saveWorkoutProgress,
} from "@/api/workouts";
import ExerciseModal from "@/components/ExerciseModal/ExerciseModal";
import Notification from "@/components/Notification/Notification";
import styles from "./page.module.css";

export default function WorkoutPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const workoutId = params.workoutId as string;
  const courseId = searchParams.get("courseId");

  const [workout, setWorkout] = useState<any>(null);
  const [progress, setProgress] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [workoutNumber, setWorkoutNumber] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [notification, setNotification] = useState<{
    visible: boolean;
    message: string;
  }>({ visible: false, message: "" });

  const hasProgress = progress.some((p) => p > 0);

  useEffect(() => {
    const loadWorkout = async () => {
      if (!workoutId || !courseId) {
        setError("Отсутствует ID тренировки или курса");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const workoutData = await getWorkout(workoutId);
        setWorkout(workoutData);

        try {
          const progressData = await getWorkoutProgress(courseId, workoutId);
          const savedProgress = progressData.progressData || [];
          setProgress(savedProgress);
        } catch (err) {
          setProgress(new Array(workoutData.exercises.length).fill(0));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Ошибка загрузки");
      } finally {
        setLoading(false);
      }
    };

    loadWorkout();
  }, [workoutId, courseId]);

  useEffect(() => {
    const savedCourseName = sessionStorage.getItem(`courseName_${courseId}`);
    if (savedCourseName) {
      setCourseName(savedCourseName);
    }

    const savedWorkoutNumber = sessionStorage.getItem(
      `workoutNumber_${workoutId}`
    );
    if (savedWorkoutNumber) {
      setWorkoutNumber(savedWorkoutNumber);
    }
  }, [courseId, workoutId]);

  const handleSaveProgress = async (newProgress: number[]) => {
    if (!courseId || !workoutId) return;

    const validatedProgress = [...newProgress];
    while (validatedProgress.length < workout.exercises.length) {
      validatedProgress.push(0);
    }

    if (validatedProgress.length > workout.exercises.length) {
      validatedProgress.length = workout.exercises.length;
    }

    setSaving(true);
    try {
      await saveWorkoutProgress(courseId, workoutId, validatedProgress);
      setProgress(validatedProgress);
      setNotification({ visible: true, message: "Ваш прогресс засчитан!" });

      window.dispatchEvent(new Event("coursesUpdated"));
    } catch (err) {
      console.error("Save error:", err);
      alert(err instanceof Error ? err.message : "Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  const calculateProgressPercentage = (current: number, target: number) => {
    if (target === 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  if (!workout) {
    return <div className={styles.container}>Тренировка не найдена</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.courseTitle}>{courseName || workout.name}</h1>

        <div className={styles.videoWrapper}>
          <iframe
            width="100%"
            height="100%"
            src={workout.video}
            title={workout.name}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className={styles.exercisesSection}>
          <h3 className={styles.sectionTitle}>
            Упражнения тренировки {workoutNumber}
          </h3>

          <div className={styles.exercisesList}>
            {workout.exercises.map((exercise: any, index: number) => {
              const percentage = calculateProgressPercentage(
                progress[index] || 0,
                exercise.quantity
              );

              return (
                <div key={exercise._id} className={styles.exerciseCard}>
                  <div className={styles.exerciseHeader}>
                    <span className={styles.exerciseName}>
                      {exercise.name} {percentage}%
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button
            className={styles.saveButton}
            onClick={() => setIsModalOpen(true)}
            disabled={saving}
          >
            {saving
              ? "Сохранение..."
              : hasProgress
              ? "Обновить свой прогресс"
              : "Заполнить свой прогресс"}
          </button>
        </div>
      </div>

      <ExerciseModal
        isOpen={isModalOpen}
        exercises={workout.exercises}
        progress={progress}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProgress}
      />

      <Notification
        message={notification.message}
        isVisible={notification.visible}
        onClose={() => setNotification({ visible: false, message: "" })}
      />
    </div>
  );
}
