export interface RiddleQuestion {
  id: string;
  question_number: number;
  riddle_text: string;
  options: string[];
  correct_index: number;
  image_url?: string | null;
  points: number;
}

export function scoreRiddleSubmission(
  questions: RiddleQuestion[],
  submitted: Record<string, number>
): {
  score: number;
  correct_count: number;
  total_questions: number;
} {
  let score = 0;
  let correct_count = 0;

  for (const question of questions) {
    const submittedIndex = submitted[question.question_number.toString()];
    
    // If no answer submitted for this question, skip
    if (submittedIndex === undefined) continue;

    // Compare submitted index against correct index
    if (submittedIndex === question.correct_index) {
      score += question.points;
      correct_count++;
    }
  }

  return {
    score,
    correct_count,
    total_questions: questions.length,
  };
}
