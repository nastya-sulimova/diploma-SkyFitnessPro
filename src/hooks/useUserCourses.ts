"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/utils/auth";

export function useUserCourses(courseId: string) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  // Функция для проверки авторизации и статуса курса
  const checkAuthAndCourse = async () => {
    const token = getToken();
    const isAuth = !!token;
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setLoading(false);
      return;
    }

    try {
      // TODO: Позже заменим на реальный API-запрос к /users/me
      // Сейчас просто имитируем, что курс не добавлен
      setIsCourseAdded(false);
    } catch (error) {
      console.error("Error checking course:", error);
      setIsCourseAdded(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndCourse();

    // Слушаем изменения в localStorage (когда токен меняется в другой вкладке или после входа)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        checkAuthAndCourse();
      }
    };

    // Кастомное событие для обновления в той же вкладке
    const handleAuthChange = () => {
      checkAuthAndCourse();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [courseId]);

  const addCourse = async () => {
    // TODO: Позже добавим реальный API-запрос
    console.log("Добавляем курс:", courseId);
    setIsCourseAdded(true);
  };

  return {
    isAuthenticated,
    isCourseAdded,
    loading,
    addCourse,
  };
}
