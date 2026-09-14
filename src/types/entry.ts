/** One day in the diary: a photo of the dog, a short story and today's training goal. */
export interface DiaryEntry {
  id: string;
  /** ISO date (YYYY-MM-DD) for the day the entry belongs to. */
  date: string;
  title: string;
  story: string;
  /** What the dog is practising that day, for example "Learn to sit". */
  trainingGoal: string;
  goalCompleted: boolean;
  /** Photo of the dog, or null until one has been added. */
  photoUrl: string | null;
}

/** The fields the user fills in when writing a new entry. */
export type NewDiaryEntry = Omit<DiaryEntry, "id" | "goalCompleted">;
