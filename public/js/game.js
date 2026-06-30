class GameManager {
  constructor() {
    this.questions = [
      {
        text: "What does backpropagation compute in neural networks?",
        category: "NEURAL NETWORKS 🧠",
        answers: ["Loss function values", "Computing gradients", "Layer weights", "Activation outputs"],
        correct: 1,
        hint: "It's how networks learn by calculating how much to adjust weights.",
        educational: {
          icon: "🧠",
          title: "Backpropagation",
          explanation: "Backpropagation calculates gradients of the loss function with respect to network weights, enabling optimization.",
          relevance: "Foundation of deep learning training"
        }
      },
      {
        text: "Which sensor technology enables a robot to perceive its 3D environment?",
        category: "ROBOTICS 🤖",
        answers: ["Accelerometer", "LIDAR", "Gyroscope", "Barometer"],
        correct: 1,
        hint: "It uses light pulses to create a 3D map.",
        educational: {
          icon: "🤖",
          title: "LIDAR",
          explanation: "LIDAR (Light Detection and Ranging) uses laser beams to measure distances and create precise 3D maps of environments.",
          relevance: "Critical for autonomous navigation"
        }
      },
      {
        text: "What is bias in machine learning models?",
        category: "AI ETHICS ⚖️",
        answers: ["Model preference for specific data", "Systematic errors from skewed training data", "Network initialization", "Learning rate setting"],
        correct: 1,
        hint: "It occurs when training data doesn't represent the real world fairly.",
        educational: {
          icon: "⚖️",
          title: "Bias in ML",
          explanation: "Bias represents systematic errors that arise when training data is skewed or unrepresentative, leading to unfair predictions.",
          relevance: "Essential for responsible AI"
        }
      },
      {
        text: "What does a convolutional layer do in computer vision?",
        category: "COMPUTER VISION 👁️",
        answers: ["Compresses image size", "Extracts local features", "Normalizes pixel values", "Augments training data"],
        correct: 1,
        hint: "It uses sliding filters to detect patterns.",
        educational: {
          icon: "👁️",
          title: "Convolutional Layers",
          explanation: "Convolutional layers apply learned filters across images to detect edges, textures, and increasingly complex features.",
          relevance: "Core to modern computer vision"
        }
      },
      {
        text: "What is batch normalization?",
        category: "AI TRAINING ⚙️",
        answers: ["Splitting data into batches", "Stabilizing learning by normalizing layer inputs", "Increasing batch size", "Reducing model parameters"],
        correct: 1,
        hint: "It standardizes inputs to each layer.",
        educational: {
          icon: "⚙️",
          title: "Batch Normalization",
          explanation: "Batch normalization normalizes layer inputs within each mini-batch, accelerating training and enabling higher learning rates.",
          relevance: "Improves training stability and speed"
        }
      },
      {
        text: "What is an embedding in NLP?",
        category: "NLP 💬",
        answers: ["Text formatting", "Vector representation of words", "Grammar correction", "Sentence tokenization"],
        correct: 1,
        hint: "It converts words into numerical vectors.",
        educational: {
          icon: "💬",
          title: "Word Embeddings",
          explanation: "Embeddings represent words as dense vectors in high-dimensional space, capturing semantic relationships and meaning.",
          relevance: "Foundation of modern NLP"
        }
      },
      {
        text: "What is the exploration-exploitation tradeoff in reinforcement learning?",
        category: "REINFORCEMENT LEARNING 🎮",
        answers: ["Training speed vs accuracy", "Balancing trying new actions vs using known good actions", "Model size vs memory", "Batch size vs epochs"],
        correct: 1,
        hint: "It's about trying new things vs using what you know works.",
        educational: {
          icon: "🎮",
          title: "Exploration vs Exploitation",
          explanation: "This tradeoff balances discovering new, potentially better strategies (exploration) versus repeating known successful actions (exploitation).",
          relevance: "Core challenge in RL algorithms"
        }
      },
      {
        text: "What is transfer learning?",
        category: "TRANSFER LEARNING 🔄",
        answers: ["Moving models between servers", "Adapting pretrained models to new tasks", "Transferring data formats", "Sharing model weights"],
        correct: 1,
        hint: "It reuses knowledge from one task for another.",
        educational: {
          icon: "🔄",
          title: "Transfer Learning",
          explanation: "Transfer learning leverages pretrained models on large datasets, fine-tuning them for new tasks with limited data.",
          relevance: "Enables efficient learning with limited resources"
        }
      },
      {
        text: "What is the attention mechanism in transformers?",
        category: "TRANSFORMERS 🔍",
        answers: ["Image focusing", "Weighting importance of input tokens", "Model memory", "Gradient scaling"],
        correct: 1,
        hint: "It allows models to focus on relevant parts of input.",
        educational: {
          icon: "🔍",
          title: "Attention Mechanism",
          explanation: "Attention computes weighted relevance scores between all input tokens, allowing models to focus on the most important parts.",
          relevance: "Enables context understanding in LLMs"
        }
      },
      {
        text: "What is a well-calibrated ML model?",
        category: "MODEL CALIBRATION 📊",
        answers: ["Perfectly accurate predictions", "Confidence matches accuracy rate", "Uses all features", "No overfitting"],
        correct: 1,
        hint: "When the model's confidence level is correct.",
        educational: {
          icon: "📊",
          title: "Model Calibration",
          explanation: "A calibrated model's predicted confidence matches its actual accuracy—if it says 80% confident, it's right 80% of the time.",
          relevance: "Critical for risk assessment applications"
        }
      }
    ];
    
    this.resetState();
  }

  resetState() {
    this.state = {
      currentQuestion: 0,
      lives: 3,
      score: 0,
      level: 1,
      xp: 0,
      streak: 0,
      combo: 1,
      achievements: new Set(),
      startTime: Date.now(),
      correctAnswers: 0,
      totalAnswered: 0
    };
  }

  getCurrentQuestion() {
    return this.questions[this.state.currentQuestion];
  }

  selectAnswer(index) {
    const question = this.getCurrentQuestion();
    return index === question.correct;
  }

  handleCorrect() {
    this.state.correctAnswers++;
    this.state.totalAnswered++;
    this.state.score += Math.floor(this.state.combo * 10);
    this.state.streak++;
    this.state.combo = Math.min(this.state.combo + 0.5, 2);
    this.checkAchievements();
  }

  handleWrong() {
    this.state.totalAnswered++;
    this.state.lives--;
    this.state.combo = 1;
    this.state.streak = 0;
  }

  nextQuestion() {
    this.state.currentQuestion++;
  }

  isGameOver() {
    return this.state.lives <= 0 || this.state.currentQuestion >= this.questions.length;
  }

  checkAchievements() {
    // first_contact: Start game
    if (this.state.totalAnswered === 1) {
      this.state.achievements.add('first_contact');
      return { id: 'first_contact', icon: '🚀', title: 'First Contact', description: 'Answered your first question!' };
    }
    
    // perfect_trio: Get 3 correct in a row
    if (this.state.streak === 3 && !this.state.achievements.has('perfect_trio')) {
      this.state.achievements.add('perfect_trio');
      return { id: 'perfect_trio', icon: '⚡', title: 'Perfect Trio', description: '3 correct answers in a row!' };
    }
    
    // no_mistakes: Complete game with all correct
    if (this.state.currentQuestion === this.questions.length && this.state.correctAnswers === this.questions.length) {
      this.state.achievements.add('no_mistakes');
      return { id: 'no_mistakes', icon: '✨', title: 'Flawless Victory', description: 'Perfect score!' };
    }
    
    return null;
  }

  endGame() {
    const accuracy = (this.state.correctAnswers / this.state.totalAnswered) * 100;
    const rank = this.calculateRank(accuracy);
    
    return {
      score: this.state.score,
      accuracy: Math.round(accuracy),
      correctAnswers: this.state.correctAnswers,
      totalAnswered: this.state.totalAnswered,
      time: Math.floor((Date.now() - this.state.startTime) / 1000),
      rank: rank,
      achievements: Array.from(this.state.achievements)
    };
  }

  calculateRank(accuracy) {
    if (accuracy >= 90) return '🏆 PRISDDLE ELITE';
    if (accuracy >= 80) return '💎 TITANIUM AI';
    if (accuracy >= 70) return '👑 GOLD ROBOT';
    if (accuracy >= 60) return '⭐ SILVER ROBOT';
    return '🤖 BRONZE ROBOT';
  }
}

const gameManager = new GameManager();
