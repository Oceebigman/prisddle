import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { 
    auth: { persistSession: false },
    realtime: { transport: 'ws' }
  }
);

async function seed() {
  console.log('🌱 Seeding database...');
  
  try {
    const { data: puzzle, error: puzzleError } = await supabase
      .from('riddle_puzzles')
      .insert({ title: 'Classic Riddles', theme: 'General Knowledge', status: 'ready' })
      .select()
      .single();

    if (puzzleError) throw puzzleError;
    console.log('✅ Created puzzle:', puzzle.id);

    const riddles = [
      { riddle: "I speak without a mouth. What am I?", answer: "ECHO", points: 10 },
      { riddle: "The more you take, the more you leave behind. What am I?", answer: "FOOTSTEPS", points: 10 },
      { riddle: "What has hands but cannot clap?", answer: "CLOCK", points: 10 },
      { riddle: "What can travel around the world while staying in a corner?", answer: "STAMP", points: 10 },
      { riddle: "What gets wetter the more it dries?", answer: "TOWEL", points: 10 },
    ];

    for (let i = 0; i < riddles.length; i++) {
      const { error } = await supabase.from('riddle_questions').insert({
        puzzle_id: puzzle.id,
        question_number: i + 1,
        riddle_text: riddles[i].riddle,
        correct_answer: riddles[i].answer,
        points: riddles[i].points,
      });
      if (error) throw error;
    }

    console.log('✅ Seeded 5 riddles successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
