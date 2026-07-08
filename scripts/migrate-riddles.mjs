import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// New PrismaX riddles with multiple choice
const prismaXRiddles = [
  {
    question_number: 1,
    riddle_text: 'What does PrismaX use to reach consensus across validators?',
    options: ['Virtual Ledger Authority', 'Proof of Work', 'Democratic Vote', 'Random Selection'],
    correctIndex: 0,
  },
  {
    question_number: 2,
    riddle_text: 'In PrismaX, validators are scored on a what type of scale?',
    options: ['Fixed Scale', 'Sliding Scale', 'Linear Scale', 'Exponential Scale'],
    correctIndex: 1,
  },
  {
    question_number: 3,
    riddle_text: 'What is the name of PrismaX validation loop system?',
    options: ['Proof Loop', 'Validation Ring', 'VLA Foundry Loop', 'Consensus Chain'],
    correctIndex: 2,
  },
  {
    question_number: 4,
    riddle_text: 'PrismaX integrates which two domains?',
    options: ['Blockchain and Gaming', 'Blockchain and AI', 'AI and IoT', 'Web2 and Web3'],
    correctIndex: 1,
  },
  {
    question_number: 5,
    riddle_text: 'What is The First 100 in PrismaX?',
    options: ['First 100 blocks', 'Initial validator cohort', 'First 100 transactions', 'Bootstrap period'],
    correctIndex: 1,
  },
  {
    question_number: 6,
    riddle_text: 'How does PrismaX handle validator performance?',
    options: ['Binary pass/fail', 'Percentage-based scoring', 'Sliding scale scoring', 'Tier-based ranks'],
    correctIndex: 2,
  },
  {
    question_number: 7,
    riddle_text: 'What type of decisions can AI make in PrismaX?',
    options: ['Only financial', 'Intelligent consensus', 'Random outcomes', 'Predefined rules'],
    correctIndex: 1,
  },
  {
    question_number: 8,
    riddle_text: 'What is the primary goal of PrismaX validators?',
    options: ['Mine coins', 'Stake capital', 'Reach intelligent consensus', 'Control the network'],
    correctIndex: 2,
  },
  {
    question_number: 9,
    riddle_text: 'In PrismaX, what replaces traditional PoW?',
    options: ['PoS', 'Intelligent Consensus', 'Voting', 'Lottery'],
    correctIndex: 1,
  },
  {
    question_number: 10,
    riddle_text: 'What makes PrismaX different from traditional blockchains?',
    options: ['Faster blocks', 'AI-driven consensus', 'More validators', 'Lower fees'],
    correctIndex: 1,
  },
];

async function migrate() {
  try {
    // Get or create PrismaX puzzle
    const { data: puzzles } = await supabase
      .from('riddle_puzzles')
      .select('id')
      .eq('title', 'PrismaX Academy')
      .limit(1);

    let puzzleId;
    if (puzzles && puzzles.length > 0) {
      puzzleId = puzzles[0].id;
      console.log('✅ Using existing PrismaX puzzle:', puzzleId);
    } else {
      const { data: newPuzzle } = await supabase
        .from('riddle_puzzles')
        .insert({
          title: 'PrismaX Academy',
          theme: 'PrismaX & Blockchain',
          status: 'ready',
        })
        .select()
        .single();
      puzzleId = newPuzzle.id;
      console.log('✅ Created new PrismaX puzzle:', puzzleId);
    }

    // Insert new riddles with options
    const { error } = await supabase
      .from('riddle_questions')
      .insert(
        prismaXRiddles.map(q => ({
          puzzle_id: puzzleId,
          question_number: q.question_number,
          riddle_text: q.riddle_text,
          options: q.options,
          correct_index: q.correctIndex,
          correct_answer: q.options[q.correctIndex].toUpperCase(),
          points: 10,
        }))
      );

    if (error) throw error;
    console.log('✅ Seeded 10 PrismaX multiple-choice riddles');
    console.log('📝 Puzzle ID for room creation:', puzzleId);
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrate();
