import { API_BASE_URL } from "@/utils/constants";
import { getToken } from "@/utils/auth";

export interface Exercise {
  _id: string;
  name: string;
  quantity: number;
}

export interface Workout {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
}

export interface CachedWorkout {
  _id: string;
  name: string;
  video: string;
  exercises: Array<{
    _id: string;
    name: string;
    quantity: number;
  }>;
}

export interface WorkoutProgress {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
}

const workoutCache = new Map<string, CachedWorkout>();

export async function getCachedWorkout(
  workoutId: string
): Promise<CachedWorkout | null> {
  const token = getToken();

  if (!token) {
    return null;
  }

  if (workoutCache.has(workoutId)) {
    return workoutCache.get(workoutId)!;
  }

  try {
    const res = await fetch(
      `${API_BASE_URL}/api/fitness/workouts/${workoutId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      return null;
    }

    const workout = await res.json();
    workoutCache.set(workoutId, workout);
    return workout;
  } catch (err) {
    console.error(`Error getting workout ${workoutId}:`, err);
    return null;
  }
}

export async function getWorkout(workoutId: string): Promise<Workout> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(`${API_BASE_URL}/api/fitness/workouts/${workoutId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка получения тренировки");
  }

  return res.json();
}

export async function getWorkoutProgress(
  courseId: string,
  workoutId: string
): Promise<WorkoutProgress> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/fitness/users/me/progress?courseId=${courseId}&workoutId=${workoutId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка получения прогресса");
  }

  return res.json();
}

export async function saveWorkoutProgress(
  courseId: string,
  workoutId: string,
  progressData: number[]
): Promise<{ message: string }> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const sanitizedProgress = progressData.map((v) => Number(v) || 0);

  const res = await fetch(
    `${API_BASE_URL}/api/fitness/courses/${courseId}/workouts/${workoutId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "",
      },
      body: JSON.stringify({ progressData: sanitizedProgress }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error("Save progress error:", error);
    throw new Error(error.message || "Ошибка сохранения прогресса");
  }

  return res.json();
}

export async function getCourseProgress(courseId: string): Promise<{
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: Array<{
    workoutId: string;
    workoutCompleted: boolean;
    progressData: number[];
  }>;
}> {
  const token = getToken();

  if (!token) {
    throw new Error("Не авторизован");
  }

  const res = await fetch(
    `${API_BASE_URL}/api/fitness/users/me/progress?courseId=${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Ошибка получения прогресса");
  }

  const data = await res.json();

  return {
    courseId: data.courseId || courseId,
    courseCompleted: data.courseCompleted || false,
    workoutsProgress: data.workoutsProgress || [],
  };
}
