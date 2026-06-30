class PrisdleApp {
  constructor() {
    this.isAnswering = false;
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.runBootSequence();
  }

  setupEventListeners() {
    get('#muteBtn').addEventListener('click', () => {
      const muted = audioEngine.toggleMute();
      uiManager.updateMuteButton(muted);
    });

    get('#educationalCard').addEventListener('click', (e) => {
      if (e.target.id === 'educationalCard') {
        this.continueGame();
      }
    });

    get('#eduButton').addEventListener('click', () => {
      this.continueGame();
    });
  }

  async runBootSequence() {
    const logs = [
      '◆ INITIALIZING PRISDDLE CORE...',
      '▶ NEURAL NETWORK: ONLINE',
      '▶ ROBOTICS ENGINE: READY',
      '▶ AI KNOWLEDGE BASE: LOADED',
      '▶ SYNC PROTOCOL: ESTABLISHED',
      '◆ ALL SYSTEMS GO. LET\'S LEARN.',
    ];

    for (let i = 0; i < logs.length; i++) {
      const logEl = createElement('div', 'boot-log-line', logs[i]);
      get('#bootLogs').appendChild(logEl);
      
      const percentage = Math.floor((i / logs.length) * 100);
      uiManager.updateSyncBar(percentage);
      
      await delay(300);
    }

    await delay(500);
    uiManager.updateSyncBar(100);
    uiManager.hideBoot();
    uiManager.showGame();
    
    await delay(300);
    this.startGame();
  }

  startGame() {
    gameManager.resetState();
    this.showNextQuestion();
  }

  showNextQuestion() {
    const question = gameManager.getCurrentQuestion();
    const index = gameManager.state.currentQuestion;
    const total = gameManager.questions.length;

    uiManager.displayQuestion(question, index, total);
    uiManager.displayAnswers(question.answers, (answerIndex) => {
      this.handleAnswer(answerIndex);
    });
    
    uiManager.updateStats(
      gameManager.state.level,
      gameManager.state.streak,
      gameManager.state.lives
    );

    this.isAnswering = false;
  }

  handleAnswer(answerIndex) {
    if (this.isAnswering) return;
    this.isAnswering = true;

    const isCorrect = gameManager.selectAnswer(answerIndex);
    const question = gameManager.getCurrentQuestion();

    if (isCorrect) {
      uiManager.markAnswerCorrect(answerIndex);
      gameManager.handleCorrect();
      
      const achievement = gameManager.checkAchievements();
      if (achievement) {
        uiManager.showAchievementNotification(achievement);
      }

      setTimeout(() => {
        uiManager.showEducationalCard(question.educational);
      }, 600);
    } else {
      uiManager.markAnswerWrong(answerIndex);
      gameManager.handleWrong();
      
      uiManager.showHint(question.hint);
      uiManager.disableWrongAnswers();
      
      setTimeout(() => {
        this.continueGame();
      }, 1500);
    }
  }

  continueGame() {
    uiManager.closeEducationalCard();
    uiManager.feedbackContainer.textContent = '';
    
    gameManager.nextQuestion();

    if (gameManager.isGameOver()) {
      setTimeout(() => this.endGame(), 500);
    } else {
      setTimeout(() => this.showNextQuestion(), 500);
    }
  }

  endGame() {
    const result = gameManager.endGame();
    uiManager.showResultScreen(result);

    setTimeout(() => {
      const restartBtn = get('#restartBtn');
      const shareBtn = get('#shareBtn');

      restartBtn.addEventListener('click', () => {
        location.reload();
      });

      shareBtn.addEventListener('click', () => {
        const text = `🎮 I scored ${result.score} points on Prisddle!\n🤖 Rank: ${result.rank}\n🎯 Accuracy: ${result.accuracy}%\n\n⚡ Test your AI knowledge: https://prisddle.com`;
        
        if (navigator.share) {
          navigator.share({
            title: 'Prisddle - AI Robotics Quiz',
            text: text,
            url: 'https://prisddle.com'
          });
        } else {
          alert('Your score: ' + result.score + ' points!');
        }
      });
    }, 500);
  }
}

// Initialize app
window.addEventListener('DOMContentLoaded', () => {
  new PrisdleApp();
});
