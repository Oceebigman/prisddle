import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seed() {
  try {
    // Create puzzle
    const { data: puzzle, error: puzzleError } = await supabase
      .from('riddle_puzzles')
      .insert({
        title: 'Riddle Challenge',
        theme: 'General Knowledge & Tech',
        status: 'ready',
      })
      .select()
      .single();

    if (puzzleError) throw puzzleError;

    const questions = [
      { question_number: 1, riddle_text: 'What has keys but no locks, space but no room, and you can enter but can\'t go inside?', correct_answer: 'KEYBOARD' },
      { question_number: 2, riddle_text: 'I am taken from a mine and shut up in a wooden case, from which I am never released, yet I am used by almost everyone. What am I?', correct_answer: 'PENCIL LEAD' },
      { question_number: 3, riddle_text: 'What can run but never walks, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?', correct_answer: 'RIVER' },
      { question_number: 4, riddle_text: 'In PrismaX, what does VLA stand for in the context of consensus validation?', correct_answer: 'VIRTUAL LEDGER AUTHORITY' },
      { question_number: 5, riddle_text: 'What has a face and two hands but no arms or legs?', correct_answer: 'CLOCK' },
      { question_number: 6, riddle_text: 'PrismaX uses a sliding scale for validator performance. What is the name of the validation loop system?', correct_answer: 'FOUNDRY LOOP' },
      { question_number: 7, riddle_text: 'The more you take, the more you leave behind. What am I?', correct_answer: 'FOOTSTEPS' },
      { question_number: 8, riddle_text: 'What occurs once in a minute, twice in a moment, and never in one hundred years?', correct_answer: 'LETTER M' },
      { question_number: 9, riddle_text: 'In PrismaX, validators must meet specific pass/fail criteria. What determines a validator\'s score on the sliding scale?', correct_answer: 'PERFORMANCE METRICS' },
      { question_number: 10, riddle_text: 'I have cities, but no houses. I have mountains, but no trees. I have water, but no fish. What am I?', correct_answer: 'MAP' },
      { question_number: 11, riddle_text: 'PrismaX integrates AI decision-making with blockchain. What is the primary purpose of this integration?', correct_answer: 'INTELLIGENT CONSENSUS' },
      { question_number: 12, riddle_text: 'What gets wet while drying?', correct_answer: 'TOWEL' },
      { question_number: 13, riddle_text: 'Describe the mechanism by which PrismaX validators achieve distributed agreement without centralized authority.', correct_answer: 'CONSENSUS PROTOCOL' },
      { question_number: 14, riddle_text: 'I am an odd number. Take away one letter and I become even. What number am I?', correct_answer: 'FIVE' },
      { question_number: 15, riddle_text: 'What is the name of PrismaX\'s mechanism for rewarding consistent validator performance?', correct_answer: 'REWARD DISTRIBUTION' },
    ];

    // Insert questions
    const { error: questionsError } = await supabase
      .from('riddle_questions')
      .insert(
        questions.map(q => ({
          puzzle_id: puzzle.id,
          question_number: q.question_number,
          riddle_text: q.riddle_text,
          correct_answer: q.correct_answer.toUpperCase().trim(),
          points: 10,
        }))
      );

    if (questionsError) throw questionsError;

    console.log('✅ Seeded 15 riddles including PrismaX questions');
    console.log(`Puzzle ID: ${puzzle.id}`);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
