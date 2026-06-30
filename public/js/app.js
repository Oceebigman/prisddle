class PrisdleApp {
  constructor() {
    this.gameManager = null;
    this.uiManager = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('[App] Initializing Prisddle...');
      
      // Initialize UI manager
      this.uiManager = new UIManager();
      
      // Initialize game manager
      this.gameManager = new GameManager();
      
      // Simulate boot sequence
      await this.simulateBootSequence();
      
      // Hide boot screen (with fade)
      this.uiManager.hideBoot();
      
      // Wait for boot to fully hide
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Show game screen (NO fade - just display)
      const gameContainer = document.getElementById('gameContainer');
      gameContainer.style.display = 'flex';
      gameContainer.style.opacity = '1';
      
      // Display first question
      this.showCurrentQuestion();
      
      this.initialized = true;
      console.log('[App] Prisddle initialized successfully');
    } catch (error) {
      console.error('[App] Initialization error:', error);
    }
  }

  async simulateBootSequence() {
    const bootMessages = [
      'INITIALIZING PRISDDLE CORE...',
      'LOADING NEURAL NETWORKS...',
      'CALIBRATING AI SYSTEMS...',
      'SYNCING DECISION ENGINE...',
      'PRIMING QUANTUM PROCESSORS...',
      'SYSTEM READY FOR ENGAGEMENT'
    ];

    for (let msg of bootMessages) {
      const logLine = document.createElement('div');
      logLine.textContent = msg;
      document.querySelector('.boot-logs')?.appendChild(logLine);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    await new Promise(resolve => setTimeout(resolve, 800));
  }

  showCurrentQuestion() {
    const question = this.gameManager.getCurrentQuestion();
    const qIndex = this.gameManager.state.currentQuestion;
    const total = this.gameManager.questions.length;

    this.uiManager.displayQuestion(question, qIndex, total);
    
    this.uiManager.displayAnswers(question.answers, (answerIndex) => {
      this.handleAnswer(answerIndex);
    });
  }

  handleAnswer(answerIndex) {
    const question = this.gameManager.getCurrentQuestion();
    const isCorrect = question.correct === answerIndex;
    
    if (isCorrect) {
      this.uiManager.markAnswerCorrect(answerIndex);
      this.gameManager.handleCorrect();
      audioEngine.playCorrect();
    } else {
      this.uiManager.markAnswerWrong(answerIndex);
      this.uiManager.disableWrongAnswers();
      this.gameManager.handleWrong();
      audioEngine.playWrong();
    }

    setTimeout(() => {
      if (this.gameManager.isGameOver()) {
        this.gameManager.endGame();
        const stats = {
          score: this.gameManager.state.score,
          correctAnswers: this.gameManager.state.correctAnswers,
          totalAnswered: this.gameManager.state.totalAnswered,
          accuracy: Math.round((this.gameManager.state.correctAnswers / this.gameManager.state.totalAnswered) * 100),
          rank: this.gameManager.calculateRank(Math.round((this.gameManager.state.correctAnswers / this.gameManager.state.totalAnswered) * 100))
        };
        this.uiManager.showResultScreen(stats);
      } else {
        this.gameManager.nextQuestion();
        this.showCurrentQuestion();
      }
    }, 1500);
  }

  resetGame() {
    this.gameManager.resetState();
    this.showCurrentQuestion();
  }
}

const app = new PrisdleApp();
document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
