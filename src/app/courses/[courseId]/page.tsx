"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { fetchCourseById } from "@/api/courses";
import { COURSE_PAGE_IMAGES } from "@/utils/constants";
import { useUserCourses } from "@/hooks/useUserCourses";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

export default function CoursePage() {
  const params = useParams();
  const courseId = params.courseId as string;

  const router = useRouter();
  const workoutsRef = useRef<HTMLDivElement>(null);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated, isCourseAdded, addCourse } =
    useUserCourses(courseId);

  useEffect(() => {
    const loadCourse = async () => {
      if (!courseId) return;

      try {
        console.log("Loading course with ID:", courseId);
        const data = await fetchCourseById(courseId);
        console.log("Course data:", data);
        setCourse(data);
      } catch (error) {
        console.error("Error loading course:", error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [courseId]);

  const handleButtonClick = () => {
    if (!isAuthenticated) {
      router.push("/login");
    } else if (isCourseAdded) {
      workoutsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      addCourse();
    }
  };

  const getButtonText = () => {
    if (!isAuthenticated) return "Войдите, чтобы добавить курс";
    if (isCourseAdded) return "Перейти к тренировкам";
    return "Добавить курс";
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!course) {
    return <div className={styles.notFound}>Курс не найден</div>;
  }

  const imageSrc =
    COURSE_PAGE_IMAGES[course.nameEN] || "/img/courses/default.jpg";

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageSrc}
          alt={course.nameRU}
          fill
          priority
          className={styles.courseImage}
          sizes="100vw"
        />
        <h1 className={styles.title}>{course.nameRU}</h1>
      </div>
      {course.fitting && course.fitting.length > 0 && (
        <div className={styles.sectionFitting}>
          <h2 className={styles.sectionTitle}>Подойдет для вас, если:</h2>
          <ul className={styles.list}>
            {course.fitting.map((item: string, index: number) => (
              <li key={index}>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
      {course.directions && course.directions.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Направления</h2>
          <div className={styles.directions}>
            {course.directions.map((item: string, index: number) => (
              <div key={index} className={styles.direction}>
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.4637 4.36751C12.6202 3.70443 12.6984 3.3729 12.8242 3.29823C12.9326 3.23392 13.0674 3.23392 13.1758 3.29823C13.3016 3.3729 13.3798 3.70443 13.5363 4.36751L14.2997 7.60302C14.5837 8.80636 14.7257 9.40803 15.0343 9.89596C15.3071 10.3274 15.6726 10.6929 16.104 10.9657C16.592 11.2743 17.1936 11.4163 18.397 11.7003L21.6325 12.4637C22.2956 12.6202 22.6271 12.6984 22.7018 12.8242C22.7661 12.9326 22.7661 13.0674 22.7018 13.1758C22.6271 13.3016 22.2956 13.3798 21.6325 13.5363L18.397 14.2997C17.1936 14.5837 16.592 14.7257 16.104 15.0343C15.6726 15.3071 15.3071 15.6726 15.0343 16.104C14.7257 16.592 14.5837 17.1936 14.2997 18.397L13.5363 21.6325C13.3798 22.2956 13.3016 22.6271 13.1758 22.7018C13.0674 22.7661 12.9326 22.7661 12.8242 22.7018C12.6984 22.6271 12.6202 22.2956 12.4637 21.6325L11.7003 18.397C11.4163 17.1936 11.2743 16.592 10.9657 16.104C10.6929 15.6726 10.3274 15.3071 9.89596 15.0343C9.40803 14.7257 8.80636 14.5837 7.60301 14.2997L4.36751 13.5363C3.70443 13.3798 3.3729 13.3016 3.29823 13.1758C3.23392 13.0674 3.23392 12.9326 3.29823 12.8242C3.3729 12.6984 3.70443 12.6202 4.36751 12.4637L7.60302 11.7003C8.80636 11.4163 9.40803 11.2743 9.89596 10.9657C10.3274 10.6929 10.6929 10.3274 10.9657 9.89596C11.2743 9.40803 11.4163 8.80636 11.7003 7.60301L12.4637 4.36751Z"
                    fill="black"
                  />
                </svg>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className={styles.commonDescription}>
        <div className={styles.commonBlock}>
          <div className={styles.commonBlockText}>
            <h2 className={styles.commonBlockTitle}>
              Начните путь к новому телу
            </h2>
            <ul className={styles.commonBlockList}>
              <li className={styles.commonBlockItem}>
                проработка всех групп мышц
              </li>
              <li className={styles.commonBlockItem}>тренировка суставов</li>
              <li className={styles.commonBlockItem}>
                улучшение циркуляции крови
              </li>
              <li className={styles.commonBlockItem}>
                упражнения заряжают бодростью
              </li>
              <li className={styles.commonBlockItem}>
                помогают противостоять стрессам
              </li>
            </ul>
            <button
              className={styles.commonBlockBtn}
              onClick={handleButtonClick}
            >
              {getButtonText()}
            </button>
          </div>
          <img
            className={styles.courseCommonImage}
            src="/img/coursesId/sportsman.png"
            alt=""
          />
        </div>
      </div>

      {course.workouts && course.workouts.length > 0 && (
        <div ref={workoutsRef} className={styles.section}>
          <h2 className={styles.sectionTitle}>Тренировки</h2>
          <div className={styles.workoutsList}>
            {course.workouts.map((workoutId: string, index: number) => (
              <div key={workoutId} className={styles.workoutCard}>
                <span className={styles.workoutNumber}>
                  Тренировка {index + 1}
                </span>
                <button
                  className={styles.startButton}
                  onClick={() => {
                    sessionStorage.setItem(
                      `courseName_${courseId}`,
                      course.nameRU
                    );
                    sessionStorage.setItem(
                      `workoutNumber_${workoutId}`,
                      String(index + 1)
                    );
                    router.push(`/workouts/${workoutId}?courseId=${courseId}`);
                  }}
                >
                  Начать
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
