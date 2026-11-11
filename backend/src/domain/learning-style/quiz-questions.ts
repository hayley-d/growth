import type { LearningStyleKey } from "@/domain/learning-style/learning-style-key";

export type QuizOption = {
  id: string;
  text: string;
  style: LearningStyleKey;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  options: QuizOption[];
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: "flat-pack-desk",
    prompt: "Your new desk arrives flat in a box. What do you grab first?",
    options: [
      { id: "a", text: "The picture instructions", style: "visual" },
      { id: "b", text: "Someone to read the steps out while you build", style: "auditory" },
      {
        id: "c",
        text: "The written steps, so you can read them all first",
        style: "reading-writing",
      },
      { id: "d", text: "The screwdriver. You'll work it out", style: "kinesthetic" },
    ],
  },
  {
    id: "new-place",
    prompt: "A friend invites you over. You've never been to their place. How do you get there?",
    options: [
      { id: "a", text: "Phone them and ask them to explain the way", style: "auditory" },
      { id: "b", text: "Ask them to send the directions in a message", style: "reading-writing" },
      { id: "c", text: "Head out and figure it out on the way", style: "kinesthetic" },
      { id: "d", text: "Look at the route on a map before you leave", style: "visual" },
    ],
  },
  {
    id: "board-game",
    prompt: "New board game. Where do you start?",
    options: [
      { id: "a", text: "The rule book", style: "reading-writing" },
      { id: "b", text: "A practice round, and you learn from your mistakes", style: "kinesthetic" },
      { id: "c", text: "Watching the others play a round first", style: "visual" },
      { id: "d", text: "Someone who's played before explaining it", style: "auditory" },
    ],
  },
  {
    id: "new-dish",
    prompt: "You want to cook something you've never made. What do you look for?",
    options: [
      { id: "a", text: "Nothing much. You'll taste and adjust as you go", style: "kinesthetic" },
      { id: "b", text: "A video of someone making it", style: "visual" },
      { id: "c", text: "A voice note from someone who makes it often", style: "auditory" },
      { id: "d", text: "A written recipe with the amounts", style: "reading-writing" },
    ],
  },
  {
    id: "remember-for-test",
    prompt: "There's a test tomorrow. How do you study?",
    options: [
      { id: "a", text: "Draw diagrams or a mind map", style: "visual" },
      { id: "b", text: "Say it out loud, or explain it to a friend", style: "auditory" },
      { id: "c", text: "Rewrite your notes in your own words", style: "reading-writing" },
      { id: "d", text: "Work through practice questions", style: "kinesthetic" },
    ],
  },
  {
    id: "new-app",
    prompt: "You download an app you've never used. What now?",
    options: [
      { id: "a", text: "Ask a friend who uses it to tell you how it works", style: "auditory" },
      { id: "b", text: "Read the help page", style: "reading-writing" },
      { id: "c", text: "Tap around until it clicks", style: "kinesthetic" },
      { id: "d", text: "Look through the screenshots first", style: "visual" },
    ],
  },
  {
    id: "new-phone",
    prompt: "Your old phone is dying and you need a new one. How do you choose?",
    options: [
      { id: "a", text: "Read reviews and spec sheets", style: "reading-writing" },
      { id: "b", text: "Hold a few in a shop and try them", style: "kinesthetic" },
      { id: "c", text: "Compare photos and side by side charts", style: "visual" },
      { id: "d", text: "Ask friends what they think of theirs", style: "auditory" },
    ],
  },
  {
    id: "explain-to-friend",
    prompt: "A friend asks how something works. You know it well. What do you do?",
    options: [
      { id: "a", text: "Show them, then let them have a go", style: "kinesthetic" },
      { id: "b", text: "Grab some paper and sketch it", style: "visual" },
      { id: "c", text: "Talk them through it", style: "auditory" },
      { id: "d", text: "Write it out for them step by step", style: "reading-writing" },
    ],
  },
];
