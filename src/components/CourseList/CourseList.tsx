"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard/CourseCard";
import { fetchCourses, sortCourses } from "@/api/courses";
import { Course, difficultyMap } from "@/types/course";
import { COURSE_ORDER, COURSE_IMAGES } from "@/utils/constants";
import styles from "./courseList.module.css";

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourses();
        const sortedData = sortCourses(data, COURSE_ORDER);
        setCourses(sortedData);
      } catch (err) {
        setError("Не удалось загрузить курсы");
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) return <div className={styles.loading}>Загрузка курсов...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.grid}>
      {courses.map((course) => (
        <CourseCard
          key={course._id}
          id={course._id}
          title={course.nameRU}
          imageSrc={COURSE_IMAGES[course.nameEN] || "/img/courses/default.jpg"}
          duration={`${course.durationInDays} дней`}
          dailyTime={`${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`}
          difficulty={difficultyMap[course.difficulty] || course.difficulty}
        />
      ))}
    </div>
  );
}
