import type { RiddleQuestion } from './scoring';

// Deterministic 32-bit hash (FNV-1a)
function hash(str: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

// Same roomId + same bank => same 10 questions, same option order,
// for every player and for the scoring endpoint alike.
export function selectRoomQuestions(
  roomId: string,
  questions: RiddleQuestion[],
  n = 10
): RiddleQuestion[] {
  const picked = [...questions]
    .sort((a, b) => hash(roomId + ':' + a.question_number) - hash(roomId + ':' + b.question_number))
    .slice(0, Math.min(n, questions.length))
    .sort((a, b) => a.question_number - b.question_number);

  return picked.map((q) => {
    const order = q.options
      .map((_, i) => i)
      .sort((a, b) => hash(roomId + ':' + q.question_number + ':' + a) - hash(roomId + ':' + q.question_number + ':' + b));
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      correct_index: order.indexOf(q.correct_index),
    };
  });
}
