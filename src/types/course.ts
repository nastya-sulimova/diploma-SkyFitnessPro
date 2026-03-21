export interface Course {
  _id: string;
  nameRU: string;
  nameEN: string;
  description?: string;
  directions?: [];
  fitting?: [];
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  difficulty: "easy" | "medium" | "hard";
  workouts?: string[];
}

export const difficultyMap: Record<string, string> = {
  easy: "легкий",
  medium: "средний",
  hard: "сложный",
};
