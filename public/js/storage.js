class Storage {
  constructor() {
    this.prefix = 'prisddle_';
  }

  saveGameState(state) {
    const key = this.prefix + 'gameState';
    localStorage.setItem(key, JSON.stringify(state));
  }

  getGameState() {
    const key = this.prefix + 'gameState';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  clearGameState() {
    const key = this.prefix + 'gameState';
    localStorage.removeItem(key);
  }

  saveProgress(progress) {
    const key = this.prefix + 'userProgress';
    localStorage.setItem(key, JSON.stringify(progress));
  }

  getProgress() {
    const key = this.prefix + 'userProgress';
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  saveAchievements(achievements) {
    const key = this.prefix + 'achievements';
    localStorage.setItem(key, JSON.stringify(Array.from(achievements)));
  }

  getAchievements() {
    const key = this.prefix + 'achievements';
    const data = localStorage.getItem(key);
    return data ? new Set(JSON.parse(data)) : new Set();
  }

  saveSetting(key, value) {
    const fullKey = this.prefix + 'setting_' + key;
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  getSetting(key, defaultValue = null) {
    const fullKey = this.prefix + 'setting_' + key;
    const data = localStorage.getItem(fullKey);
    return data ? JSON.parse(data) : defaultValue;
  }

  clearAll() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    });
  }
}

const storage = new Storage();
