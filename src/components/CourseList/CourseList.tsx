"use client";

import { useState, useEffect } from "react";
import CourseCard from "@/components/CourseCard/CourseCard";
import styles from "./courseList.module.css";

const API_BASE_URL = "https://wedev-api.sky.pro";

interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  difficulty: string;
}

const courseImages: Record<string, string> = {
  Yoga: "/img/courses/yoga.jpg",
  Stretching: "/img/courses/stretching.jpg",
  Fitness: "/img/courses/fitness.jpg",
  StepAirobic: "/img/courses/step.jpg",
  BodyFlex: "/img/courses/bodyflex.jpg",
};

const getDifficultyInRussian = (difficulty: string): string => {
  const map: Record<string, string> = {
    easy: "легкий",
    medium: "средний",
    hard: "сложный",
  };
  return map[difficulty] || difficulty;
};

export default function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/fitness/courses`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();

        const courseOrder = [
          "Yoga",
          "Stretching",
          "Fitness",
          "StepAirobic",
          "BodyFlex",
        ];
        const sortedData = [...data].sort((a, b) => {
          return courseOrder.indexOf(a.nameEN) - courseOrder.indexOf(b.nameEN);
        });

        setCourses(sortedData);
      } catch (err) {
        setError("Не удалось загрузить курсы");
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Загрузка курсов...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.grid}>
      {courses.map((course) => {
        const imageSrc =
          courseImages[course.nameEN] || "/img/courses/default.jpg";

        return (
          <CourseCard
            key={course._id}
            id={course._id}
            title={course.nameRU}
            imageSrc={imageSrc}
            duration={`${course.durationInDays} дней`}
            dailyTime={`${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`}
            difficulty={getDifficultyInRussian(course.difficulty)}
          />
        );
      })}
    </div>
  );
}
