class UIManager {
  constructor() {
    this.cacheElements();
  }

  cacheElements() {
    this.bootContainer = get('#bootContainer');
    this.gameContainer = get('#gameContainer');
    this.questionHero = get('#questionHero');
    this.questionNumber = get('#questionNumber');
    this.questionCategory = get('#questionCategory');
    this.questionText = get('#questionText');
    this.answersSection = get('#answersSection');
    this.feedbackContainer = get('#feedbackContainer');
    this.syncPercentageBar = get('#syncPercentageBar');
    this.muteBtn = get('#muteBtn');
    this.levelDisplayFooter = get('#levelDisplayFooter');
    this.streakValueFooter = get('#streakValueFooter');
    this.livesValueFooter = get('#livesValueFooter');
    this.educationalCard = get('#educationalCard');
    this.resultContainer = get('#resultContainer');
    this.notificationContainer = get('#notificationContainer');
  }

  displayQuestion(question, index, total) {
    this.questionNumber.textContent = `${index + 1}/${total}`;
    this.questionCategory.textContent = question.category;
    this.questionText.textContent = question.text;
  }

  displayAnswers(answers, onAnswerClick) {
    this.answersSection.innerHTML = '';
    answers.forEach((answer, index) => {
      const btn = createElement('button', 'answer-btn');
      btn.textContent = answer;
      btn.onclick = () => onAnswerClick(index);
      this.answersSection.appendChild(btn);
    });
  }

  showHint(hint) {
    this.feedbackContainer.textContent = `💡 ${hint}`;
    this.feedbackContainer.style.color = 'var(--primary)';
  }

  markAnswerCorrect(index) {
    const btn = this.answersSection.children[index];
    addClass(btn, 'correct');
    audioEngine.playCorrect();
  }

  markAnswerWrong(index) {
    const btn = this.answersSection.children[index];
    addClass(btn, 'wrong');
    audioEngine.playWrong();
  }

  disableWrongAnswers() {
    getAll('.answer-btn:not(.correct)').forEach(btn => {
      addClass(btn, 'disabled-wrong');
      btn.disabled = true;
    });
  }

  showEducationalCard(data) {
    get('#eduIcon').textContent = data.icon;
    get('#eduTitle').textContent = data.title;
    get('#eduExplanation').textContent = data.explanation;
    get('#eduRelevance').textContent = `📚 Relevance: ${data.relevance}`;
    this.educationalCard.style.display = 'flex';
    scale(this.educationalCard);
  }

  closeEducationalCard() {
    fadeOut(this.educationalCard, 200);
    setTimeout(() => this.educationalCard.style.display = 'none', 200);
  }

  showResultScreen(data) {
    const accuracy = Math.round((data.correctAnswers / data.totalAnswered) * 100);
    const timeMinutes = Math.floor(data.time / 60);
    
    let html = `
      <div class="result-card">
        <div class="result-score">${data.score}</div>
        <div class="result-rank">${data.rank}</div>
        <div class="result-stats">
          <div class="result-stat">
            <div class="result-stat-label">Accuracy</div>
            <div class="result-stat-value">${accuracy}%</div>
          </div>
          <div class="result-stat">
            <div class="result-stat-label">Time</div>
            <div class="result-stat-value">${timeMinutes}m</div>
          </div>
        </div>
        <div class="result-buttons">
          <button class="result-btn result-btn-primary" id="restartBtn">RESTART</button>
          <button class="result-btn" id="shareBtn">SHARE</button>
        </div>
      </div>
    `;
    
    get('#resultCard').innerHTML = html;
    this.resultContainer.style.display = 'flex';
    fadeIn(this.resultContainer);
  }

  updateSyncBar(percentage) {
    this.syncPercentageBar.style.width = percentage + '%';
  }

  updateMuteButton(muted) {
    this.muteBtn.textContent = muted ? '🔇' : '🔊';
  }

  hideBoot() {
    fadeOut(this.bootContainer, 300);
    setTimeout(() => this.bootContainer.style.display = 'none', 300);
  }

  showGame() {
    this.gameContainer.style.display = 'flex';
    fadeIn(this.gameContainer);
  }

  showAchievementNotification(achievement) {
    const notification = createElement('div', 'notification');
    notification.innerHTML = `
      <div class="notification-icon">${achievement.icon}</div>
      <div class="notification-content">
        <div class="notification-title">${achievement.title}</div>
        <div class="notification-text">${achievement.description}</div>
      </div>
    `;
    
    this.notificationContainer.appendChild(notification);
    slideUp(notification);
    
    setTimeout(() => {
      fadeOut(notification, 200);
      setTimeout(() => notification.remove(), 200);
    }, 4000);
  }

  updateStats(level, streak, lives) {
    this.levelDisplayFooter.textContent = level;
    this.streakValueFooter.textContent = streak;
    this.livesValueFooter.textContent = lives;
  }
}

const uiManager = new UIManager();
