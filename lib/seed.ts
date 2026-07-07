import { supabase } from './supabase-server';

export async function seedDatabase() {
  try {
    // Create a riddle puzzle
    const { data: puzzle, error: puzzleError } = await supabase
      .from('riddle_puzzles')
      .insert({
        title: 'Classic Riddles',
        theme: 'General Knowledge',
        status: 'ready',
      })
      .select()
      .single();

    if (puzzleError || !puzzle) throw puzzleError;

    // Riddles - escalating difficulty
    const riddles = [
      { riddle: "I speak without a mouth and hear without ears. I have no body, but come alive with wind. What am I?", answer: "ECHO", points: 10 },
      { riddle: "The more you take, the more you leave behind. What am I?", answer: "FOOTSTEPS", points: 10 },
      { riddle: "What has hands but cannot clap?", answer: "CLOCK", points: 10 },
      { riddle: "I am taken from a mine and shut up in a wooden case, from which I am never released, yet I am used by almost everyone. What am I?", answer: "PENCIL LEAD", points: 15 },
      { riddle: "What can travel around the world while staying in a corner?", answer: "STAMP", points: 10 },
      { riddle: "I have cities but no houses, forests but no trees, and water but no fish. What am I?", answer: "MAP", points: 15 },
      { riddle: "The person who makes it has no need of it; the person who buys it has no use for it; the person who uses it never knows they're using it. What is it?", answer: "COFFIN", points: 20 },
      { riddle: "What gets wetter the more it dries?", answer: "TOWEL", points: 10 },
      { riddle: "I am not alive, but I grow; I don't have lungs, but I need air; I don't have a mouth, but water kills me. What am I?", answer: "FIRE", points: 15 },
      { riddle: "What can run but never walk, has a mouth but never talks, has a head but never weeps, has a bed but never sleeps?", answer: "RIVER", points: 15 },
      { riddle: "I have an eye but cannot see. What am I?", answer: "NEEDLE", points: 10 },
      { riddle: "What question can you never answer 'yes' to?", answer: "ARE YOU ASLEEP", points: 20 },
      { riddle: "What is seen in the middle of March and April that can't be seen at the beginning or end of either month?", answer: "LETTER R", points: 20 },
      { riddle: "I am an odd number. Take away one letter from me and I become even. What number am I?", answer: "FIVE", points: 15 },
      { riddle: "What can go up a chimney down, but can't go down a chimney up?", answer: "UMBRELLA", points: 15 },
      { riddle: "I am a word that is spelled the same forwards and backwards. What am I?", answer: "PALINDROME", points: 20 },
    ];

    // Insert riddle questions
    for (let i = 0; i < riddles.length; i++) {
      await supabase
        .from('riddle_questions')
        .insert({
          puzzle_id: puzzle.id,
          question_number: i + 1,
          riddle_text: riddles[i].riddle,
          correct_answer: riddles[i].answer,
          points: riddles[i].points,
        });
    }

    console.log('✅ Database seeded with riddle puzzle and 16 questions');
    return { success: true, puzzleId: puzzle.id };
  } catch (error) {
    console.error('❌ Seed error:', error);
    throw error;
  }
}
