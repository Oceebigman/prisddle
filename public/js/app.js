class PrisdleApp {
  constructor() {
    this.gameEngine = null;
    this.uiManager = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('[App] Initializing Prisddle...');
      
      // Initialize UI manager
      this.uiManager = new UIManager();
      
      // Initialize game engine
      this.gameEngine = new GameEngine();
      
      // Simulate boot sequence
      await this.simulateBootSequence();
      
      // Hide boot screen and show game
      this.uiManager.hideBoot();
      
      // Start the game
      this.gameEngine.startGame();
      this.renderCurrentQuestion();
      
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

  renderCurrentQuestion() {
    const question = this.gameEngine.currentQuestion;
    const qIndex = this.gameEngine.currentQuestionIndex;
    const total = this.gameEngine.questions.length;

    this.uiManager.displayQuestion(question, qIndex, total);
    
    this.uiManager.displayAnswers(question.answers, (answerIndex) => {
      this.handleAnswer(answerIndex);
    });
  }

  handleAnswer(answerIndex) {
    const isCorrect = this.gameEngine.submitAnswer(answerIndex);
    
    if (isCorrect) {
      this.uiManager.markAnswerCorrect(answerIndex);
      audioEngine.playCorrect();
    } else {
      this.uiManager.markAnswerWrong(answerIndex);
      this.uiManager.disableWrongAnswers();
      audioEngine.playWrong();
    }

    setTimeout(() => {
      if (this.gameEngine.isGameOver()) {
        const stats = this.gameEngine.getGameStats();
        this.uiManager.showResultScreen(stats);
      } else {
        this.renderCurrentQuestion();
      }
    }, 1500);
  }

  resetGame() {
    this.gameEngine.startGame();
    this.renderCurrentQuestion();
  }
}

const app = new PrisdleApp();
document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
