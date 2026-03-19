import { API_BASE_URL } from "@/utils/constants";
import { Course } from "@/types/course";

export async function fetchCourses(): Promise<Course[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/courses`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

export function sortCourses(courses: Course[], order: string[]): Course[] {
  return [...courses].sort((a, b) => {
    return order.indexOf(a.nameEN) - order.indexOf(b.nameEN);
  });
}

export async function fetchCourseById(courseId: string): Promise<Course> {  
  try {
    const res = await fetch(`${API_BASE_URL}/api/fitness/courses/${courseId}`);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching course:", error);
    throw error;
  }
}
