class PrisdleApp {
  constructor() {
    this.gameEngine = null;
    this.uiManager = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      console.log('[App] Initializing Prisddle...');
      
      // Initialize UI first (no async dependencies)
      this.uiManager = new UIManager();
      this.uiManager.showBootScreen();
      
      // Initialize game engine
      this.gameEngine = new GameEngine();
      
      // Show boot sequence
      await this.simulateBootSequence();
      
      // Initialize game
      this.gameEngine.startGame();
      this.uiManager.renderQuestion(this.gameEngine.currentQuestion);
      
      this.initialized = true;
      console.log('[App] Prisddle initialized successfully');
    } catch (error) {
      console.error('[App] Initialization error:', error);
      this.uiManager.showError('Failed to initialize game: ' + error.message);
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
      await new Promise(resolve => setTimeout(resolve, 500));
      this.uiManager.addBootLog(msg);
    }

    await new Promise(resolve => setTimeout(resolve, 800));
    this.uiManager.transitionToGame();
  }

  handleAnswer(questionIndex, answerIndex) {
    const isCorrect = this.gameEngine.submitAnswer(questionIndex, answerIndex);
    this.uiManager.showAnswerResult(isCorrect);
    
    setTimeout(() => {
      if (this.gameEngine.isGameOver()) {
        this.uiManager.showGameOver(this.gameEngine.getGameStats());
      } else {
        this.uiManager.renderQuestion(this.gameEngine.currentQuestion);
      }
    }, 1500);
  }

  resetGame() {
    this.gameEngine.startGame();
    this.uiManager.renderQuestion(this.gameEngine.currentQuestion);
  }
}

const app = new PrisdleApp();
document.addEventListener('DOMContentLoaded', () => {
  app.initialize();
});
