import type { DiaryEntry } from "../types/entry";

export const sampleEntries: DiaryEntry[] = [
  {
    id: "1",
    date: "2026-09-14",
    title: "First swim of the autumn",
    story:
      "Walked down to the lake before breakfast. She stood in the shallows for ten minutes before deciding the water was acceptable, then refused to come back out.",
    trainingGoal: "Come back on recall near water",
    goalCompleted: false,
    photoUrl: null,
  },
  {
    id: "2",
    date: "2026-09-13",
    title: "Met the neighbour's cat",
    story:
      "No barking this time. She sat down and waited until the cat lost interest, which felt like a small victory after last week.",
    trainingGoal: "Stay calm around other animals",
    goalCompleted: true,
    photoUrl: null,
  },
  {
    id: "3",
    date: "2026-09-12",
    title: "Rainy day indoors",
    story:
      "Too wet for the long walk, so we practised paw targeting on the kitchen floor instead. Ten minutes of work tired her out more than an hour outside.",
    trainingGoal: "Touch my hand with her paw",
    goalCompleted: true,
    photoUrl: null,
  },
];
