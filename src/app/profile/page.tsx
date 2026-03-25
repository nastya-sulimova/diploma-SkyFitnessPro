"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserData } from "@/api/user";
import { fetchCourseById } from "@/api/courses";
import { Course } from "@/types/course";
import { getToken } from "@/utils/auth";
import styles from "./page.module.css";

export default function ProfilePage() {
  const [userEmail, setUserEmail] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoading(true);
        const user = await getUserData();
        setUserEmail(user.email);

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
        setCourses(loadedCourses.filter((c): c is Course => c !== null));
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Ошибка загрузки профиля"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    const handleCoursesUpdate = () => {
      loadProfile();
    };

    window.addEventListener("coursesUpdated", handleCoursesUpdate);

    return () => {
      window.removeEventListener("coursesUpdated", handleCoursesUpdate);
    };
  }, [router]);

  const handleStartWorkout = (courseId: string) => {
    router.push(`/courses/${courseId}`);
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
        <h1 className={styles.title}>Мой профиль</h1>

        <div className={styles.userInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>Email:</span>
            <span className={styles.value}>{userEmail}</span>
          </div>
        </div>

        <section className={styles.coursesSection}>
          <h2 className={styles.sectionTitle}>Мои курсы</h2>

          {courses.length === 0 ? (
            <p className={styles.emptyMessage}>
              У вас пока нет купленных курсов
            </p>
          ) : (
            <div className={styles.coursesList}>
              {courses.map((course) => (
                <div key={course._id} className={styles.courseCard}>
                  <div className={styles.courseInfo}>
                    <h3 className={styles.courseTitle}>{course.nameRU}</h3>
                    <p className={styles.courseDescription}>
                      {course.description}
                    </p>
                    <div className={styles.courseStats}>
                      <span>{course.durationInDays} дней</span>
                      <span>
                        {course.dailyDurationInMinutes.from}-
                        {course.dailyDurationInMinutes.to} мин/день
                      </span>
                      <span>
                        {course.difficulty === "easy" && "Легкий"}
                        {course.difficulty === "medium" && "Средний"}
                        {course.difficulty === "hard" && "Сложный"}
                      </span>
                    </div>
                  </div>
                  <button
                    className={styles.startButton}
                    onClick={() => handleStartWorkout(course._id)}
                  >
                    Начать тренировку
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
