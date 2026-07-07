require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);

async function seed() {
  try {
    const { data: puzzle } = await supabase
      .from('riddle_puzzles')
      .insert({ title: 'Classic Riddles', theme: 'General Knowledge', status: 'ready' })
      .select()
      .single();

    const riddles = [
      { riddle: "I speak without a mouth and hear without ears. What am I?", answer: "ECHO", points: 10 },
      { riddle: "The more you take, the more you leave behind. What am I?", answer: "FOOTSTEPS", points: 10 },
      { riddle: "What has hands but cannot clap?", answer: "CLOCK", points: 10 },
      { riddle: "I am taken from a mine and shut up in a wooden case. What am I?", answer: "PENCIL LEAD", points: 15 },
      { riddle: "What can travel around the world while staying in a corner?", answer: "STAMP", points: 10 },
      { riddle: "I have cities but no houses, forests but no trees, and water but no fish. What am I?", answer: "MAP", points: 15 },
      { riddle: "The person who makes it has no need of it. What is it?", answer: "COFFIN", points: 20 },
      { riddle: "What gets wetter the more it dries?", answer: "TOWEL", points: 10 },
      { riddle: "I am not alive, but I grow. What am I?", answer: "FIRE", points: 15 },
      { riddle: "What can run but never walk, has a mouth but never talks?", answer: "RIVER", points: 15 },
      { riddle: "I have an eye but cannot see. What am I?", answer: "NEEDLE", points: 10 },
      { riddle: "What question can you never answer yes to?", answer: "ARE YOU ASLEEP", points: 20 },
      { riddle: "What is seen in the middle of March and April that can't be seen at other times?", answer: "LETTER R", points: 20 },
      { riddle: "I am an odd number. Take away one letter and I become even. What am I?", answer: "FIVE", points: 15 },
      { riddle: "What can go up a chimney down but not down a chimney up?", answer: "UMBRELLA", points: 15 },
      { riddle: "I am spelled the same forwards and backwards. What am I?", answer: "PALINDROME", points: 20 },
    ];

    for (let i = 0; i < riddles.length; i++) {
      await supabase.from('riddle_questions').insert({
        puzzle_id: puzzle.id,
        question_number: i + 1,
        riddle_text: riddles[i].riddle,
        correct_answer: riddles[i].answer,
        points: riddles[i].points,
      });
    }

    console.log('✅ Seeded 16 riddles with puzzle ID:', puzzle.id);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

seed();
