import { API_BASE_URL } from "@/utils/constants";
import { getToken } from "@/utils/auth";

export interface UserData {
  email: string;
  selectedCourses: string[];
}

export async function getUserData(): Promise<UserData> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(`${API_BASE_URL}/api/fitness/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "",
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка получения данных пользователя");
  }

  const data = await res.json();

  return {
    email: data.user.email,
    selectedCourses: data.user.selectedCourses || [],
  };
}

export async function addCourse(
  courseId: string
): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(`${API_BASE_URL}/api/fitness/users/me/courses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "",
    },
    body: JSON.stringify({ courseId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка добавления курса");
  }

  return res.json();
}

export async function removeCourse(
  courseId: string
): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/fitness/users/me/courses/${courseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "",
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка удаления курса");
  }

  return res.json();
}
