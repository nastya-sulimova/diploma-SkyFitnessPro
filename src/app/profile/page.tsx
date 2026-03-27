"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/api/user";
import { fetchCourseById } from "@/api/courses";
import { getCourseProgress, getCachedWorkout } from "@/api/workouts";
import { Course, difficultyMap } from "@/types/course";
import { getToken } from "@/utils/auth";
import { getNameFromEmail } from "@/utils/user";
import styles from "./page.module.css";
import CourseCard from "@/components/CourseCard/CourseCard";
import { COURSE_IMAGES } from "@/utils/constants";

interface CourseWithProgress extends Course {
  progress: number;
}

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const loadProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/");
      return;
    }

    try {
      setLoading(true);
      const user = await getUserData();
      setUserEmail(user.email);
      setUserName(getNameFromEmail(user.email));

      const courseIds = user.selectedCourses || [];

      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const coursePromises = courseIds.map((courseId: string) =>
        fetchCourseById(courseId).catch((err) => {
          console.error(`Error loading course ${courseId}:`, err);
          return null;
        })
      );

      const loadedCourses = await Promise.all(coursePromises);
      const validCourses = loadedCourses.filter((c): c is Course => c !== null);

      const coursesWithProgress = await Promise.all(
        validCourses.map(async (course) => {
          try {
            const progress = await getCourseProgress(course._id);
            const workoutsProgress = progress.workoutsProgress || [];

            let totalPercent = 0;
            let totalPossible = 0;

            if (course.workouts && course.workouts.length > 0) {
              for (const workoutId of course.workouts) {
                const workout = await getCachedWorkout(workoutId);

                if (
                  workout &&
                  workout.exercises &&
                  workout.exercises.length > 0
                ) {
                  const exercisesCount = workout.exercises.length;

                  const workoutProgress = workoutsProgress.find(
                    (wp: any) => wp.workoutId === workoutId
                  );

                  if (workoutProgress && workoutProgress.progressData) {
                    for (let i = 0; i < exercisesCount; i++) {
                      const completedValue =
                        workoutProgress.progressData[i] || 0;
                      const targetValue = workout.exercises[i]?.quantity || 0;

                      if (targetValue > 0) {
                        const percent = Math.min(
                          completedValue / targetValue,
                          1
                        );
                        totalPercent += percent;
                        totalPossible += 1;
                      }
                    }
                  } else {
                    for (let i = 0; i < exercisesCount; i++) {
                      totalPossible += 1;
                    }
                  }
                }
              }
            }

            const percent =
              totalPossible > 0
                ? Math.round((totalPercent / totalPossible) * 100)
                : 0;

            return { ...course, progress: percent };
          } catch (err) {
            console.error(
              `Error loading progress for course ${course._id}:`,
              err
            );
            return { ...course, progress: 0 };
          }
        })
      );

      setCourses(coursesWithProgress);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ошибка загрузки профиля");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadProfile();

    const handleCoursesUpdate = () => {
      loadProfile();
    };

    window.addEventListener("coursesUpdated", handleCoursesUpdate);

    return () => {
      window.removeEventListener("coursesUpdated", handleCoursesUpdate);
    };
  }, [loadProfile]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    window.dispatchEvent(new Event("authChange"));
    router.push("/");
  };

  if (loading) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>Загрузка...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className={styles.container}>
        <div className={styles.error}>{error}</div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <h1 className={styles.title}>Профиль</h1>

        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <div className={styles.photo}>
              <img src="/img/profilePhoto.png" alt="" />
            </div>
            <div className={styles.infoBlock}>
              <div className={styles.userData}>
                <p className={styles.userName}>{userName}</p>
                <p className={styles.userEmail}>Логин: {userEmail}</p>
              </div>
              <button className={styles.exitBtn} onClick={handleLogout}>
                Выйти
              </button>
            </div>
          </div>
        </div>

        <h2 className={styles.title}>Мои курсы</h2>

        {courses.length === 0 ? (
          <p className={styles.emptyMessage}>У вас пока нет купленных курсов</p>
        ) : (
          <div className={styles.coursesList}>
            {courses.map((course) => (
              <CourseCard
                key={course._id}
                id={course._id}
                title={course.nameRU}
                imageSrc={
                  COURSE_IMAGES[course.nameEN] || "/img/courses/default.jpg"
                }
                duration={`${course.durationInDays} дней`}
                dailyTime={`${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`}
                difficulty={
                  difficultyMap[course.difficulty] || course.difficulty
                }
                isProfile={true}
                onCourseRemoved={() => {
                  loadProfile();
                }}
                progress={course.progress}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
