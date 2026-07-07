export interface RiddleQuestion {
  id: string;
  question_number: number;
  riddle_text: string;
  correct_answer: string;
  points: number;
}

function normalizeAnswer(s: string): string {
  return s.trim().toUpperCase().replace(/\s+/g, ' ');
}

export function scoreRiddleSubmission(
  questions: RiddleQuestion[],
  submitted: Record<string, string>
): {
  score: number;
  correct_count: number;
  total_questions: number;
} {
  let score = 0;
  let correct_count = 0;

  for (const question of questions) {
    const submittedAnswer = submitted[question.question_number.toString()];
    if (!submittedAnswer) continue;

    const normalized_submitted = normalizeAnswer(submittedAnswer);
    const normalized_correct = normalizeAnswer(question.correct_answer);

    if (normalized_submitted === normalized_correct) {
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
