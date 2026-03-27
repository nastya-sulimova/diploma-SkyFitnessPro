"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/utils/auth";
import { getUserData, addCourse as apiAddCourse } from "@/api/user";

export function useUserCourses(courseId: string) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCourseAdded, setIsCourseAdded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userCourses, setUserCourses] = useState<string[]>([]);

  const checkAuthAndCourse = async () => {
    const token = getToken();
    const isAuth = !!token;
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      setLoading(false);
      return;
    }

    try {
      const userData = await getUserData();
      const courses = userData.selectedCourses || [];
      setUserCourses(courses);
      setIsCourseAdded(courses.includes(courseId));
    } catch (error) {
      console.error("Error checking course:", error);
      setIsCourseAdded(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuthAndCourse();

    const handleAuthChange = () => {
      checkAuthAndCourse();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [courseId]);

  const addCourse = async () => {
    try {
      await apiAddCourse(courseId);
      setIsCourseAdded(true);
      setUserCourses((prev) => [...prev, courseId]);
      window.dispatchEvent(new Event("coursesUpdated"));
      return true;
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  };

  const removeCourse = async () => {
    // TODO: добавить удаление курса позже
    console.log("Remove course:", courseId);
  };

  return {
    isAuthenticated,
    isCourseAdded,
    loading,
    addCourse,
    removeCourse,
    userCourses,
  };
}
