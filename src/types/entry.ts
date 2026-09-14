export interface DiaryEntry {
  id: string;
  date: string;
  title: string;
  story: string;
  trainingGoal: string;
  goalCompleted: boolean;
  photoUrl: string | null;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id" | "goalCompleted">;
